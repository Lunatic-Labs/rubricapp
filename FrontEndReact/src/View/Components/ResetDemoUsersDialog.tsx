import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from "@mui/material"
import { Component } from "react";
import DialogTitleWithClose from "./DialogTitleWithCloseButton";
import { REQUEST_STATE, RequestState } from "../../Enums/RequestState";
import Loading from "../Loading/Loading";
import { DemoUser, User } from "../../types/User";

interface ResetDemoAdminsDialogProps {
    open: boolean;
    onClose: () => void;
    onError: (message: string) => void;
}

interface ResetDemoAdminsDialogState {
    requestState: RequestState;
    users: DemoUser[] | null;
}

class ResetDemoAdminsDialog extends Component<ResetDemoAdminsDialogProps, ResetDemoAdminsDialogState> {
    constructor(props:ResetDemoAdminsDialogProps){
        super(props);
        this.state = {
            requestState: REQUEST_STATE.IDLE,
            users: null,
        }
    }

	private handleClose = () => {
        this.setState({
            requestState: REQUEST_STATE.IDLE,
            users: null,
        });

		this.props.onClose();
	};

    private handleSubmit = () => {

    }

    private renderActions() {
        const leftActionName = "Cancel";
        const rightActionName = "Submit";
		return (
			<DialogActions
				sx={{ justifyContent: "space-between", px: 3, pb: 2 }}
			>
				<Button
					className="primary-color"
					variant="contained"
					onClick={this.handleClose}
				>
					{leftActionName}
				</Button>
				<Button
					className="primary-color"
					variant="contained"
					onClick={this.handleSubmit}
				>
					{rightActionName}
				</Button>
			</DialogActions>
		);
    }

    private renderLoadingSituation() {
        const {users} = this.state;

        if (users === null) {
            return (
                <DialogContent sx={{ "& > div": { marginTop: 0 } }}>
                    <Loading />
                    {this.renderActions()}
                </DialogContent>
            )
        }
        return (
            <DialogContent sx={{ "& > div": { marginTop: 0 } }}>
                <Loading />
            </DialogContent>
        )
    }

	private renderBody() {
		const { requestState } = this.state;
        
        switch (requestState) {
            case REQUEST_STATE.LOADING:
                return this.renderLoadingSituation();
            default:
                return <DialogContentText>Hello</DialogContentText>
        }

	}

    private fetchDemoUsers() {
        this.setState({
            requestState: REQUEST_STATE.LOADING,
        });

    }

    componentDidUpdate(prevProps: ResetDemoAdminsDialogProps) {
        if (this.props.open && !prevProps.open){
            this.fetchDemoUsers();
        }
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
                {this.renderBody()}
			</Dialog>
		);
	}
}

export default ResetDemoAdminsDialog;