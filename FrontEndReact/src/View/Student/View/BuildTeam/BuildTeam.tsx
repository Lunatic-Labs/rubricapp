import React, { Component } from 'react';
// @ts-ignore: allow importing CSS without type declarations
import 'bootstrap/dist/css/bootstrap.css';
import CustomButton from '../Components/CustomButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Grid, IconButton, Button } from '@mui/material';
import CustomDataTable from '../../../Components/CustomDataTable';
import TextField from '@mui/material/TextField';

/**
 * @description
 * Team-building table for students. Displays two tables:
 *  - Roster (unselected students)
 *  - Selected team members
 * and lets the user move students between them.
 *
 * Fetches:
 *  - This component does not perform any fetches itself. All user data is
 *    provided as props from the parent component.
 *
 * @prop {Object} navbar - Navbar instance with current course context (not used yet).
 * @prop {Array}  users  - Array of user objects for this course (first_name, last_name, user_id).
 *
 * @property {Object} state.selected   - Map of user_id → true when the user is in the "selected" list.
 * @property {Object} state.unselected - Map of user_id → true when the user is explicitly marked unselected.
 */

interface BuildTeamTableProps {
  navbar: any;
  users: any[];
}

interface BuildTeamTableState {
  selected: { [key: string]: boolean };
  unselected: { [key: string]: boolean };
}

class BuildTeamTable extends Component<BuildTeamTableProps, BuildTeamTableState> {
  handleConfirmTeamClick: any;
  constructor(props: BuildTeamTableProps) {
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

  /**
   * @method handleChange
   * @description
   * Toggles a user between the "Roster" and "Selected" tables when the
   * add/remove icon is clicked.
   *
   * Sorting:
   *  - No explicit sorting is done here; rows stay in the order provided
   *    by props.users. Column-level sorting (if any) is handled by
   *    CustomDataTable.
   *
   * @param {number} userId - ID of the user whose selection state is being toggled.
   * @returns {function(Event):void} React handler used by the IconButton.
   */
  
  handleChange = (userId: any) => (event: any) => {
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
          customBodyRender: (userId: any) => {
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
          customBodyRender: (userId: any) => {
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

    const selectedStudents = students.filter((student: any) => this.state.selected[student["user_id"]]);
    const unselectedStudents = students.filter((student: any) => !this.state.selected[student["user_id"]]);

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
