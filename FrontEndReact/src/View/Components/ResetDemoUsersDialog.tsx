/**
 * Super-admin dialog for resetting demo users back to their seeded state.
 * Opening it loads the demo users and lists them as checkboxes, so one or
 * several can be picked and reset together.
 **/

import { Component } from "react";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
} from "@mui/material";

import Loading from "../Loading/Loading";
import { DemoUser } from "../../types/User";
import CustomCheckboxList from "./CustomCheckboxList";
import { AUTO_CLOSE_TIMER_MS } from "../../Constants/timings";
import DialogTitleWithClose from "./DialogTitleWithCloseButton";
import { genericResourceGET, genericResourcePUT } from "../../utility";
import { REQUEST_STATE, RequestState } from "../../Enums/RequestState";

interface ResetDemoAdminsDialogProps {
	open: boolean;
	onClose: () => void;
	onError: (message: string) => void;
}

interface ResetDemoAdminsDialogState {
	/** State of the current API request. */
	requestState: RequestState;
	/** Admin demo users fetched from the backend; null until fetch completes. */
	demoUsers: DemoUser[] | null;
	/** Emails selected by the SuperAdmin. */
	selectedEmails: string[];
	/** Timer that auto-closes the dialog when dialog has reached EOL. */
	autoCloseTimer: ReturnType<typeof setTimeout> | null;
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
			autoCloseTimer: null,
		};
	}

	private handleClose = () => {
		if (this.state.autoCloseTimer) {
			clearTimeout(this.state.autoCloseTimer);
		}

		this.setState({
			requestState: REQUEST_STATE.IDLE,
			demoUsers: null,
			selectedEmails: [],
			autoCloseTimer: null,
		});

		this.props.onClose();
	};

	private handleSubmit = async () => {
		const { selectedEmails } = this.state;

		if (selectedEmails.length === 0) return;

		this.setState({
			requestState: REQUEST_STATE.LOADING,
		});

		const result = await genericResourcePUT(
			"/super_admin_user/reset_demo_users",
			this,
			JSON.stringify({ emails: selectedEmails }),
		);

		if (this.state.requestState !== REQUEST_STATE.LOADING) {
			return;
		}

		const didRequestFail = Boolean(result.errorMessage);
		this.setState({
			requestState: didRequestFail
				? REQUEST_STATE.ERROR
				: REQUEST_STATE.SUCCESS,
		});

		if (didRequestFail) {
			this.props.onError(result.errorMessage);
		}
	};

	private renderActions() {
		const { selectedEmails } = this.state;
		const leftActionName = "Cancel";
		const rightActionName = "Submit";
		const haveSelectedNoEmails = selectedEmails.length === 0;

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
					disabled={haveSelectedNoEmails}
				>
					{rightActionName}
				</Button>
			</DialogActions>
		);
	}

	private successView() {
		const { selectedEmails } = this.state;
		const singleUserSelected = selectedEmails.length === 1;

		return (
			<DialogContent
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					py: 4,
				}}
			>
				<CheckCircleIcon
					color="primary"
					data-testid="reset-demo-users-success"
				/>
				<DialogContentText>
					User{singleUserSelected ? " has" : "s have"} been reset.
				</DialogContentText>
			</DialogContent>
		);
	}

	private errorView() {
		const { demoUsers } = this.state;
		const textToDisplay =
			demoUsers === null
				? "Problem obtaining demo users."
				: "Problem encountered when resetting.";

		return (
			<DialogContent
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					py: 4,
				}}
			>
				<ErrorIcon color="error" data-testid="reset-demo-users-error" />
				<DialogContentText>
					{textToDisplay} Please try again.
				</DialogContentText>
			</DialogContent>
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
		const { demoUsers, selectedEmails } = this.state;

		return (
			<DialogContent>
				<CustomCheckboxList
					items={demoUsers ?? []}
					getId={(user) => user.email}
					getPrimary={(user) =>
						`${user.first_name}${user.last_name} (${user.email})`
					}
					selectedIds={selectedEmails}
					onChange={(ids) =>
						this.setState({ selectedEmails: ids.map(String) })
					}
				/>
				{this.renderActions()}
			</DialogContent>
		);
	}

	private renderBody() {
		const { requestState } = this.state;

		switch (requestState) {
			case REQUEST_STATE.SUCCESS:
				return this.successView();
			case REQUEST_STATE.ERROR:
				return this.errorView();
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
			requestState: failed ? REQUEST_STATE.ERROR : REQUEST_STATE.IDLE,
		});
		if (failed) {
			this.props.onError(result.errorMessage);
		}
	}

	componentDidUpdate(
		prevProps: ResetDemoAdminsDialogProps,
		prevState: ResetDemoAdminsDialogState,
	) {
		const { requestState } = this.state;

		if (this.props.open && !prevProps.open) {
			this.fetchDemoUsers();
		}

		const isDialogEOL =
			requestState === REQUEST_STATE.ERROR ||
			requestState === REQUEST_STATE.SUCCESS;
		const isNewState = prevState.requestState !== requestState;
		const needToEnableTimer = isDialogEOL && isNewState;

		if (needToEnableTimer) {
			const id = setTimeout(this.handleClose, AUTO_CLOSE_TIMER_MS);
			this.setState({ autoCloseTimer: id });
		}
	}

	componentWillUnmount() {
		// NOTE: This is needed to handle special cases and make sure the timer is removed.
		const { autoCloseTimer } = this.state;
		if (autoCloseTimer) {
			clearTimeout(autoCloseTimer);
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
