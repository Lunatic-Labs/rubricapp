import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "../../../../SBStyles.css";
import CustomDataTable from "../../../Components/CustomDataTable";
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, Typography } from "@mui/material";
import CustomButton from "../../../Student/View/Components/CustomButton";
import { genericResourcePUT, genericResourcePOST } from "../../../../utility";
import ResponsiveNotification from "../../../Components/SendNotification";
import CourseInfo from "../../../Components/CourseInfo";
import { getHumanReadableDueDate } from "../../../../utility";
import { Tooltip } from '@mui/material';

interface ViewCompleteTeamAssessmentTasksState {
    errorMessage: any;
    isLoaded: any;
    showDialog: boolean;
    notes: string;
    notificationSent: any;
    isSingleMsg: boolean;
    compATId: any;
    errors: {
        notes: string;
    };
}

class ViewCompleteTeamAssessmentTasks extends Component<any, ViewCompleteTeamAssessmentTasksState> {
    constructor(props: any) {
        super(props);

    this.state = {
      errorMessage: null,   //Stores API error messages
      isLoaded: null,       // Loading state indicator
      showDialog: false,    // Controls notificartion dialog visiblity
      notes: '',            //Notification message content typed by instructor
      notificationSent: false,    // Tracks if notifcation sent  
      isSingleMsg: false,         //True notifies one team if false notifies all teams
      compATId: null,             // completed assessment ID for indivduals team notifications

            errors: {
                notes:''      // validation error for notification message
            }
        };
    }

    handleChange = (e: any) => {
        const { id, value } = e.target;
      //Updates state with new value and validation error
        this.setState({
            [id]: value,      // Upadtes the field dynamically
            errors: {
                ...this.state.errors,
                //Validates if empty after trim, set error, otherwise error is cleared
                [id]: value.trim() === '' ? `${id.charAt(0).toUpperCase() + id.slice(1)} cannot be empty` : '',
            },
        } as any);
    };

    handleDialog = (isSingleMessage: any, singleCompletedAT: any) => {   // Opens or closes the notification dialog and configure notification mode
      this.setState({
          showDialog: this.state.showDialog === false ? true : false,
          isSingleMsg: isSingleMessage,  // Store whether this is single team or mass notification
          compATId: singleCompletedAT,  //stores assessment ID for single team notifications
        });
    }

    handleSendNotification = () => {    // Sends notification email to teams that their assessment are available
        var notes =  this.state.notes;

        var navbar = this.props.navbar;
        var state = navbar.state;
        var chosenAssessmentTask = state.chosenAssessmentTask;

        var date = new Date(); // creates timestamp

        if (notes.trim() === '') {    //validates if message is empty
            this.setState({
                errors: {
                    notes: 'Notification Message cannot be empty',
                },
            });
            //exit early without sending notification
            return;
        }

    if(this.state.isSingleMsg){ // Check notification mode either single team or all
      // reset single message flag before sending
      this.setState({isSingleMsg: false}, () => {
        //API caall - sends email to one specfic team
        //POST /send_single_email?team=true&completed_assessment_id={id}
        //Query param team=true indicates team notification
        genericResourcePOST(
          `/send_single_email?team=${true}&completed_assessment_id=${this.state.compATId}`, 
          this, JSON.stringify({ 
            "notification_message": notes,
          }) 
        ).then((result) => {
          // Sucess handling: check result is valid and no errors
          if(result !== undefined && result.errorMessage === null){
            this.setState({ 
              showDialog: false, 
              notificationSent: date, 
            });
          }
          //If error occurs, dialog stays open for user to retry
          // notificatinSent stays false, button remains enable
        });
      });
    }else{
      genericResourcePUT(
        `/mass_notification?assessment_task_id=${chosenAssessmentTask["assessment_task_id"]}&team=${true}`,
        this, JSON.stringify({
          "date": date,
          "notification_message": notes
        })
      ).then((result) => {
        if (result !== undefined && result.errorMessage === null) {
          this.setState({
            showDialog: false,
            notificationSent: date,
          });
        }
      });
    }

  };

