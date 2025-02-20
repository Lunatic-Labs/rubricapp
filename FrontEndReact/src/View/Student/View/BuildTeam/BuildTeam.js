import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import CustomButton from '../Components/CustomButton.js';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Grid, IconButton, Button } from '@mui/material';
import CustomDataTable from '../../../Components/CustomDataTable.js';
import TextField from '@mui/material/TextField';



class BuildTeamTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: {},
      unselected: {},
    };
  }

  // TO DO
  // handleConfirmTeamClick = () => {
    // Add your confirm team functionality here
    // console.log('Confirm Team Button Clicked');
  // };

  handleChange = (userId) => (event) => {
    const { selected, unselected } = this.state;
    const targetTable = selected[userId] ? 'unselected' : 'selected';

    const updatedSelected = { ...selected };
    const updatedUnselected = { ...unselected };

    if (targetTable === 'selected') {
      updatedSelected[userId] = event.target.checked;
      updatedUnselected[userId] = !event.target.checked;

    } else {
      updatedUnselected[userId] = event.target.checked;
      updatedSelected[userId] = !event.target.checked;
    }

    this.setState({ selected: updatedSelected, unselected: updatedUnselected });
  };

  render() {
    const students = this.props.users;

    const selectedColumns = [
      {
        name: "first_name",
        label: "First Name",
        options: {
          filter: true,
          align: "center",
        },
      },
      {
        name: "last_name",
        label: "Last Name",
        options: {
          filter: true,
          align: "center",
        },
      },
      {
        name: "user_id",
        label: "Action",
        options: {
          filter: false,
          align: "center",
          customBodyRender: (userId) => {
            return (
              <IconButton 
                aria-label='controlled' 
                onClick={() => this.handleChange(userId)}
              >
                {this.state.selected[userId] ? <RemoveCircleOutlineIcon /> : <AddCircleOutlineIcon />}
              </IconButton>
            );
          },
        },
      },
    ];

    const unselectedColumns = [
      {
        name: "first_name",
        label: "First Name",
        options: {
          filter: true,
          align: "center",
        },
      },
      {
        name: "last_name",
        label: "Last Name",
        options: {
          filter: true,
          align: "center",
        },
      },
      {
        name: "user_id",
        label: "Action",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (userId) => {
            return (
              <IconButton 
                aria-label='controlled' 
                onClick={() => this.handleChange(userId)}
              >
                {this.state.selected[userId] ? <RemoveCircleOutlineIcon /> : <AddCircleOutlineIcon />}
              </IconButton>
            );
          },
        },
      },
    ];

    const options = {
      onRowsDelete: false,
      download: false,
      print: false,
      viewColumns: false,
      selectableRows: "none",
      selectableRowsHeader: false,
      responsive: "standard",
      tableBodyMaxHeight: "21rem",
    };

    const selectedStudents = students.filter((student) => this.state.selected[student["user_id"]]);
    const unselectedStudents = students.filter((student) => !this.state.selected[student["user_id"]]);

    return (
      <>
        <div style={{ padding: '70px', backgroundColor: '#F8F8F8' }}>
          <div>
            <h2 style={{ padding: '25px', marginLeft: '-35px', fontWeight: 'bold' }}>Build your new team</h2>

            <Grid container spacing={2} alignItems='center'>
              <Grid item xs={6}>
                <h2 style={{ padding: '14px', marginLeft: '-15px' }}>Roster</h2>
              </Grid>

              <Grid item xs={2.5} container justifyContent='flex-end'>
                <Grid item>
                  <TextField
                    label='Team Name'
                    variant='outlined'
                    style={{ width: '190%' }}
                  />
                </Grid>
              </Grid>

              <Grid item xs={3.5} container justifyContent='flex-end'>
                <Grid item>
                  <CustomButton
                    label='Confirm Team'
                    onClick={this.handleConfirmTeamClick}
                    isOutlined={false}
                    position={{ top: '-25px', right: '0px' }}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid container spacing={8}>
              <Grid item xs={6}>
                <CustomDataTable
                  data={unselectedStudents}
                  columns={unselectedColumns}
                  options={options}
                />
              </Grid>

              <Grid item xs={6}>
                <CustomDataTable
                  data={selectedStudents}
                  columns={selectedColumns}
                  options={options}
                />
              </Grid>

              <Grid
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "end"
                  }}
              >
                  <Button
                      style={{
                          color: "white",
                          backgroundColor: "#2196F3",
                          marginTop: "30px"
                      }}
                      // TO DO 
                      // onClick={
                      //   () => {
                          // console.log("Confirm Team");
                        // }
                      // }
                  >
                      Confirm Team
                  </Button>
              </Grid>
            </Grid>
          </div>
        </div>
      </>
    );
  }
}

export default BuildTeamTable;