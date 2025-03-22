import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "../../../../SBStyles.css";
import { Tooltip } from '@mui/material';
import CustomDataTable from "../../../Components/CustomDataTable";
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, Typography } from "@mui/material";
import CustomButton from "../../../Student/View/Components/CustomButton";
import { genericResourcePOST, genericResourcePUT, getHumanReadableDueDate } from "../../../../utility";
import ResponsiveNotification from "../../../Components/SendNotification";
import CourseInfo from "../../../Components/CourseInfo";
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

class ViewCompleteIndividualAssessmentTasks extends Component {
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
        lockStatus: {},

        errors: {
            notes:''
        }
      };
    }

    componentDidMount() {
        const completedAssessmentTasks = this.props.navbar.adminViewCompleteAssessmentTasks.completeAssessmentTasks;
        const initialLockStatus = {};

        completedAssessmentTasks.forEach((task) => {
            initialLockStatus[task.assessment_task_id] = task.locked;
        });

        this.setState({ lockStatus: initialLockStatus });
    }

    handleLockToggle = (assessmentTaskId, task) => {
        this.setState((prevState) => {
            const newLockStatus = { ...prevState.lockStatus };
            newLockStatus[assessmentTaskId] = !newLockStatus[assessmentTaskId];
            return { lockStatus: newLockStatus };
        }, () => {
            const lockStatus = this.state.lockStatus[assessmentTaskId];

            genericResourcePUT(
                `/completed_assessment_toggle_lock?assessment_task_id=${assessmentTaskId}&locked=${lockStatus}`,
                this,
                JSON.stringify({ locked: lockStatus })
            );
        });
    };

    handleUnlockAllCats = (assessmentTaskIds) => {
        assessmentTaskIds.forEach((assessmentTaskId) => {
            this.setState((prevState) => {
                const newLockStatus = { ...prevState.lockStatus };
                newLockStatus[assessmentTaskId] = false;
                return { lockStatus: newLockStatus };
            }, () => {
                const lockStatus = this.state.lockStatus[assessmentTaskId];
                genericResourcePUT(
                    `/completed_assessment_unlock?assessment_task_id=${assessmentTaskId}`,
                    this,
                    JSON.stringify({ locked: lockStatus })
                );
            });
        });
    };

    handleLockAllCats = (assessmentTaskIds) => {
        assessmentTaskIds.forEach((assessmentTaskId) => {
            this.setState((prevState) => {
                const newLockStatus = { ...prevState.lockStatus };
                newLockStatus[assessmentTaskId] = true;
                return { lockStatus: newLockStatus };
            }, () => {
                const lockStatus = this.state.lockStatus[assessmentTaskId];

                genericResourcePUT(
                    `/completed_assessment_lock?assessment_task_id=${assessmentTaskId}`,
                    this,
                    JSON.stringify({ locked: lockStatus })
                );
            });
        });
    };

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
    var notes = this.state.notes;

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
    if(this.state.isSingleMsg) {
      this.setState({isSingleMsg: false}, () => {
        genericResourcePOST(
          `/send_single_email?team=${false}&completed_assessment_id=${this.state.compATId}`, 
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
    } else {
      genericResourcePUT(
        `/mass_notification?assessment_task_id=${chosenAssessmentTask["assessment_task_id"]}&team=${false}`,
        this, JSON.stringify({
          "notification_message": notes, 
          "date" : date
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

        var catIds = completedAssessmentTasks.map((task) => task.completed_assessment_id);

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
                name: "last_name",
                label: "Student Name",
                options: {
                    filter: true,

                    customBodyRender: (last_name) => {
                        return (
                            <p variant="contained" align="left">
                                {last_name ? last_name : "N/A"}
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

                    customBodyRender: (initialTime) => {
                        const timeZone = chosenAssessmentTask ? chosenAssessmentTask.time_zone : "";

                        return (
                            <p variant="contained" align="left">
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

                    customBodyRender: (lastUpdate) => {
                        const timeZone = chosenAssessmentTask ? chosenAssessmentTask.time_zone : "";
                      
                        return(
                            <p  variant='contained' align='left' >
                                {getHumanReadableDueDate(lastUpdate,timeZone)}
                            </p>
                        )
                    },
                },
            },
            {
                name: "assessment_task_id",
                label: "Lock",
                options: {
                    filter: true,
                    customBodyRender: (catId) => {
                        const task = completedAssessmentTasks.find((task) => task["assessment_task_id"] === catId);
                        const isLocked = this.state.lockStatus[catId] !== undefined ? this.state.lockStatus[catId] : (task ? task.locked : false);

                            return (
                                <Tooltip
                                    title={
                                        <>
                                            <p>
                                                If the assessment task is locked, students can no longer make changes to it. If the task is unlocked, students are allowed to make edits.
                                            </p>
                                        </>
                                    }>
                                    <IconButton
                                        aria-label={isLocked ? "unlock" : "lock"}
                                        onClick={() => this.handleLockToggle(catId, task)}
                                    >
                                        {isLocked ? <LockIcon /> : <LockOpenIcon />}
                                    </IconButton>
                                </Tooltip>
                            );
                    },
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
                    customBodyRender: (completedAssessmentId, completeAssessmentTasks) => {
                        const rowIndex = completeAssessmentTasks.rowIndex;
                        const userId = this.props.completedAssessment[rowIndex].user_id;
                        if (completedAssessmentId) {
                            return (
                                <IconButton // problem : need to pass who im looking at
                                    align="center"
                                    onClick={() => {
                                        navbar.setViewCompleteAssessmentTaskTabWithAssessmentTask(
                                            completedAssessmentTasks,
                                            completedAssessmentId,
                                            chosenAssessmentTask,
                                            userId,
                                        );
                                    }}
                                    aria-label="assessmentIndividualSeeMoreDetailsButtons"
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

                <Box className="subcontent-spacing">
                    <Typography sx={{fontWeight:'700'}} variant="h5" aria-label="viewCompletedIndividualRubricsTitle"> Completed Rubrics</Typography>

          <Box>
            <ResponsiveNotification
              show={this.state.showDialog}
              handleDialog={this.handleDialog}
              sendNotification={this.handleSendNotification}
              handleChange={this.handleChange}
              notes={this.state.notes}
              error={this.state.errors}
            />

            <IconButton
                aria-label={"unlock-all"}
                onClick={() => this.handleUnlockAllCats(catIds)}
            >
                <LockOpenIcon />
            </IconButton>

            <IconButton
                aria-label={"lock-all"}
                onClick={() => this.handleLockAllCats(catIds)}
            >
                <LockIcon />
            </IconButton>

            <CustomButton
              label="Send Notification"
              onClick={() => this.handleDialog(false)}
              isOutlined={false}
              disabled={notificationSent}
              aria-label="viewCompletedAssessmentIndividualSendNotificationButton"
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

export default ViewCompleteIndividualAssessmentTasks;
