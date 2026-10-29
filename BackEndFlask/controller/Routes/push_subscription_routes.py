#------------------------------------------------------------
# This file holds the routes that let a logged-in user opt in
# (or out) of Web Push notifications from a given browser/
# device, and exposes the VAPID public key the frontend needs
# before it can create a subscription in the first place.
#------------------------------------------------------------

import os
from flask import request
from controller import bp
from controller.Route_response import *
from models.push_subscription import upsert_subscription, delete_subscription_by_endpoint
from flask_jwt_extended import jwt_required

from controller.security.CustomDecorators import (
    AuthCheck, bad_token_check
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
        return create_bad_response(
            f"An error occurred fetching the VAPID public key: {e}",
            "vapid_public_key",
            400
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
    except Exception as e:
        return create_bad_response(
            f"An error occurred saving the push subscription: {e}",
            "push_subscription",
            400
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
        user_id: <class 'int'>  [query arg] (unused beyond AuthCheck's own
            verification that the caller is who they claim to be; the
            subscription itself is looked up and removed by endpoint, since
            that's the identifier the browser's own unsubscribe gives back)
        endpoint: <class 'str'> [json]

    Returns:
        Good or bad response.
    """
    try:
        endpoint = request.json['endpoint']
        delete_subscription_by_endpoint(endpoint)

        return create_good_response(
            "Unsubscribed",
            200,
            "push_subscription"
        )
    except Exception as e:
        return create_bad_response(
            f"An error occurred removing the push subscription: {e}",
            "push_subscription",
            400
        )
