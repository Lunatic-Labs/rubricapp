import React from 'react';
import { Box, Switch, Typography, CircularProgress } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import {
  isPushSupported,
  getExistingPushSubscription,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
} from '../../utils/pushNotifications';

// Self-contained: checks its own current subscription state on mount and
// handles subscribing/unsubscribing itself, so it can just be dropped into
// a page (UserAccount.tsx) without that page needing to know anything about
// push notifications itself.
const PushNotificationToggle = () => {
  const [supported, setSupported] = React.useState(true);
  const [subscribed, setSubscribed] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (!isPushSupported()) {
      setSupported(false);
      setLoading(false);
      return;
    }
    getExistingPushSubscription()
      .then((subscription) => setSubscribed(subscription != null))
      .catch(() => setError('Could not check your current notification settings.'))
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = async () => {
    setLoading(true);
    setError('');
    try {
      if (subscribed) {
        await unsubscribeFromPushNotifications();
        setSubscribed(false);
      } else {
        await subscribeToPushNotifications();
        setSubscribed(true);
      }
    } catch (err) {
      // A user declining the browser's own permission prompt lands here
      // too (PushManager.subscribe() rejects), which isn't really an
      // "error" worth alarming them about -- surface it the same way
      // either way, since there's nothing actionable to tell apart.
      setError(err instanceof Error ? err.message : 'Could not update your notification settings.');
    } finally {
      setLoading(false);
    }
  };

  if (!supported) {
    return null;
  }

  return (
    <Box mb={2}>
      <Box display="flex" alignItems="center">
        <NotificationsIcon fontSize="large" />
        <Typography variant="h6" ml={1} sx={{ flexGrow: 1 }}>
          Push Notifications
        </Typography>
        {loading ? (
          <CircularProgress size={24} data-testid="push-notification-loading" />
        ) : (
          <Switch
            checked={subscribed}
            onChange={handleToggle}
            inputProps={{ 'aria-label': 'Toggle push notifications' }}
            data-testid="push-notification-toggle"
          />
        )}
      </Box>
      {error && (
        <Typography variant="body2" sx={{ color: 'var(--error-color)' }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default PushNotificationToggle;
