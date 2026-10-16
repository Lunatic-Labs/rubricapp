/**
   * Super-admin dialog for granting or removing the global admin flag, by email
   * (students aren't listed in the users table, so email is the only handle).
   *
**/

import { Dialog, DialogTitle, DialogContentText, TextField, DialogActions, Button } from "@mui/material";
import { Component, ChangeEvent } from "react";
import CustomizedSwitches from "./genericIOSButton";
import { RequestState, REQUEST_STATE } from "../../Enums/RequestState";
import { genericResourcePUT } from "../../utility";
import Loading from "../Loading/Loading";

const AUTO_CLOSE_TIMER_MS = 3000;
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
    requestState: RequestState;
    autoCloseTimer: ReturnType<typeof setTimeout> | null;
}

class ManageAdminsAccessDialog extends Component<ManageAdminsAccessDialogProps, ManageAdminsAccessDialogState>{
    constructor(props:ManageAdminsAccessDialogProps) {
        super(props);
        this.state = {
            email: "",
            error: EmailErrors.NoError,
            touched: false,
            changeStatusTo: StatusChanges.Demote,
            requestState: REQUEST_STATE.IDLE,
            autoCloseTimer: null,
        }
    }

    private handleSubmit = async() => {
        const {
            email,
            changeStatusTo,
            requestState
        } = this.state;

        if (requestState === REQUEST_STATE.LOADING){return;}
        this.setState({
            requestState: REQUEST_STATE.LOADING,
        });

        const action = changeStatusTo === StatusChanges.Promote ? "promote" : "demote";
        const url = `/super_admin_user/${action}?target_email=${encodeURIComponent(email)}`;

        const result = await genericResourcePUT(url, this, "");
        this.setState({
            requestState: result.errorMessage
                ? REQUEST_STATE.ERROR
                : REQUEST_STATE.SUCCESS,
        });
    }

    private handleClose = () => {
        if (this.state.autoCloseTimer) {
            clearTimeout(this.state.autoCloseTimer);
        }
        this.setState({
            email: "",
            error: EmailErrors.NoError,
            touched: false,
            changeStatusTo: StatusChanges.Demote,
            requestState: REQUEST_STATE.IDLE,
            autoCloseTimer: null,
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

    private renderBody() {
        const {
            email,
            error,
            requestState,
        } = this.state;

        switch (requestState) {
            case REQUEST_STATE.LOADING:
                return <Loading></Loading>
            case REQUEST_STATE.SUCCESS:
                return <Button>Success</Button>;
            case REQUEST_STATE.ERROR:
                return <Button>Error</Button>;
            default:
                return (
                    <>
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
                    </>
                );
        }
    }

    componentDidUpdate(_prevProps: ManageAdminsAccessDialogProps, prevState: ManageAdminsAccessDialogState) {
        const {requestState} = this.state;
        const isDialogEOL = requestState === REQUEST_STATE.ERROR
            || requestState === REQUEST_STATE.SUCCESS
        ;

        if (isDialogEOL && prevState.requestState !== requestState) {
            const id = setTimeout(this.handleClose, AUTO_CLOSE_TIMER_MS);
            this.setState({ autoCloseTimer: id });
        }
    }

    componentWillUnmount() {
        const {autoCloseTimer} = this.state;
        if (autoCloseTimer) {
            clearTimeout(autoCloseTimer);
        }
    }

    render() {
        return (
            <Dialog open={this.props.open} onClose={this.handleClose} fullWidth maxWidth="xs">
                {this.renderBody()}
            </Dialog>
        )
    }
}

export default ManageAdminsAccessDialog;
