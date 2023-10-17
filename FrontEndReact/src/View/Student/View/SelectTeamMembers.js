import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import MUIDataTable from 'mui-datatables';
import { Checkbox } from '@mui/material';
// import { ThemeProvider } from '@mui/material';

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
			<div>
				<h2 className='mt-5' style={{ textAlign: 'left', marginBottom: '30px' }}>Manage your current team</h2>
				<MUIDataTable data={students ? students : []} columns={columns} options={options} />
			</div>
		);

	}

}

export default SelectTeamMembers; 
