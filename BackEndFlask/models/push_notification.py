import os
import json
from pywebpush import webpush, WebPushException
from models.push_subscription import get_subscriptions_for_users, delete_subscription_by_endpoint
from models.logger import logger


def send_push_notification(user_ids: list[int], title: str, body: str) -> None:
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
    None

    Exceptions:
    None -- per-subscription failures are logged and skipped so one bad
    subscription can't block the rest of a broadcast.
    """
    private_key = os.getenv('VAPID_PRIVATE_KEY')
    subject = os.getenv('VAPID_SUBJECT')
    if not private_key or not subject:
        logger.error("Push notification not sent: VAPID keys are not configured.")
        return

    subscriptions = get_subscriptions_for_users(user_ids)
    payload = json.dumps({"title": title, "body": body})

    for subscription in subscriptions:
        try:
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
            )
        except WebPushException as e:
            status_code = e.response.status_code if e.response is not None else None
            if status_code in (404, 410):
                delete_subscription_by_endpoint(subscription.endpoint)
            else:
                logger.error(f"Push notification failed for subscription {subscription.push_subscription_id}: {e}")
