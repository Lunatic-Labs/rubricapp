// @ts-expect-error TS(2307): Cannot find module 'react' or its corresponding ty... Remove this comment to see the full error message
import React from "react";
// @ts-expect-error TS(2307): Cannot find module '@mui/material/Button' or its c... Remove this comment to see the full error message
import Button from '@mui/material/Button';
// @ts-expect-error TS(2307): Cannot find module '@mui/material/Dialog' or its c... Remove this comment to see the full error message
import Dialog from '@mui/material/Dialog';
// @ts-expect-error TS(2307): Cannot find module '@mui/material/DialogActions' o... Remove this comment to see the full error message
import DialogActions from '@mui/material/DialogActions';
// @ts-expect-error TS(2307): Cannot find module '@mui/material/DialogContent' o... Remove this comment to see the full error message
import DialogContent from '@mui/material/DialogContent';
// @ts-expect-error TS(2307): Cannot find module '@mui/material/DialogContentTex... Remove this comment to see the full error message
import DialogContentText from '@mui/material/DialogContentText';
// @ts-expect-error TS(2307): Cannot find module '@mui/material/DialogTitle' or ... Remove this comment to see the full error message
import DialogTitle from '@mui/material/DialogTitle';

export default function DeleteConfirmation( props: any ) {
    var userInformation = `${props.userFirstName} ${props.userLastName}`;

    return (
        // @ts-expect-error TS(2307): Cannot find module 'react/jsx-runtime' or its corr... Remove this comment to see the full error message
        <React.Fragment>
                <Dialog
                    fullScreen={false}
                    open={props.show}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">
                        {"Confirm Deleting User"}
                    </DialogTitle>

                    <DialogContent>
                        <DialogContentText>
                            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                            Warning! This action can not be undone. <br></br>
                            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                            Deleting will permanently remove <strong> {userInformation} </strong> from the entire database. 
                        </DialogContentText>
                    </DialogContent>

                    <DialogActions>
                        <Button autoFocus onClick={props.handleDialog}>
                            Cancel
                        </Button>

                        <Button variant="contained" autoFocus onClick={props.deleteUser}>
                            Delete User
                        </Button>
                    </DialogActions>
                </Dialog>
        </React.Fragment>
    )
}