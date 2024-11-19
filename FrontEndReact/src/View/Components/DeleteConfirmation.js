import React from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function DeleteConfirmation( props ) {
    var userInformation = `${props.userFirstName} ${props.userLastName}`;

    return (
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
                            Warning! This action can not be undone. <br></br>
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