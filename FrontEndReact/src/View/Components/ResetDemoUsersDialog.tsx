import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from "@mui/material"
import { Component } from "react";
import DialogTitleWithClose from "./DialogTitleWithCloseButton";
import { REQUEST_STATE, RequestState } from "../../Enums/RequestState";
import Loading from "../Loading/Loading";
import { DemoUser } from "../../types/User";
import { genericResourceGET } from "../../utility";
import CustomCheckboxList from "./CustomCheckboxList";

interface ResetDemoAdminsDialogProps {
    open: boolean;
    onClose: () => void;
    onError: (message: string) => void;
}

interface ResetDemoAdminsDialogState {
    requestState: RequestState;
    demoUsers: DemoUser[] | null;
    selectedEmails: string[];
}

class ResetDemoAdminsDialog extends Component<
	ResetDemoAdminsDialogProps,
	ResetDemoAdminsDialogState
> {
	constructor(props: ResetDemoAdminsDialogProps) {
		super(props);
		this.state = {
			requestState: REQUEST_STATE.IDLE,
			demoUsers: null,
            selectedEmails: [],
		};
	}

	private handleClose = () => {
		this.setState({
			requestState: REQUEST_STATE.IDLE,
			demoUsers: null,
            selectedEmails: [],
		});

		this.props.onClose();
	};

	private handleSubmit = () => {};

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
		const { demoUsers } = this.state;

		if (demoUsers === null) {
			return (
				<DialogContent sx={{ "& > div": { marginTop: 0 } }}>
					<Loading />
					{this.renderActions()}
				</DialogContent>
			);
		}
		return (
			<DialogContent sx={{ "& > div": { marginTop: 0 } }}>
				<Loading />
			</DialogContent>
		);
	}

    private renderList() {
        const {
            demoUsers,
            selectedEmails
        } = this.state;

        return (
            <DialogContent>
                <CustomCheckboxList
                    items={demoUsers ?? []}
                    getId={(user) => user.email}
                    getPrimary={(user) => `${user.first_name}${user.last_name} (${user.email})`}
                    selectedIds={selectedEmails}
                    onChange={(ids) => this.setState({ selectedEmails: ids.map(String)})}
                />
				{this.renderActions()}
            </DialogContent>
        );
    }

	private renderBody() {
		const { requestState } = this.state;

		switch (requestState) {
			case REQUEST_STATE.LOADING:
				return this.renderLoadingSituation();
			default:
				return this.renderList();
		}
	}

	private async fetchDemoUsers() {
		this.setState({
			requestState: REQUEST_STATE.LOADING,
		});

		let result = await genericResourceGET(
			"/super_admin_user/demo_users",
			"demo_admins",
			this,
			{ dest: "demoUsers" },
		);
		const failed = Boolean(result.errorMessage);
		this.setState({
			requestState: failed ? REQUEST_STATE.ERROR : REQUEST_STATE.SUCCESS,
		});
		if (failed) {
			this.props.onError(result.errorMessage);
		}
	}

	componentDidUpdate(prevProps: ResetDemoAdminsDialogProps) {
		if (this.props.open && !prevProps.open) {
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