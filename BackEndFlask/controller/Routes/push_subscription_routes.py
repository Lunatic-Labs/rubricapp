#------------------------------------------------------------
# This file holds the routes that let a logged-in user opt in
# (or out) of Web Push notifications from a given browser/
# device, and exposes the VAPID public key the frontend needs
# before it can create a subscription in the first place.
#------------------------------------------------------------

import os
from urllib.parse import urlparse
from flask import request
from controller import bp
from controller.Route_response import *
from models.push_subscription import upsert_subscription, delete_subscription_by_endpoint_for_user
from models.logger import logger
from flask_jwt_extended import jwt_required

from controller.security.CustomDecorators import (
    AuthCheck, bad_token_check
)

# Browser push subscriptions are only ever issued by these vendors' push
# services (the Push API spec has no provision for a browser returning any
# other endpoint). Restricting to this allowlist closes an SSRF hole: without
# it, a client could submit an arbitrary "endpoint" URL (e.g. pointing at an
# internal service), which send_push_notification() would later have the
# server itself make an outbound request to.
_ALLOWED_PUSH_ENDPOINT_HOSTS = (
    'fcm.googleapis.com',               # Chrome, Edge, Opera, Android
    'updates.push.services.mozilla.com', # Firefox
)
_ALLOWED_PUSH_ENDPOINT_HOST_SUFFIXES = (
    '.push.apple.com',  # Safari, iOS/macOS
)


def _is_allowed_push_endpoint(endpoint: str) -> bool:
    try:
        parsed = urlparse(endpoint)
    except ValueError:
        return False
    if parsed.scheme != 'https' or not parsed.hostname:
        return False
    host = parsed.hostname.lower()
    return (
        host in _ALLOWED_PUSH_ENDPOINT_HOSTS
        or any(host.endswith(suffix) for suffix in _ALLOWED_PUSH_ENDPOINT_HOST_SUFFIXES)
    )


@bp.route('/vapid_public_key', methods=['GET'])
@jwt_required()
@bad_token_check()
def get_vapid_public_key():
    """
    Description:
    Returns the server's VAPID public key, which the frontend passes to
    PushManager.subscribe() before a push subscription can be created. Not
    a secret -- every push service and every subscribing browser needs it --
    so this only requires a valid session, not a specific user's own data,
    unlike the subscribe/unsubscribe routes below.

    Parameters:
    None

    Returns:
    Good response with the public key, or bad response if it isn't configured.
    """
    try:
        public_key = os.getenv('VAPID_PUBLIC_KEY')
        if not public_key:
            return create_bad_response(
                "Push notifications are not configured on this server.",
                "vapid_public_key",
                400
            )
        return create_good_response(
            {"public_key": public_key},
            200,
            "vapid_public_key"
        )
    except Exception as e:
        logger.exception(f"Failed to fetch the VAPID public key: {e}")
        return create_bad_response(
            "An error occurred fetching the VAPID public key.",
            "vapid_public_key",
            500
        )


@bp.route('/push_subscription', methods=['POST'])
@jwt_required()
@bad_token_check()
@AuthCheck()
def subscribe_to_push():
    """
    Description:
    Saves (or updates) a push subscription for the current user, from the
    subscription object the browser's PushManager.subscribe() returns.

    Parameters (from query args / json):
        user_id: <class 'int'>                [query arg]
        endpoint: <class 'str'>                [json]
        keys: <class 'dict'> ({p256dh, auth})  [json]

    Returns:
        Good or bad response.
    """
    try:
        user_id = int(request.args.get('user_id'))
        endpoint = request.json['endpoint']
        keys = request.json['keys']

        if not _is_allowed_push_endpoint(endpoint):
            return create_bad_response(
                "Unsupported push subscription endpoint.",
                "push_subscription",
                400
            )

        subscription = upsert_subscription(
            user_id=user_id,
            endpoint=endpoint,
            p256dh=keys['p256dh'],
            auth=keys['auth'],
        )

        return create_good_response(
            {"push_subscription_id": subscription.push_subscription_id},
            201,
            "push_subscription"
        )
    except (TypeError, KeyError) as e:
        return create_bad_response(
            "Missing or invalid subscription data.",
            "push_subscription",
            400
        )
    except Exception as e:
        logger.exception(f"Failed to save push subscription: {e}")
        return create_bad_response(
            "An error occurred saving the push subscription.",
            "push_subscription",
            500
        )


@bp.route('/push_subscription', methods=['DELETE'])
@jwt_required()
@bad_token_check()
@AuthCheck()
def unsubscribe_from_push():
    """
    Description:
    Removes a push subscription -- used when a user explicitly turns push
    notifications off from this browser/device.

    Parameters (from query args / json):
        user_id: <class 'int'>  [query arg] (AuthCheck already verified this
            matches the caller's own token; also used here to scope the
            delete to the caller's own subscription, since the endpoint
            alone -- the browser's own unsubscribe identifier -- isn't
            proof of ownership)
        endpoint: <class 'str'> [json]

    Returns:
        Good or bad response.
    """
    try:
        user_id = int(request.args.get('user_id'))
        endpoint = request.json['endpoint']
        delete_subscription_by_endpoint_for_user(user_id, endpoint)

        return create_good_response(
            "Unsubscribed",
            200,
            "push_subscription"
        )
    except (TypeError, KeyError) as e:
        return create_bad_response(
            "Missing or invalid subscription data.",
            "push_subscription",
            400
        )
    except Exception as e:
        logger.exception(f"Failed to remove push subscription: {e}")
        return create_bad_response(
            "An error occurred removing the push subscription.",
            "push_subscription",
            500
        )
