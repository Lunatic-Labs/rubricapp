import os
import json
import requests
from pywebpush import webpush, WebPushException
from Functions.helper import is_allowed_push_endpoint
from models.push_subscription import get_subscriptions_for_users, delete_subscription_by_endpoint
from models.logger import logger

# Shared across every call -- a plain requests.Session with redirects
# disabled. The allowlist check in is_allowed_push_endpoint() only inspects
# the endpoint URL's text at save time (and again here, before sending);
# neither catches a destination that passes that check but then responds
# with an HTTP redirect at request time, which `requests` would otherwise
# follow automatically, including to a private/internal address. Setting
# max_redirects=0 makes it raise requests.exceptions.TooManyRedirects on the
# very first redirect instead of silently following it.
_no_redirect_session = requests.Session()
_no_redirect_session.max_redirects = 0


def send_push_notification(user_ids: list[int], title: str, body: str) -> bool:
    """
    Description:
    Sends a Web Push notification to every subscribed browser/device
    belonging to the given users. Mirrors how email_admins_notification()
    and email_students_feedback_is_ready_to_view() are called -- meant to
    run alongside those, as a second delivery channel, not a replacement.

    A push service reporting 404/410 means that specific subscription is
    gone (the user revoked permission, cleared site data, uninstalled the
    PWA, ...) -- not a failure of this send. That one subscription is
    cleaned up and every other recipient is still notified normally.

    Parameters:
    user_ids: <class 'list[int]'> (who should receive this)
    title: <class 'str'>
    body: <class 'str'>

    Returns:
    bool: True only if at least one subscription was actually accepted by
    its push service. False if VAPID isn't configured, there were no
    subscriptions to send to, or every attempt failed/was refused --
    callers combine this with their email result to decide whether at
    least one delivery channel actually got through before recording a
    notification as sent. Cleaning up a stale (404/410) subscription does
    not by itself count as a successful delivery.

    Exceptions:
    None -- per-subscription failures are logged and skipped so one bad
    subscription can't block the rest of a broadcast.
    """
    private_key = os.getenv('VAPID_PRIVATE_KEY')
    subject = os.getenv('VAPID_SUBJECT')
    if not private_key or not subject:
        logger.error("Push notification not sent: VAPID keys are not configured.")
        return False

    subscriptions = get_subscriptions_for_users(user_ids)
    payload = json.dumps({"title": title, "body": body})

    any_accepted = False

    for subscription in subscriptions:
        try:
            if not is_allowed_push_endpoint(subscription.endpoint):
                logger.error(f"Refusing to send push notification to disallowed endpoint: {subscription.endpoint}")
                continue  # Skip the subscription and go onto the next one

            webpush(
                subscription_info={
                    "endpoint": subscription.endpoint,
                    "keys": {
                        "p256dh": subscription.p256dh,
                        "auth": subscription.auth,
                    },
                },
                data=payload,
                vapid_private_key=private_key,
                vapid_claims={"sub": subject},
                requests_session=_no_redirect_session,
            )
            any_accepted = True
        except requests.exceptions.TooManyRedirects:
            logger.error(f"Refusing to follow a redirect while pushing to subscription {subscription.push_subscription_id}")
        except WebPushException as e:
            status_code = e.response.status_code if e.response is not None else None
            if status_code in (404, 410):
                delete_subscription_by_endpoint(subscription.endpoint)
            else:
                logger.error(f"Push notification failed for subscription {subscription.push_subscription_id}: {e}")

    return any_accepted
