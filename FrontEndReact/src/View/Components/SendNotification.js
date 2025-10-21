import React from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { TextField, Alert, Box, Typography, Chip } from "@mui/material";
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';

export default function ResponsiveNotification(props) {
  const {
    show,
    handleDialog,
    sendNotification,
    notes,
    handleChange,
    error,
    loading,
    notificationStatus,
    type = "mass", // "mass" or "single"
    recipientName = "" // For single notifications
  } = props;

  return (
    <React.Fragment>
      <Dialog
        fullScreen={false}
        open={show}
        onClose={handleDialog}
        aria-labelledby="responsive-dialog-title"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="responsive-dialog-title">
          {type === "single" 
            ? `Send Notification${recipientName ? ` to ${recipientName}` : ""}` 
            : "Send Notification to Students"
          }
        </DialogTitle>

        <DialogContent>
          {/* Notification Status Section - Only for mass notifications */}
          {type === "mass" && notificationStatus && (
            <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid #e0e0e0' }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Notification Status
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
                <Chip 
                  label={`Ready to notify: ${notificationStatus.ready_to_notify_count || 0}`}
                  color="primary"
                  variant="outlined"
                />
                <Chip 
                  label={`Already notified: ${notificationStatus.already_notified_count || 0}`}
                  color="success"
                  variant="outlined"
                />
                <Chip 
                  label={`Still grading: ${notificationStatus.still_grading_count || 0}`}
                  color="default"
                  variant="outlined"
                />
              </Box>

              {notificationStatus.due_date && (
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Due Date: {new Date(notificationStatus.due_date).toLocaleDateString()}
                  {notificationStatus.due_date_passed && (
                    <Chip 
                      label="Past Due" 
                      color="warning" 
                      size="small" 
                      sx={{ ml: 1 }}
                    />
                  )}
                </Typography>
              )}

              {notificationStatus.last_notification_sent && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Last notification sent: {new Date(notificationStatus.last_notification_sent).toLocaleString()}
                </Typography>
              )}
            </Box>
          )}

          {/* Warning if no students to notify */}
          {type === "mass" && notificationStatus && notificationStatus.ready_to_notify_count === 0 && (
            <Alert severity="info" sx={{ mb: 2 }}>
              No students are ready to be notified. Make sure assessments are locked (graded) before sending notifications.
            </Alert>
          )}

          {/* General error */}
          {error.general && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error.general}
            </Alert>
          )}

          {/* Default notification message */}
          <DialogContentText sx={{ mb: 2 }}>
            Your skill development assessment is available to view and act upon. 
            Please log in to SkillBuilder (skill-builder.net) and look in Your Completed Assessments.
          </DialogContentText>

          {/* Custom message input */}
          <DialogContentText>
            {type === "mass" 
              ? "Add an additional message to the email notification:"
              : "Enter your message:"
            }
          </DialogContentText>
          
          <TextField
            id="notes"
            name="notes"
            variant='outlined'
            label={type === "mass" ? "Additional Message" : "Message"}
            value={notes}
            error={!!error.notes}
            helperText={error.notes || (type === "mass" ? "This will be appended to the notification email" : "")}
            onChange={handleChange}
            required
            multiline
            fullWidth
            minRows={2}
            maxRows={8}
            sx={{ mb: 2, mt: 1 }}
            aria-label="viewCompletedAssessmentAddMessageTitle"
          />

          {/* Loading indicator */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress />
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button 
            onClick={handleDialog} 
            aria-label="addMessagePromptCancelButton"
            disabled={loading}
          >
            Cancel
          </Button>
          
          <Button 
            variant="contained" 
            onClick={sendNotification} 
            aria-label="addMessagePromptSendNotificationButton"
            disabled={
              loading || 
              (type === "mass" && notificationStatus && notificationStatus.ready_to_notify_count === 0)
            }
          >
            {loading 
              ? 'Sending...' 
              : type === "mass"
                ? `Send to ${notificationStatus?.ready_to_notify_count || 0} Students`
                : 'Send Notification'
            }
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}