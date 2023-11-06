import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import CustomButton from '../Components/CustomButton.js';
import CustomHeader from '../Components/CustomHeader.js';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Grid, IconButton } from '@mui/material';
import CustomDataTable from '../Components/CustomDataTable.js'
import TextField from '@mui/material/TextField';


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

	handleConfirmTeamClick = () => {
    // Add your edit functionality here
		console.log('Confirm Team Button Clicked')
  };

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
       <div style={{ padding: '70px', backgroundColor: '#F8F8F8' }}>
          <div>
            <h2 style={{ padding: '25px', marginLeft: '-35px', bold: true }}> Build your new team </h2>

            <Grid container spacing={2} alignItems='center'>
              <Grid item xs={6}>
                <h2 style={{ padding: '14px', marginLeft: '-15px' }}> Roster </h2>
              </Grid>
              <Grid item xs={2.4} container justifyContent='flex-end'>
                <Grid item>
                  <TextField 
                    label='Team Name' 
                    variant='outlined' 
                    style={{ width: '190%' }}
                  />
                </Grid>
              </Grid>
              <Grid item xs={3.6} container justifyContent='flex-end'>
                <Grid item>
                  <CustomButton 
                   label='Confirm Team'
                    onClick={this.handleConfirmTeamClick}
                    outlined={false}
                    position={{ top: '-25px', right: '0px' }}
                  />
                </Grid>
              </Grid>
            </Grid>

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
