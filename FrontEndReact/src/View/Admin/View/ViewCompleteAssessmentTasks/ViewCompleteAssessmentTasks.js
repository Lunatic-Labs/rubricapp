import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "../../../../SBStyles.css";
import CustomDataTable from "../../../Components/CustomDataTable";
import { Grid, Box } from "@mui/material";
import CustomButton from "../../../Student/View/Components/CustomButton";
import { genericResourcePUT } from "../../../../utility";
import ResponsiveNotification from "../../../Components/SendNotification";



class ViewCompleteAssessmentTasks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errorMessage: null,
      isLoaded: null,
      showDialog: false,
      notes: '',
      notificationSent: false,

      errors: {
        notes:''
      }
    };
  }

  handleChange = (e) => {
    const { id, value } = e.target;

    this.setState({
        [id]: value,
        errors: {
            ...this.state.errors,
            [id]: value.trim() === '' ? `${id.charAt(0).toUpperCase() + id.slice(1)} cannot be empty` : '',
        },
    });
  };

  handleDialog = () => {
    this.setState({
        showDialog: this.state.showDialog === false ? true : false,
    })
  }

  handleSendNotification = () => {
    var notes =  this.state.notes;
    var navbar = this.props.navbar;
    var state = navbar.state;
    var chosenAssessmentTask = state.chosenAssessmentTask;

    if (notes === '') {
      this.setState({
          errors: {
              notes: notes.trim() === '' ? 'Notification Message cannot be empty' : '',
          },
      });

    } else {
      genericResourcePUT(
        `/assessment_task?assessment_task_id=${chosenAssessmentTask["assessment_task_id"]}&notification_sent=${true}&notification_message=${notes}`,
        this, {}
      );
  
      this.setState({
        showDialog: false,
        notificationSent: true,
      });
    }
  };

  render() {
    var navbar = this.props.navbar;
    var completedAssessmentTasks = navbar.adminViewCompleteAssessmentTasks.completeAssessmentTasks;
    var userNames = navbar.adminViewCompleteAssessmentTasks.userNames;
    var state = navbar.state;
    var chosenAssessmentTask = state.chosenAssessmentTask;
    var notificationSent = state.notificationSent;

    const columns = [
      {
        name: "assessment_task_id",
        label: "Assessment Task",
        options: {
          filter: true,

          customBodyRender: () => {
            return (
              <p className="mt-3" variant="contained" align="left">
                {chosenAssessmentTask ? chosenAssessmentTask["assessment_task_name"]: "N/A"}
              </p>
            );
          },
        },
      },
      {
        name: "team_name",
        label: "Team Name",
        options: {
          filter: true,

          customBodyRender: (team_name) => {
            return (
              <p className="mt-3" variant="contained" align="left">
                {team_name ? team_name : "N/A"}
              </p>
            );
          },
        },
      },
      {
        name: "user_id",
        label: "User",
        options: {
          filter: true,

          customBodyRender: (userId) => {
            return (
              <p className="mt-3" variant="contained" align="left">
                {userNames && userId ? userNames[userId] : "N/A"}
              </p>
            );
          },
        },
      },
      {
        name: "initial_time",
        label: "Initial Time",
        options: {
          filter: true,

          customBodyRender: (dueDate) => {
            var date = new Date(dueDate);
            var month = date.getMonth();
            var day = date.getDate();
            var hour = date.getHours();
            var minute = date.getMinutes();

            const monthNames = [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ];

            var initialTimeString = `${monthNames[month]} ${day} at ${hour % 12}:${minute < 10 ? "0" + minute : minute}${hour < 12 ? "am" : "pm"}`;

            return (
              <p className="mt-3" variant="contained" align="left">
                {dueDate && initialTimeString ? initialTimeString : "N/A"}
              </p>
            );
          },
        },
      },
      {
        name: "last_update",
        label: "Last Updated",
        options: {
          filter: true,

          customBodyRender: (lastUpdate) => {
            var date = new Date(lastUpdate);
            var month = date.getMonth();
            var day = date.getDate();
            var hour = date.getHours();
            var minute = date.getMinutes();

            const monthNames = [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ];

            var lastUpdateString = `${monthNames[month]} ${day} at ${hour % 12}:${minute < 10 ? "0" + minute : minute}${hour < 12 ? "am" : "pm"}`;

            return(
              <p className='mt-3' variant='contained' align='left' >
                {lastUpdate && lastUpdateString ? lastUpdateString : "N/A"}
              </p>
            )
          }
        }
      },
      {
        name: "completed_assessment_id",
        label: "See More Details",
        options: {
          filter: false,
          sort: false,

          customBodyRender: (completedAssessmentId) => {
            if (completedAssessmentId) {
              return (
                <button
                  className='btn btn-primary'
                  align='center'

                  onClick={() => {
                    navbar.setViewCompleteAssessmentTaskTabWithAssessmentTask(
                      completedAssessmentTasks,
                      completedAssessmentId,
                      chosenAssessmentTask
                    );
                  }}
                >
                  View
                </button>
              )

            } else {
              return(
                <p className='mt-3' variant='contained' align='center' > {"N/A"} </p>
              )
            }
          }
        }
      }
    ];

    const options = {
      onRowsDelete: false,
      download: false,
      print: false,
      selectableRows: "none",
      viewColumns: false,
      selectableRowsHeader: false,
      responsive: "vertical",
      tableBodyMaxHeight: "21rem",
    };

    return (
      <>
        <Grid
          container
          spacing={3}
          justifyContent="space-between"
          alignItems="center"
        >
          <h1
            style={{
              marginTop: "1.32rem",
              marginBottom: "1rem",
              marginLeft: "1.25rem",
              fontStyle: "bold",
            }}
            aria-label="viewCompletedAssessmentTasksTitle"
          >
            View Completed Assessment Tasks
          </h1>
            <Box>
              <ResponsiveNotification
                show={this.state.showDialog}
                handleDialog={this.handleDialog}
                sendNotification={this.handleSendNotification}
                handleChange={this.handleChange}
                notes={this.state.notes}
                error={this.state.errors}
              />

              <CustomButton
                label="Send Notification"
                onClick={this.handleDialog}
                isOutlined={false}
                disabled={notificationSent}
              />
            </Box>
        </Grid>

        <CustomDataTable
          data={completedAssessmentTasks ? completedAssessmentTasks : []}
          columns={columns}
          options={options}
        />
      </>
    );
  }
}

export default ViewCompleteAssessmentTasks;
