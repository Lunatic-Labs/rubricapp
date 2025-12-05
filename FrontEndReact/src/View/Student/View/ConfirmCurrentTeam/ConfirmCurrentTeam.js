import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import CustomButton from '../Components/CustomButton.js';
import CustomDataTable from '../../../Components/CustomDataTable.js';
import { Grid, Alert } from '@mui/material';
import { genericResourcePOST } from '../../../../utility.js';

/**
 * @description
 * Confirmation screen for the student's current (fixed) team.
 *
 * Responsibilities:
 *  - Shows the default/fixed team members in a table.
 *  - Lets the student:
 *      * Go back and choose a different team, or
 *      * Confirm "check in" to this team for the current assessment task.
 *
 * Props:
 *  @prop {Object} navbar       - Navbar instance; expects:
 *                                - state.chosenAssessmentTask (assessment_task_id, create_team_password)
 *                                - state.chosenCourse (use_fixed_teams)
 *                                - state.teamSwitchPassword (optional, for switching teams)
 *  @prop {Array}  students     - Array of student objects for this team (first_name, last_name, email).
 *  @prop {number} teamId       - ID of the team being confirmed.
 *  @prop {string} teamName     - Display name of the team.
 *
 * State:
 *  @property {string|null} errorMessage - Error message from the check-in POST, if any.
 */
class ConfirmCurrentTeamTable extends Component {
	constructor(props) {
		super(props);

		this.state = {
			errorMessage: null
		};
	}

	/**
	 * @method handleEditClick
	 * @description
	 * Navigates back so the student can choose a different team.
	 *
	 * Behavior:
	 *  - Looks at navbar.state.chosenAssessmentTask.create_team_password.
	 *  - If a team password is defined and non-empty:
	 *      → navbar.setNewTab("CodeRequired")
	 *    Else:
	 *      → navbar.setNewTab("SelectTeam")
	 *
	 * Networking:
	 *  - No fetch/POST is performed here; this is purely navigation logic.
	 */
	handleEditClick = () => {
    	const navbar = this.props.navbar;
    	const chosenAssessmentTask = navbar.state.chosenAssessmentTask;
    	const hasPassword = chosenAssessmentTask.create_team_password && chosenAssessmentTask.create_team_password.trim() !== '';
    
    	if (hasPassword) {
        	navbar.setNewTab("CodeRequired");
   		} else {
        	navbar.setNewTab("SelectTeam");
    	}
	};

	/**
	 * @method handleConfirmClick
	 * @description
	 * Confirms that the student is checking in to the selected team for the
	 * current assessment task.
	 *
	 * POST:
	 *  - Endpoint:
	 *      POST /checkin?assessment_task_id={atId}&team_id={teamId}
	 *
	 *  - Query parameters:
	 *      * assessment_task_id — from navbar.state.chosenAssessmentTask.assessment_task_id
	 *      * team_id            — from this.props.teamId
	 *
	 *  - Body:
	 *      - If navbar.state.teamSwitchPassword is set and non-empty:
	 *          { "password": "<teamSwitchPassword>" }
	 *        Else:
	 *          { }
	 *
	 *  - genericResourcePOST arguments:
	 *      genericResourcePOST(url, thisComponent, requestBody)
	 *      → expected to resolve to an object with errorMessage (null on success).
	 *
	 * On success:
	 *  - Clears navbar.state.teamSwitchPassword.
	 *  - Navigates to "StudentDashboard".
	 *
	 * On failure:
	 *  - Sets state.errorMessage to either the returned errorMessage
	 *    or a generic error if the request throws.
	 */
	handleConfirmClick = () => {
		var navbar = this.props.navbar;
		var atId = navbar.state.chosenAssessmentTask["assessment_task_id"];
		
		const password = navbar.state.teamSwitchPassword || "";
		const requestBody = password ? JSON.stringify({ password: password }) : JSON.stringify({});
		
		genericResourcePOST(
			`/checkin?assessment_task_id=${atId}&team_id=${this.props.teamId}`, 
			this, 
			requestBody
		).then((result) => {
			if (result !== undefined && result.errorMessage === null) {
				navbar.setState({ teamSwitchPassword: null });
				navbar.setNewTab("StudentDashboard");
			} else if (result && result.errorMessage) {
				this.setState({
					errorMessage: result.errorMessage
				});
			}
		}).catch((error) => {
			this.setState({
				errorMessage: "An error occurred while checking in. Please try again."
			});
		});
	};

	render() {
		const students = this.props.students;
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

		// If this course is not using fixed teams, immediately route to SelectTeam instead.
		// (No sorting or network call happens here; this is navigation only.)
		if (!fixedTeams) { 
			this.props.navbar.setNewTab("SelectTeam")
		}

		return (
			<div style={{ backgroundColor: '#F8F8F8' }}>
				{fixedTeams &&
					<>
						<h2 style={{ paddingTop: '16px', marginLeft: '-10px', bold: true }}> Your Team </h2>

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

							{this.state.errorMessage && (
								<Alert severity="error" sx={{ mb: 2, width: '100%' }}>
									{this.state.errorMessage}
								</Alert>
							)}

							{this.props.teamId &&
								<>
									<div className='container' style={{ marginTop: '15px' }}>
										<h3 style={{ textAlign: 'left', marginBottom: '10px', marginLeft: '-21px' }}>Confirm your team members</h3>

										<h4 style={{ textAlign: 'left', marginBottom: '20px', marginLeft: '-21px', color: '#2E8BEF' }}>{this.props.teamName}</h4>
									</div>

									<CustomDataTable
										data={students ? students : []}
										columns={columns}
										options={options}
									/>
								</>
							}

							{!this.props.teamId &&
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
						</div>
					</>
				}
			</div>
		);
	}
}

export default ConfirmCurrentTeamTable;
