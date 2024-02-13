import React from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function ResponsiveDialog( props ) {
    var userInformation = `${props.userFirstName} ${props.userLastName}`;
    return (
        <React.Fragment>
                <Dialog
                    fullScreen={false}
                    open={props.show}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">
                    {`Are you sure you want to drop ${userInformation}?`}
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText>
                        Warning! This action can not be undone. <br></br>
                        Dropping an user will <strong> permanently remove </strong> their information from the current course. 
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button autoFocus onClick={props.handleDialog}>
                        Cancel
                    </Button>
                    <Button variant="contained" autoFocus onClick={props.dropUser}>
                        Drop User
                    </Button>
                    </DialogActions>
                </Dialog>            
        </React.Fragment>
    )
}