import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import CustomButton from '../Components/CustomButton.js';
import CustomHeader from '../Components/CustomHeader.js';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Grid, IconButton } from '@mui/material';
import CustomDataTable from '../Components/CustomDataTable.js'

class CustomSubHeader extends Component {
  render() {
    return (
      <>
        <CustomHeader
          label='Roster'
          style={{
            textAlign: 'left',
            marginBottom: '10px',
            marginLeft: '-21px'
          }}
        />
      </>
    )
  }
}

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
					align: "center",
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
              <IconButton aria-label='controlled'
                onClick={
                  () => {
                    this.setState({
                      selected: this.state.selected[user_id] || false
                    })
                    this.handleChange(user_id)
                  }
                }
              >
              <AddCircleOutlineIcon/>
              </IconButton>
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
      tableBodyMaxHeight: "21rem",
    };
    
		return (
			<>
       <div style={{ padding: '50px', backgroundColor: '#F8F8F8' }}>
          <div>
            <CustomHeader
              label='Build your new team'
              style={{
                padding: '16px',
                marginLeft: '-400px',
              }}
              bold='bold'
            />

            {/* <CustomSubHeader /> */}

            <Grid container spacing={8}>
              <Grid item xs={6}>
                <CustomDataTable 
                  data={students ? students : []} 
                  columns={columns}
                  options={options}
                />
              </Grid>
              <Grid item xs={6}>
                <CustomDataTable 
                  data={students ? students : []} 
                  columns={columns}
                  options={options}
                />
              </Grid>
            </Grid>
          </div>
       </div>
			</>
		)
	}
}

export default BuildTeamTable;
