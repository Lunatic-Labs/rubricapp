/**
   * Super-admin dialog for granting or removing the global admin flag, by email
   * (students aren't listed in the users table, so email is the only handle).
   *
**/

import { Dialog, DialogTitle } from "@mui/material";
import { Component } from "react";

interface ManageAdminsAccessDialogProps {
    open: boolean;
    onClose: () => void;
}

interface ManageAdminsAccessDialogState {
    email: string;
}

class ManageAdminsAccessDialog extends Component<ManageAdminsAccessDialogProps, ManageAdminsAccessDialogState>{
    constructor(props:ManageAdminsAccessDialogProps) {
        super(props);
        this.state = {
            email: "",
        }
    }

    render() {
        return (
            <Dialog open={this.props.open} onClose={this.props.onClose} fullWidth maxWidth="xs">
                <DialogTitle>Manage Admin Access</DialogTitle>
            </Dialog>
        )
    }
}

export default ManageAdminsAccessDialog;
