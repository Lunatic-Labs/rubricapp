import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import CustomButton from '../Components/CustomButton.js';
import CustomHeader from '../Components/CustomHeader.js';
import CustomDataTable from '../../../Components/CustomDataTable.js'

// NOTE: Team name
// TODO: Function needs to fetch the team name 
class TeamName extends Component {
	render() {
		return (
			<>
				<div className='container' style={{ marginTop: '15px' }}>
					<h3 style={{ textAlign: 'left', marginBottom: '10px', marginLeft: '-21px' }}>Confirm your team members</h3>
					<h4 style={{ textAlign: 'left', marginBottom: '20px', marginLeft: '-21px', color: '#2E8BEF' }}>Lunatic Labs</h4>
				</div>
			</>	
		)
	}
}

// NOTE: Creates Table
class ManageCurrentTeamTable extends Component {

	// NOTE: Edit Action
	handleEditClick = () => {
    // Add your edit functionality here
		console.log('Edit Team Button Clicked')
  };

	// NOTE: Confirm Action
  handleConfirmClick = () => {
    console.log('Confirm Team button clicked');
    // Add your confirm team functionality here
  };

	render() {
		var navbar = this.props.navbar;
		var studentManageCurrentTeam = navbar.studentManageCurrentTeam;
		var students = studentManageCurrentTeam.users;
	 
		// NOTE: Column names
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
      responsive: "standard",
      tableBodyMaxHeight: "21rem",
      search: false,
      filter: false,
      viewColumns: false,
    };
		return (
			<>
				<div style={{ padding: '50px', backgroundColor: '#F8F8F8' }}>
					<div>
						<CustomHeader
							label='Manage your current team'
							style={{
								paddingTop: '16px',
      							marginLeft: '-400px',
							}}
							bold='bold'
						/>

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
								padding:'24px', 
								paddingBottom: '80px',
								gap: 20,
							}}>
							<TeamName />
							<CustomDataTable 
								data={students ? students : []} 
								columns={columns} 
								options={options} 
							/>

							<CustomButton
								label="Edit"
								onClick={this.handleEditClick}
								isOutlined={true} // Outlined button
								position={{ top: '10px', right: '150px' }}
							/>

							<CustomButton
								label="Confirm Team"
								onClick={this.handleConfirmClick}
								isOutlined={false} // Default button
								position={{ top: '10px', right: '0px' }}
							/>
						</div>
					</div>
				</div>
			</>
		);
	}
}

export default ManageCurrentTeamTable; 