import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import MUIDataTable from 'mui-datatables';

// NOTE: Header
class ManageCurrentTeamHeader extends Component {
	render() {
		return (
			<>
				<div className='container' style={{ marginLeft: '-410px', marginTop: '100px' }}>
					<h2 style={{ fontWeight: 'bold' }}>Manage your current team</h2>
				</div>
			</>
		);
	}
}

// NOTE: Team name
class TeamName extends Component {
	render() {
		return (
		<>
			<div className='container'>
				<h3 style={{ textAlign: 'left', marginBottom: '10px', marginLeft: '-25px' }}>Confirm your team members</h3>
				<h4 style={{ textAlign: 'left', marginBottom: '20px', marginLeft: '-25px', color: '#2E8BEF' }}>Lunatic Labs</h4>
			</div>
		</>	
		)
	}
}

// NOTE: Creates Table
class ManageCurrentTeamTable extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const students= this.props.users;
		
		// NOTE: Column names
		const columns = [
			{
				name: "first_name",
				label: "First Name",
				optiions: {
					filter: true
				}
			},
			{
				name: "last_name",
				label: "Last Name",
				optiions: {
					filter: true
				}
			},
			{
				name: "email",
				label: "Email",
				optiions: {
					filter: true
				}
			}
		]
        const options = {
            onRowsDelete: false,
            download: false,
            print: false,
            selectableRows: "none",
            selectableRowsHeader: false,
            responsive: "standard",
            tableBodyMaxHeight: "21rem"
        };
		return (
			<>
				<ManageCurrentTeamHeader />
				<div className='container' style={{ marginTop: '60px' /* border:  '2px solid ', backgroundColor: 'white' */}}>
					<TeamName />
					<MUIDataTable data={students ? students : []} columns={columns} options={options} />
				</div>
			</>
		);

	}
}

export default ManageCurrentTeamTable; 
