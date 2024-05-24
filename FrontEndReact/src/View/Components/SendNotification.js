import React from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { TextField } from "@mui/material";
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function ResponsiveNotification ( props ) {
    return (
        <React.Fragment>
                <Dialog
                    fullScreen={false}
                    open={props.show}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">
                        {"Add Message"}
                    </DialogTitle>

                    <DialogContent>
                        <DialogContentText>
                            This message will be added to the Email Notification.
                        </DialogContentText>
                            <TextField
                                id="notes"
                                name="notes"
                                variant='outlined'
                                label="Add Message"
                                value={props.notes}
                                error={!!props.error.notes}
                                helperText={props.error.notes}
                                onChange={props.handleChange}
                                required
                                multiline
                                fullWidth
                                minRows={2}
                                maxRows={8}
                                sx={{ mb: 2, mt: 2 }}
                                aria-label="viewCompletedAssessmentAddMessageTitle"
                            />
                    </DialogContent>

                    <DialogActions>
                        <Button autoFocus onClick={props.handleDialog} aria-label="addMessagePromptCancelButton">
                            Cancel
                        </Button>

                        <Button variant="contained" autoFocus onClick={props.sendNotification} aria-label="addMessagePromptSendNotificationButton">
                            Send Notification
                        </Button>
                    </DialogActions>
                </Dialog>
        </React.Fragment>
    )
}