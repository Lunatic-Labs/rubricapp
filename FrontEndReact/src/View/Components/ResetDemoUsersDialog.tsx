import { Dialog } from "@mui/material"
import { Component } from "react";
import DialogTitleWithClose from "./DialogTitleWithCloseButton";


interface ResetDemoAdminsDialogProps {
    open: boolean;
    onClose: () => void;
    onError: (message: string) => void;
}

class ResetDemoAdminsDialog extends Component<ResetDemoAdminsDialogProps> {
    private handleClose = () => {
        this.props.onClose();
    }

    private renderBody() {
        return {}
    }

    render() {
        const dialogTitle = "Reset Demo Admins";
        return (
            <Dialog
                open={this.props.open}
                onClose={this.handleClose}
                fullWidth
                maxWidth="xs"
            >
               <DialogTitleWithClose
                    onClose={this.handleClose}
                    testId="reset-admin-close"
               >
                    {dialogTitle}
               </DialogTitleWithClose>
            </Dialog>
        );
    }
}

export default ResetDemoAdminsDialog;