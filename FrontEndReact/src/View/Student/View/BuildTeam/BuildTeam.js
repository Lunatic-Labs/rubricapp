import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import MUIDataTable from 'mui-datatables';
import CustomButton from '../Components/CustomButton.js';
import CustomHeader from '../Components/CustomHeader.js';

class BuildTeamTable extends Component {
	render() {
		const students= this.props.users;

		const columns = [
			{
				name: "first_name",
				label: "First Name",
				options: {
					filter: true,
					align: "center"
				}
			},
			{
				name: "last_name",
				label: "Last Name",
				options: {
					filter: true,
					align: "center"
				}
			},
			{
			// TODO: Build select button
			}
		];
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

			</>
		)
	}
}

