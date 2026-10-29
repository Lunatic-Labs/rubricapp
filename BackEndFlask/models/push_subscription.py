from core import db
from models.schemas import PushSubscription


def upsert_subscription(user_id: int, endpoint: str, p256dh: str, auth: str) -> PushSubscription:
    """
    Description:
    Saves a push subscription for a user. If this exact endpoint (one
    browser/device) is already subscribed -- by this user or a previous one
    on a shared device -- its keys and owner are updated in place instead of
    inserting a duplicate row, since a browser's own subscribe() call
    returns the same endpoint on repeat calls.

    Parameters:
    user_id: <class 'int'>
    endpoint: <class 'str'> (the browser-issued push service URL)
    p256dh: <class 'str'> (subscription key)
    auth: <class 'str'> (subscription key)

    Returns:
    PushSubscription (the created or updated record)
    """
    existing = PushSubscription.query.filter_by(endpoint=endpoint).first()

    if existing:
        existing.user_id = user_id
        existing.p256dh = p256dh
        existing.auth = auth
        db.session.commit()
        return existing

    subscription = PushSubscription(
        user_id=user_id,
        endpoint=endpoint,
        p256dh=p256dh,
        auth=auth,
    )
    db.session.add(subscription)
    db.session.commit()
    return subscription


def get_subscriptions_for_user(user_id: int) -> list[PushSubscription]:
    """
    Description:
    Returns every device/browser subscription a user has opted in from.

    Parameters:
    user_id: <class 'int'>

    Returns:
    list[PushSubscription]
    """
    return PushSubscription.query.filter_by(user_id=user_id).all()


def get_subscriptions_for_users(user_ids: list[int]) -> list[PushSubscription]:
    """
    Description:
    Returns every subscription belonging to any of the given users --
    the shape callers that broadcast to several people (e.g. all admins)
    actually need, so they aren't doing one query per recipient.

    Parameters:
    user_ids: <class 'list[int]'>

    Returns:
    list[PushSubscription]
    """
    if not user_ids:
        return []
    return PushSubscription.query.filter(PushSubscription.user_id.in_(user_ids)).all()


def delete_subscription_by_endpoint(endpoint: str) -> bool:
    """
    Description:
    Removes a subscription by its endpoint -- used both for an explicit
    unsubscribe from the frontend, and to clean up a subscription the push
    service has reported as gone (expired/unsubscribed on the browser's
    side, surfaced as a 404/410 from webpush()).

    Parameters:
    endpoint: <class 'str'>

    Returns:
    bool (True if a row was deleted, False if no matching subscription existed)
    """
    deleted = PushSubscription.query.filter_by(endpoint=endpoint).delete()
    db.session.commit()
    return deleted > 0