    render() {    //Renders the component UI with team assessment table and notification buttons
        var navbar = this.props.navbar;

        var completedAssessmentTasks = navbar.adminViewCompleteAssessmentTasks.completeAssessmentTasks;

        var userNames = navbar.adminViewCompleteAssessmentTasks.userNames;  //Maps user ID to name

        var state = navbar.state;

        var chosenAssessmentTask = state.chosenAssessmentTask;

        var notificationSent = state.notificationSent;    //From navbar state, not component state

        var chosenCourse = state.chosenCourse;

        const columns = [
          //Column 1 assessment task name
            {
                name: "assessment_task_id",
                label: "Assessment Task",
                options: {
                    filter: true,

                    customBodyRender: () => {
                        return (
                            <p>
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

                    customBodyRender: (team_name: any) => {
                        return (
                            <p>
                                {team_name ? team_name : "N/A"}
                            </p>
                        );
                    },
                },
            },
            {
                name: "completed_by",
                label: "Assessor",
                options: {
                    filter: true,

                    customBodyRender: (completed_by: any) => {
                        return (
                            <p>
                                {userNames && completed_by ? userNames[completed_by] : "N/A"}
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

                    customBodyRender: (initialTime: any) => { 
                        const timeZone = chosenAssessmentTask ? chosenAssessmentTask.time_zone : "";
                        
                        return (
                            <p>
                                {getHumanReadableDueDate(initialTime,timeZone)}
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

                    customBodyRender: (lastUpdate: any) => {
                      const timeZone = chosenAssessmentTask ? chosenAssessmentTask.time_zone : "";    

                      return (
                        <p>
                          {getHumanReadableDueDate(lastUpdate,timeZone)}
                        </p>
                      );
                    }
                }
            },
            {
                name: "completed_assessment_id",
                label: "See More Details",
                options: {
                    filter: false,
                    sort: false,
                    setCellHeaderProps: () => { return { align:"center", className:"button-column-alignment"}},
                    setCellProps: () => { return { align:"center", className:"button-column-alignment"} },
                    customBodyRender: (completedAssessmentId: any, completeAssessmentTasks: any) => {
                      const rowIndex = completeAssessmentTasks.rowIndex;
                      const teamId = this.props.completedAssessment[rowIndex].team_id;
                      if (completedAssessmentId) {
                            return (
                                <IconButton
                                    onClick={() => {
                                        navbar.setViewCompleteAssessmentTaskTabWithAssessmentTask(
                                            completedAssessmentTasks,
                                            completedAssessmentId,
                                            chosenAssessmentTask,
                                            teamId,
                                        );
                                    }}
                                    aria-label="See more details"
                                >
                                    <VisibilityIcon sx={{color:"black"}}/>
                                </IconButton>
                            )

            } else {
              return(
                <p> {"N/A"} </p>
              )
            }
          }
        }
      },
      {
        name: "Student/Team Id",
        label: "Notify",
        options: {
          filter: false,
          sort: false,
          setCellHeaderProps: () => { return { align:"center", className:"button-column-alignment"}},
          setCellProps: () => { return { align:"center", className:"button-column-alignment"} },
          customBodyRender: (completedAssessmentId: any, completeAssessmentTasks: any) => {
            const rowIndex = completeAssessmentTasks.rowIndex;
            const completedATIndex = 5;
            completedAssessmentId  = completeAssessmentTasks.tableData[rowIndex][completedATIndex];
            if (completedAssessmentId !== null) {
              return (
                <Tooltip
                  title={
                    <>
                      <p>
                        Notify individual team.
                      </p>
                    </>
                  }>
                  <span>
                    <CustomButton
                    onClick={() => this.handleDialog(true, completedAssessmentId)}
                    label="Notify"
                    align="center"
                    isOutlined={true}
                    disabled={notificationSent}
                    aria-label="Send individual messages"
                    />
                  </span>
                </Tooltip>
              )
            }else{
              return(
                <p> {''} </p>
              )
            }
          }
        }
      },
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
            <Box sx={{display:"flex", flexDirection:"column", gap: "20px", marginTop:"20px"}}>
                <Box className="content-spacing">
                    <CourseInfo
                        courseTitle={chosenCourse["course_name"]} 
                        courseNumber={chosenCourse["course_number"]}
                        aria-label={chosenCourse["course_name"]}
                    />
                </Box>

                <Box className="subcontent-spacing">
                    <Typography sx={{fontWeight:'700'}} variant="h5" aria-label="viewCompletedTeamRubricsTitle"> Completed Rubrics</Typography>

                    <Box>
                        <ResponsiveNotification
                            show={this.state.showDialog}
                            handleDialog={this.handleDialog}
                            sendNotification={this.handleSendNotification}
                            handleChange={this.handleChange}
                            notes={this.state.notes}
                            error={this.state.errors}
                        />
            <Tooltip
              title={
                  <>
                      <p> 
                        Notifies all teams results are available.
                      </p>
                        
                  </>
                }>
              <span>
                <CustomButton
                  label="Notify All"
                  onClick={() => this.handleDialog(false, null)}
                  isOutlined={false}
                  disabled={notificationSent}
                  aria-label="viewCompletedAssessmentTeamSendNotificationButton"
                />
              </span>
            </Tooltip>
          </Box>
        </Box>

                <Box className="table-spacing">
                    <CustomDataTable
                        data={completedAssessmentTasks ? completedAssessmentTasks : []}
                        columns={columns}
                        options={options}
                    />
                </Box>
                
            </Box>
        );
    }
}

export default ViewCompleteTeamAssessmentTasks;
