// @ts-expect-error TS(2307): Cannot find module 'react' or its corresponding ty... Remove this comment to see the full error message
import React from "react";
// @ts-expect-error TS(2307): Cannot find module '@mui/material/Button' or its c... Remove this comment to see the full error message
import Button from '@mui/material/Button';
// @ts-expect-error TS(2307): Cannot find module '@mui/material/Dialog' or its c... Remove this comment to see the full error message
import Dialog from '@mui/material/Dialog';
// @ts-expect-error TS(2307): Cannot find module '@mui/material' or its correspo... Remove this comment to see the full error message
import { TextField } from "@mui/material";
// @ts-expect-error TS(2307): Cannot find module '@mui/material/DialogActions' o... Remove this comment to see the full error message
import DialogActions from '@mui/material/DialogActions';
// @ts-expect-error TS(2307): Cannot find module '@mui/material/DialogContent' o... Remove this comment to see the full error message
import DialogContent from '@mui/material/DialogContent';
// @ts-expect-error TS(2307): Cannot find module '@mui/material/DialogContentTex... Remove this comment to see the full error message
import DialogContentText from '@mui/material/DialogContentText';
// @ts-expect-error TS(2307): Cannot find module '@mui/material/DialogTitle' or ... Remove this comment to see the full error message
import DialogTitle from '@mui/material/DialogTitle';

export default function SendMessageModal ( props: any ) {
    return (
        // @ts-expect-error TS(2307): Cannot find module 'react/jsx-runtime' or its corr... Remove this comment to see the full error message
        <React.Fragment>
            <Dialog
                fullScreen={false}
                open={props.show}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {"Send Message to Admins"}
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
                        label="Add Subject"
                        value={props.emailSubject}
                        error={!!props.error.emailSubject}
                        helperText={props.error.emailSubject}
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
                        label="Add Message"
                        value={props.emailMessage}
                        error={!!props.error.emailMessage}
                        helperText={props.error.emailMessage}
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
                    <Button autoFocus onClick={props.handleDialog} aria-label="addMessagePromptCancelButton">
                        Cancel
                    </Button>
                    {/* <Button variant="contained" autoFocus onClick={props.sendNotification} aria-label="addMessagePromptSendNotificationButton">
                        Send Message
                    </Button> */}
                    <Button 
                        variant="contained" 
                        onClick={() => {
                            props.sendNotification(); 
                            props.handleDialog();    
                        }} 
                        aria-label="addMessagePromptSendNotificationButton"
                    >
                        Send Message
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
