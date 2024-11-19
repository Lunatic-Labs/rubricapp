import React from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { TextField } from "@mui/material";
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function SendMessageModal ( props ) {
    return (
        <React.Fragment>
            <Dialog
                fullScreen={false}
                open={props.show}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {"Send Notification to Admins"}
                </DialogTitle>

                <DialogContent>
                    <DialogContentText>
                        Use this form to send a message to all admin users. This notification will be delivered to their registered email addresses.
                    </DialogContentText>
                </DialogContent>

                <DialogContent>
                    <TextField
                        id="emailSubject"
                        name="emailSubject"
                        variant='outlined'
                        label="Subject"
                        value={props.subject}
                        error={!!props.error.subject}
                        helperText={props.error.subject}
                        onChange={props.handleChange}
                        required
                        fullWidth
                        sx={{ mb: 2 }}
                        aria-label="sendNotificationSubjectInput"
                    />
                </DialogContent>

                <DialogContent>
                    <TextField
                        id="emailMessage"
                        name="emailMessage"
                        variant='outlined'
                        label="Message"
                        value={props.message}
                        error={!!props.error.message}
                        helperText={props.error.message}
                        onChange={props.handleChange}
                        required
                        multiline
                        fullWidth
                        minRows={3}
                        maxRows={8}
                        sx={{ mb: 2 }}
                        aria-label="sendNotificationMessageInput"
                    />
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={props.handleDialog}
                        aria-label="sendNotificationCancelButton"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={props.sendNotification}
                        aria-label="sendNotificationSendButton"
                    >
                        Send Notification
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
