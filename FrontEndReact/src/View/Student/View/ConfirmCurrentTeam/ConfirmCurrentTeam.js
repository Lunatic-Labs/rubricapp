import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import CustomButton from '../Components/CustomButton.js';
import CustomDataTable from '../../../Components/CustomDataTable.js';
import { Grid, Alert } from '@mui/material';
import { genericResourcePOST } from '../../../../utility.js';



class ConfirmCurrentTeamTable extends Component {
	constructor(props) {
		super(props);

		this.state = {
			errorMessage: null
		};
	}

	handleEditClick = () => {
		this.props.navbar.setNewTab("CodeRequired");
	};

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