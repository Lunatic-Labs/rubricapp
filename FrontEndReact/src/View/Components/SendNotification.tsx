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

export default function ResponsiveNotification ( props: any ) {
    return (
        // @ts-expect-error TS(2307): Cannot find module 'react/jsx-runtime' or its corr... Remove this comment to see the full error message
        <React.Fragment>
                <Dialog
                    fullScreen={false}
                    open={props.show}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogContent>
                        <DialogContentText>
                        Your skill development assessment is available to view and act upon. Please log in to SkillBuilder (skill-builder.net) and look in Your Completed Assessments.
                        </DialogContentText>
                    </DialogContent>

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