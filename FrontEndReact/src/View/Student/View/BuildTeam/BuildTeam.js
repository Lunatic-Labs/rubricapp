import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import CustomButton from '../Components/CustomButton.js';
import CustomHeader from '../Components/CustomHeader.js';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { AddCircleOutline } from '@mui/icons-material';
import { Grid } from '@mui/material';
import CustomDataTable from '../Components/CustomDataTable.js'

class subHeader extends Component {
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
              {/* TODO: Create the unassigned and assigned tables */}
              <Grid container spacing={2}>
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
       </div>
			</>
		)
	}
}

export default BuildTeamTable;
