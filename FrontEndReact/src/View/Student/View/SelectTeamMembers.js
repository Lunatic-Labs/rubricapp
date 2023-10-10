import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import MUIDataTable from 'mui-datatables';
// import { ThemeProvider } from '@mui/material';

class SelectTeamMembers extends Component {
	render() {
		var users = this.props.users;
		console.log(students)


		// NOTE: Column names
		const columns = [
			// TODO: Create check box
			{
				name: "user_id",
				label: ""
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
				<MUIDataTable data={students ? students : []} columns={columns} options={options} />
			</>
		);

	}

}

export default SelectTeamMembers; 
