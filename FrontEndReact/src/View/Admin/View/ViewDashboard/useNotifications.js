import { useState, useEffect } from 'react';
import { genericResourcePUT, genericResourceGET, genericResourcePOST } from '../utility';

export const useNotification = (assessmentTaskId, isTeam, isDialogOpen) => {
  const [notificationStatus, setNotificationStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  // Fetch notification status when dialog opens
  useEffect(() => {
    if (isDialogOpen && assessmentTaskId) {
      fetchNotificationStatus();
    }
  }, [isDialogOpen, assessmentTaskId]);

  const fetchNotificationStatus = async () => {
    try {
      const response = await genericResourceGET(
        `/notification_status?assessment_task_id=${assessmentTaskId}&team=${isTeam}`,
        'notification_status'
      );
      
      if (response && response.notification_status) {
        setNotificationStatus(response.notification_status);
      }
    } catch (err) {
      console.error('Error fetching notification status:', err);
      setError({ general: 'Failed to load notification status' });
    }
  };

  const sendMassNotification = async (message, callback) => {
    if (!message.trim()) {
      setError({ notes: 'Notification Message cannot be empty' });
      return false;
    }

    setLoading(true);
    setError({});

    try {
      const response = await genericResourcePUT(
        `/mass_notification?assessment_task_id=${assessmentTaskId}&team=${isTeam}`,
        null,
        JSON.stringify({
          notification_message: message,
          date: new Date().toISOString(),
          notify_all: false
        })
      );

      if (response && response.errorMessage === null) {
        setLoading(false);
        if (callback) callback(true);
        return true;
      }
    } catch (err) {
      console.error('Error sending notification:', err);
      setError({ 
        general: err.message || 'Failed to send notifications. Please try again.' 
      });
      setLoading(false);
      if (callback) callback(false);
      return false;
    }

    setLoading(false);
    return false;
  };

  const sendSingleNotification = async (completedAssessmentId, message, callback) => {
    if (!message.trim()) {
      setError({ notes: 'Notification Message cannot be empty' });
      return false;
    }

    setLoading(true);
    setError({});

    try {
      const response = await genericResourcePOST(
        `/send_single_email?team=${isTeam}&completed_assessment_id=${completedAssessmentId}`,
        null,
        JSON.stringify({ 
          notification_message: message
        })
      );

      if (response && response.errorMessage === null) {
        setLoading(false);
        if (callback) callback(true);
        return true;
      }
    } catch (err) {
      console.error('Error sending single notification:', err);
      setError({ 
        general: err.message || 'Failed to send notification. Please try again.' 
      });
      setLoading(false);
      if (callback) callback(false);
      return false;
    }

    setLoading(false);
    return false;
  };

  return {
    notificationStatus,
    loading,
    error,
    setError,
    fetchNotificationStatus,
    sendMassNotification,
    sendSingleNotification
  };
};