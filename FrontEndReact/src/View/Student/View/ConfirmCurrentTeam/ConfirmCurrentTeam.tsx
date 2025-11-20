// @ts-expect-error TS(2307): Cannot find module 'react' or its corresponding ty... Remove this comment to see the full error message
import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import CustomButton from '../Components/CustomButton.js';
import CustomDataTable from '../../../Components/CustomDataTable.js';
// @ts-expect-error TS(2307): Cannot find module '@mui/material' or its correspo... Remove this comment to see the full error message
import { Grid, Alert } from '@mui/material';
import { genericResourcePOST } from '../../../../utility.js';



class ConfirmCurrentTeamTable extends Component {
// @ts-expect-error TS(7006): Parameter 'props' implicitly has an 'any' type.
	constructor(props) {
		super(props);

// @ts-expect-error TS(2339): Property 'state' does not exist on type 'ConfirmCu... Remove this comment to see the full error message
		this.state = {
			errorMessage: null
		};
	}

	handleEditClick = () => {
    // @ts-expect-error TS(2339): Property 'props' does not exist on type 'ConfirmCu... Remove this comment to see the full error message
    	const navbar = this.props.navbar;
    	const chosenAssessmentTask = navbar.state.chosenAssessmentTask;
    	const hasPassword = chosenAssessmentTask.create_team_password && chosenAssessmentTask.create_team_password.trim() !== '';
    
    	if (hasPassword) {
        	navbar.setNewTab("CodeRequired");
   		} else {
        	navbar.setNewTab("SelectTeam");
    	}
	};

	handleConfirmClick = () => {
// @ts-expect-error TS(2339): Property 'props' does not exist on type 'ConfirmCu... Remove this comment to see the full error message
		var navbar = this.props.navbar;
		var atId = navbar.state.chosenAssessmentTask["assessment_task_id"];
		
		const password = navbar.state.teamSwitchPassword || "";
		const requestBody = password ? JSON.stringify({ password: password }) : JSON.stringify({});
		
		genericResourcePOST(
// @ts-expect-error TS(2339): Property 'props' does not exist on type 'ConfirmCu... Remove this comment to see the full error message
			`/checkin?assessment_task_id=${atId}&team_id=${this.props.teamId}`, 
			this, 
			requestBody
		).then((result) => {
			if (result !== undefined && result.errorMessage === null) {
				navbar.setState({ teamSwitchPassword: null });
				navbar.setNewTab("StudentDashboard");
			} else if (result && result.errorMessage) {
// @ts-expect-error TS(2339): Property 'setState' does not exist on type 'Confir... Remove this comment to see the full error message
				this.setState({
					errorMessage: result.errorMessage
				});
			}
		}).catch((error) => {
// @ts-expect-error TS(2339): Property 'setState' does not exist on type 'Confir... Remove this comment to see the full error message
			this.setState({
				errorMessage: "An error occurred while checking in. Please try again."
			});
		});
	};

	render() {
// @ts-expect-error TS(2339): Property 'props' does not exist on type 'ConfirmCu... Remove this comment to see the full error message
		const students = this.props.students;
// @ts-expect-error TS(2339): Property 'props' does not exist on type 'ConfirmCu... Remove this comment to see the full error message
		const fixedTeams = this.props.navbar.state.chosenCourse["use_fixed_teams"];

		const columns = [
			{
				name: "first_name",
				label: "First Name",
				options: {
					filter: true,
					align: 'center'
				},
			},
			{
				name: "last_name",
				label: "Last Name",
				options: {
					filter: true,
					align: "center"
				},
			},
			{
				name: "email",
				label: "Email",
				options: {
// @ts-expect-error TS(7006): Parameter 'value' implicitly has an 'any' type.
					customBodyRender: (value) => <div style={{ textAlign: 'left' }}>{value}</div>,
					filter: true
				},
			},
		];

		const options = {
			onRowsDelete: false,
			download: false,
			print: false,
			selectableRows: "none",
			selectableRowsHeader: false,
			responsive: "vertical",
			tableBodyMaxHeight: "21rem",
			search: false,
			filter: false,
			viewColumns: false,
		};

		if (!fixedTeams) { 
// @ts-expect-error TS(2339): Property 'props' does not exist on type 'ConfirmCu... Remove this comment to see the full error message
			this.props.navbar.setNewTab("SelectTeam")
		}

		return (
// @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
			<div style={{ backgroundColor: '#F8F8F8' }}>
				{fixedTeams &&
					<>
// @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
						<h2 style={{ paddingTop: '16px', marginLeft: '-10px', bold: true }}> Your Team </h2>

// @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
						<div className='container'
							style={{
								backgroundColor: '#FFF',
								border: '3px, 0px, 0px, 0px',
								borderTop: '3px solid #4A89E8',
								borderRadius: '10px',
								flexDirection: 'column',
								justifyContent: 'flex-start',
								alignItems: 'center',
								width: '100%',
								height: '100%',
								marginTop: '40px',
								padding: '24px',
								paddingBottom: '20px',
								gap: 20,
							}}>
// @ts-expect-error TS(2339): Property 'state' does not exist on type 'ConfirmCu... Remove this comment to see the full error message
							{this.state.errorMessage && (
								<Alert severity="error" sx={{ mb: 2, width: '100%' }}>
// @ts-expect-error TS(2339): Property 'state' does not exist on type 'ConfirmCu... Remove this comment to see the full error message
									{this.state.errorMessage}
								</Alert>
							)}

// @ts-expect-error TS(2339): Property 'props' does not exist on type 'ConfirmCu... Remove this comment to see the full error message
							{this.props.teamId &&
								<>
// @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
									<div className='container' style={{ marginTop: '15px' }}>
// @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
										<h3 style={{ textAlign: 'left', marginBottom: '10px', marginLeft: '-21px' }}>Confirm your team members</h3>

// @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
										<h4 style={{ textAlign: 'left', marginBottom: '20px', marginLeft: '-21px', color: '#2E8BEF' }}>{this.props.teamName}</h4>
// @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
									</div>

									<CustomDataTable
										data={students ? students : []}
										columns={columns}
										options={options}
									/>
								</>
							}

// @ts-expect-error TS(2339): Property 'props' does not exist on type 'ConfirmCu... Remove this comment to see the full error message
							{!this.props.teamId &&
// @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
								<h2>No default team found</h2>
							}

							<Grid container justifyContent="flex-end" alignItems="center" spacing={2}>
								<Grid item>
									<CustomButton
										label="Choose different team"
										onClick={this.handleEditClick}
										isOutlined={true}
										aria-label="chooseDifferentTeamButton"
									/>
								</Grid>

// @ts-expect-error TS(2339): Property 'props' does not exist on type 'ConfirmCu... Remove this comment to see the full error message
								{this.props.teamId &&
									<Grid item>
										<CustomButton
											label="Check in to this team"
											onClick={this.handleConfirmClick}
											isOutlined={false}
											aria-label="checkInToTeamButton"
										/>
									</Grid>
								}
							</Grid>
// @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
						</div>
					</>
				}
// @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
			</div>
		);
	}
}

export default ConfirmCurrentTeamTable;