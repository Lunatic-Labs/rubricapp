import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import MUIDataTable from 'mui-datatables';
import CustomButton from '../Components/CustomButton.js';
import CustomHeader from '../Components/CustomHeader.js';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { AddCircleOutline } from '@mui/icons-material';

class BuildTeamTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: {}
    };
  }

  handleChange = (user_id) => (event) => {
    const { selected } = this.state;
    selected[user_id] = event.target.selected;
    this.setState({ selected });
  }

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
        name: "user_id",
        label: "Add",
        options: {
          filter: true,
          sort: false,
          customBodyRender: (user_id) => {
            return (
              <AddCircleOutline 
                selected={ this.state.selected[user_id] || false }
                onChange={ this.handleChange(user_id) }
                inputProps={{ 'aria-label': 'controlled' }}
              />
            );
          }
          
        }
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

