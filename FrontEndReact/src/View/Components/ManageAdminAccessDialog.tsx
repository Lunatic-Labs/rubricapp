/**
   * Super-admin dialog for granting or removing the global admin flag, by email
   * (students aren't listed in the users table, so email is the only handle).
   *
**/

import { Dialog, DialogTitle, DialogContentText, TextField, DialogActions, Button } from "@mui/material";
import { Component, ChangeEvent } from "react";
import React from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import CustomButton from "./CustomButton";
import CustomizedSwitches from "./genericIOSButton";
import { Email } from "@mui/icons-material";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const StatusChanges = {
    Demote: "Demote",
    Promote: "Promote",
} as const;
type StatusChange = (typeof StatusChanges)[keyof typeof StatusChanges];

const EmailErrors = {
    NoError:"",
    Invalid:"Enter a valid email address",
} as const;
type EmailError = (typeof EmailErrors)[keyof typeof EmailErrors];

interface ManageAdminsAccessDialogProps {
    open: boolean;
    onClose: () => void;
}

interface ManageAdminsAccessDialogState {
    email: string;
    error: EmailError;
    touched: boolean;
    changeStatusTo: StatusChange;
}

class ManageAdminsAccessDialog extends Component<ManageAdminsAccessDialogProps, ManageAdminsAccessDialogState>{
    constructor(props:ManageAdminsAccessDialogProps) {
        super(props);
        this.state = {
            email: "",
            error: EmailErrors.NoError,
            touched: false,
            changeStatusTo: StatusChanges.Demote,
        }
    }

    private handleSubmit = () => {

    }

    private handleClose = () => {
        this.setState({
            email: "",
            error: EmailErrors.NoError,
            touched: false,
            changeStatusTo: StatusChanges.Demote,
        });
        this.props.onClose();
    };

    private handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        this.setState({ email: e.target.value, error: EmailErrors.NoError });
    };

    private handleBlur = () =>{
        this.setState(({ email }) => ({
            touched: true,
            error: email.length > 0 && !EMAIL_REGEX.test(email)
                ? EmailErrors.Invalid
                : EmailErrors.NoError,
      }));
    };

    private handleFocus = () => {
        this.setState({
            touched:false,
        });
    }

    private isEmailValid() {
        const {email} = this.state;
        if (email.length > 0 && EMAIL_REGEX.test(email)){
            return true;
        }
        return false;
    }

    private isReadyToSend() {
        const {error} = this.state;
        return (error.length === 0 
            && this.isEmailValid()
        );
    }

    render() {
        const {
            email, 
            error
        } = this.state; 
        return (
            <Dialog open={this.props.open} onClose={this.handleClose} fullWidth maxWidth="xs">
                <DialogTitle sx={{textAlign: "center"}}>Manage Admin Access</DialogTitle>
                {
                //<DialogContentText sx={{ textAlign: "center" }}>
                //    Enter the email of the user you want to change, then choose whether to
                //    promote them to admin or remove their admin access.
                //</DialogContentText>
                }
                <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
                    <TextField
                    id="email" 
                    name="email"
                    variant="outlined"
                    label="User Email"
                    className="text-box-colors"
                    fullWidth
                    value={email}
                    error={error !== EmailErrors.NoError}
                    helperText={error}
                    onChange={this.handleChange}
                    onBlur={this.handleBlur}
                    onFocus={this.handleFocus}
                    required
                    sx={{ 
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: 'var(--textbox-bg)',
                            color: 'var(--textbox-text)',
                            '& fieldset': {
                                borderColor: 'var(--textbox-border)',
                            },
                            '&:hover fieldset': {
                                borderColor: 'var(--textbox-border-hover)',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'var(--textbox-border-focused)',
                            },
                            '&.Mui-error fieldset': {
                                borderColor: 'var(--textbox-error)',
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: 'var(--textbox-label)',
                            '&.Mui-focused': {
                                color: 'var(--textbox-border-focused)',
                            },
                            '&.Mui-error': {
                                color: 'var(--textbox-error)',
                            },
                        },
                    }}
                    data-testid="manage-admin-access-email"
                />
                </DialogActions>
                <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
                    {CustomizedSwitches()}
                </DialogActions>
                <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
                    <Button
                        className="primary-color"
                        variant='contained'
                        onClick={this.handleClose}
                    >Cancel</Button>
                    <Button
                        className="primary-color"
                        variant='contained'
                        onClick={this.handleSubmit}
                        disabled={!this.isReadyToSend()}
                    >{this.state.changeStatusTo}</Button >
                </DialogActions>
            </Dialog>
        )
    }
}

export default ManageAdminsAccessDialog;
