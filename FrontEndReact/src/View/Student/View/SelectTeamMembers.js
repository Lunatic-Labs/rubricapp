import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import MUIDataTable from 'mui-datatables';
import { ThemeProvider } from '@mui/material';

class SelectTeamMembers extends Component {
	render() {
		var students = this.props


		// NOTE: Column names
		const columns = [
			{
				name: "student_first_name",
				label: "First Name",
				optiions: {
					filter: true,
					sortable: true
				}
			},

			{
				name: "student_last_name",
				label: "Last Name",
				optiions: {
					filter: true,
					sortable: true
				}
			},

			{
				name: "student_email",
				label: "Email",
				optiions: {
					filter: true,
					sortable: true
				}
			}
		]

		return (
			<>
				<MUIDataTable data={}
			</>
		);

	}

}

export default SelectTeamMembers; 
