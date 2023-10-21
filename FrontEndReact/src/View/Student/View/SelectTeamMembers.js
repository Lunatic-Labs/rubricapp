import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import MUIDataTable from 'mui-datatables';
import { Checkbox } from '@mui/material';
import { Typography } from '@mui/material';
import { textAlign } from '@mui/system';
import { fontWeight } from '@mui/system';
// import { ThemeProvider } from '@mui/material';

// NOTE: Header
class SelectTeamMembersHeader extends Component {
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
class SelectTeamMembers extends Component {
	constructor(props) {
		super(props);
		this.state = {
			checked: {}
		};
	}

	handleChange = (user_id) => (event) => {
		const { checked } = this.state;
		checked[user_id] = event.target.checked;
		this.setState({ checked });
	}

	componentWillUpdate() {
		console.log(this.state.checked);
	}

	render() {
		const students= this.props.users;

		
		// NOTE: Column names
		const columns = [
			// TODO: Create check box
			{
				name: "user_id",
				label: " ",
				options: {
					filter: true,
					sort: false,
					customBodyRender: (user_id) => {
						return (
						<Checkbox
							checked={this.state.checked[user_id] || false}
              				onChange={this.handleChange(user_id)}
              				inputProps={{ 'aria-label': 'controlled' }}
						/>
						);
					}
				}
			},

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
				<SelectTeamMembersHeader />
				<div className='container' style={{ marginTop: '60px' /* border:  '2px solid ', backgroundColor: 'white' */}}>
					<TeamName />
					<MUIDataTable data={students ? students : []} columns={columns} options={options} />
				</div>
			</>
		);

	}

}

export default SelectTeamMembers; 
