import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import CustomButton from '../Components/CustomButton.js';
import CustomDataTable from '../../../Components/CustomDataTable.js';
import { Grid } from '@mui/material';
import { genericResourcePOST } from '../../../../utility.js';



class ConfirmCurrentTeamTable extends Component {
	handleEditClick = () => {
		this.props.navbar.setNewTab("CodeRequired");
	};

	handleConfirmClick = () => {
		var navbar = this.props.navbar;
		var atId = navbar.state.chosenAssessmentTask["assessment_task_id"];

		genericResourcePOST(`/checkin?assessment_task_id=${atId}&team_id=${this.props.teamId}`, this, {});

		navbar.setNewTab("StudentDashboard");
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
				optiions: {
					filter: true,
					align: "center"
				},
			},
			{
				name: "email",
				label: "Email",
				optiions: {
					customBodyRender: (value) => <div style={{ textAlign: 'right' }}>{value}</div>,
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
							{this.props.teamId &&
								<>
									<div className='container' style={{ marginTop: '15px' }}>
										<h3 style={{ textAlign: 'left', marginBottom: '10px', marginLeft: '-21px' }}>Confirm your team members</h3>

										<h4 style={{ textAlign: 'left', marginBottom: '20px', marginLeft: '-21px', color: '#2E8BEF' }}>Lunatic Labs</h4>
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
									/>
								</Grid>

								{this.props.teamId &&
									<Grid item>
										<CustomButton
											label="Check in to this team"
											onClick={this.handleConfirmClick}
											isOutlined={false}
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