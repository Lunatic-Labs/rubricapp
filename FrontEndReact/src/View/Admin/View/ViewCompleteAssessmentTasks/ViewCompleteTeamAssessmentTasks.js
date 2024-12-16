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

class ViewCompleteTeamAssessmentTasks extends Component {
    constructor(props) {
        super(props);

    this.state = {
      errorMessage: null,
      isLoaded: null,
      showDialog: false,
      notes: '',
      notificationSent: false,
      isSingleMsg: false,
      compATId: null,

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

  handleDialog = (isSingleMessage, singleCompletedAT) => {
    this.setState({
        showDialog: this.state.showDialog === false ? true : false,
        isSingleMsg: isSingleMessage,
        compATId: singleCompletedAT,
      });
  }

    handleSendNotification = () => {
        var notes =  this.state.notes;

        var navbar = this.props.navbar;

        var state = navbar.state;

        var chosenAssessmentTask = state.chosenAssessmentTask;

        var date = new Date();

        if (notes.trim() === '') {
            this.setState({
                errors: {
                    notes: 'Notification Message cannot be empty',
                },
            });

            return;
        }

    if(this.state.isSingleMsg){
      this.setState({isSingleMsg: false}, () => {
        genericResourcePOST(
          `/send_single_email?team=${true}&completed_assessment_id=${this.state.compATId}`, 
          this, JSON.stringify({ 
            "notification_message": notes,
          }) 
        ).then((result) => {
          if(result !== undefined && result.errorMessage === null){
            this.setState({ 
              showDialog: false, 
              notificationSent: date, 
            });
          }
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

    render() {
        var navbar = this.props.navbar;

        var completedAssessmentTasks = navbar.adminViewCompleteAssessmentTasks.completeAssessmentTasks;

        var userNames = navbar.adminViewCompleteAssessmentTasks.userNames;

        var state = navbar.state;

        var chosenAssessmentTask = state.chosenAssessmentTask;

        var notificationSent = state.notificationSent;

        var chosenCourse = state.chosenCourse;

        const columns = [
            {
                name: "assessment_task_id",
                label: "Assessment Task",
                options: {
                    filter: true,

                    customBodyRender: () => {
                        return (
                            <p variant="contained" align="left">
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
                            <p variant="contained" align="left">
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

                    customBodyRender: (completed_by) => {
                        return (
                            <p variant="contained" align="left">
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
                            <p variant="contained" align="left">
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
                            <p  variant='contained' align='left' >
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
                    setCellHeaderProps: () => { return { align:"center", className:"button-column-alignment"}},
                    setCellProps: () => { return { align:"center", className:"button-column-alignment"} },
                    customBodyRender: (completedAssessmentId) => {
                        if (completedAssessmentId) {
                            return (
                                <IconButton
                                    align="center"
                                    onClick={() => {
                                        navbar.setViewCompleteAssessmentTaskTabWithAssessmentTask(
                                            completedAssessmentTasks,
                                            completedAssessmentId,
                                            chosenAssessmentTask
                                        );
                                    }}
                                    aria-label="See more details"
                                >
                                    <VisibilityIcon sx={{color:"black"}}/>
                                </IconButton>
                            )

            } else {
              return(
                <p variant='contained' align='center' > {"N/A"} </p>
              )
            }
          }
        }
      },
      {
        name: "Student/Team Id",
        label: "Message",
        options: {
          filter: false,
          sort: false,
          setCellHeaderProps: () => { return { align:"center", className:"button-column-alignment"}},
          setCellProps: () => { return { align:"center", className:"button-column-alignment"} },
          customBodyRender: (completedAssessmentId, completeAssessmentTasks) => {
            const rowIndex = completeAssessmentTasks.rowIndex;
            const completedATIndex = 5;
            completedAssessmentId  = completeAssessmentTasks.tableData[rowIndex][completedATIndex];
            if (completedAssessmentId !== null) {
              return (
                <CustomButton
                onClick={() => this.handleDialog(true, completedAssessmentId)}
                label="Message"
                align="center"
                isOutlined={true}
                disabled={notificationSent}
                aria-label="Send individual messages"
                />
              )
            }else{
              return(
                <p variant='contained' align='center' > {''} </p>
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

<<<<<<< HEAD
        <Box className="subcontent-spacing">
          <Typography sx={{fontWeight:'700'}} variant="h5" aria-label="viewCompletedTeamAssessmentsTitle"> Completed Assesssment Tasks</Typography>
=======
                <Box className="subcontent-spacing">
                    <Typography sx={{fontWeight:'700'}} variant="h5" aria-label="viewCompletedAssessmentsTitle"> Completed Assesssment Tasks</Typography>
>>>>>>> master

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
              onClick={() => this.handleDialog(false)}
              isOutlined={false}
              disabled={notificationSent}
              aria-label="viewCompletedAssessmentTeamSendNotificationButton"
            />
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
