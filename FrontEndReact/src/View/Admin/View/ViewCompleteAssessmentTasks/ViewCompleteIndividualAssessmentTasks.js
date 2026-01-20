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

// Shows a table of completed indivdual student rubrics with notifications and has privilages to who can edit submissions//

class ViewCompleteIndividualAssessmentTasks extends Component {
    constructor(props) {
        super(props);
    // Intialize component state
    this.state = {
        errorMessage: null, // Stores API error messages
        isLoaded: null,     //Loading state indicator
        showDialog: false,    //controls notifcation dialog visibility
        notes: '',            // Notification message content typr by instructor
        notificationSent: false,    //tracks if notification sent this also block duplicate sends
        isSingleMsg: false,
        compATId: null,         //Completed assessment ID for indivdual notifications
        lockStatus: {}, // Maps completed_assessment_id -> boolean (locked state)

        errors: {
            notes:''
        }
      };
    }

    componentDidMount() {       // Initialize Lock Status from server data when components first loads
        // extract assessment data from props
        const completedAssessmentTasks = this.props.navbar.adminViewCompleteAssessmentTasks.completeAssessmentTasks;
        // Create empty object to store lock status
        const initialLockStatus = {};
        // Preload lock status from server data to avoid UI flicker //
        completedAssessmentTasks.forEach((task) => {        
            initialLockStatus[task.completed_assessment_id] = task.locked;
        });
        // Update component stat with lock status
        this.setState({ lockStatus: initialLockStatus });
    }

    handleLockToggle = (completedAssessmentId, task) => {        //Toggles lock state from a single student assessment 
        // Update local lock status state
        this.setState((prevState) => {
            //create copy of lock status object
            const newLockStatus = { ...prevState.lockStatus }; 
            //Flip the boolean value for this assessment
            newLockStatus[completedAssessmentId] = !newLockStatus[completedAssessmentId];
            return { lockStatus: newLockStatus };
        }, () => {
            //callback executes after states update completes
            const lockStatus = this.state.lockStatus[completedAssessmentId];
            // Sync with server (in calllback)
            //PUT /completed_assessment_toggle_lock?completed_assessment_id={id} into true/false
            genericResourcePUT(
                `/completed_assessment_toggle_lock?completed_assessment_id=${completedAssessmentId}&locked=${lockStatus}`,
                this,
                JSON.stringify({ locked: lockStatus })
            );
            // No error handling if API fails the Ui shows wrong state until it is refresh
        });
    };

    handleUnlockAllCats = (assessmentTaskIds) => {      // unlocks all student assessments in bulk (allows all students to edit submissions)    
        // Loop through each assessment ID
        assessmentTaskIds.forEach((completedAssessmentId) => {
            // Update local state to unlocked for this assessment
            this.setState((prevState) => {
                const newLockStatus = { ...prevState.lockStatus };
                newLockStatus[completedAssessmentId] = false;
                return { lockStatus: newLockStatus };
            }, () => {
                // Callback executes after state update
                const lockStatus = this.state.lockStatus[completedAssessmentId];
                // sync with server
                genericResourcePUT(
                    `/completed_assessment_unlock?completed_assessment_id=${completedAssessmentId}`,
                    this,
                    JSON.stringify({ locked: lockStatus })
                );
            });
        });
    };

    handleLockAllCats = (assessmentTaskIds) => { // Locks all student assessment in bluk (prevents all student from editing)
        // Loop through each assessment ID
        assessmentTaskIds.forEach((completedAssessmentId) => {
            // Update local state to locked for this assessment
            this.setState((prevState) => {
                const newLockStatus = { ...prevState.lockStatus };
                newLockStatus[completedAssessmentId] = true;
                return { lockStatus: newLockStatus };
            }, () => {
                // Callback executes after state updat
                const lockStatus = this.state.lockStatus[completedAssessmentId];
                // API Call: locks assessment on server
                genericResourcePUT(
                    `/completed_assessment_lock?completed_assessment_id=${completedAssessmentId}`,
                    this,
                    JSON.stringify({ locked: lockStatus })
                );
            });
        });
    };

    handleChange = (e) => {     // Updates notification message as instructor types and validates input
        // Extract field ID and value from input event
        const { id, value } = e.target;
        // Update state with new value and validation error
        this.setState({
            [id]: value,    //Updates the field
            errors: {
                ...this.state.errors,   //Preserve other error messages
                // Set error if empty, clears if has content
                [id]: value.trim() === '' ? `${id.charAt(0).toUpperCase() + id.slice(1)} cannot be empty` : '',
            },
        });
    };

  handleDialog = (isSingleMessage, singleCompletedAT) => {      // Opens or closes the notification dialog and sets notification mode
    this.setState({
        // toggle dialoog visibility
        showDialog: this.state.showDialog === false ? true : false,
        // Store whether this is single or mass notification
        isSingleMsg: isSingleMessage,
        // Store assessment ID for single notifications
        compATId: singleCompletedAT,
    });
  }

  handleSendNotification = () => {      //Sends notification email to students that thier assessment results are available
    // Gets notification message from state
    var notes = this.state.notes;

    //Create timestamp for notification
    var navbar = this.props.navbar;
    var state = navbar.state;
    var chosenAssessmentTask = state.chosenAssessmentTask;
    // Create timestamp for notification
    var date = new Date();

    //Validates if the message is empty
    if (notes.trim() === '') {
        //Set error message in state
        this.setState({
            errors: {
                notes: 'Notification Message cannot be empty',
            },
        });
        //Exit early without sending
      return;
    }

    // Check if this is single student or mass notification
    if(this.state.isSingleMsg) {
        //Indivdual Student notification Path
        // Resets single message flag, then send
      this.setState({isSingleMsg: false}, () => {
        //API Call: Send email to one student
        genericResourcePOST(
          `/send_single_email?team=${false}&completed_assessment_id=${this.state.compATId}`, 
          this, JSON.stringify({ 
            "notification_message": notes,
          }) 
        ).then((result) => {
          if(result !== undefined && result.errorMessage === null){
            this.setState({ 
              showDialog: false,    //Close notification dialog
              notificationSent: date,  // Set timestamp (disables all notify buttons)
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
            showDialog: false,      //Close notifcation dialog
            notificationSent: date, // Set timestamp
          });
        }
      });
    }

  };

    render() {      // Renders the component UI with assessemt table, lock controls, and notification buttons
        var navbar = this.props.navbar;

        var completedAssessmentTasks = navbar.adminViewCompleteAssessmentTasks.completeAssessmentTasks;

        var userNames = navbar.adminViewCompleteAssessmentTasks.userNames;

        var state = navbar.state;

        var chosenAssessmentTask = state.chosenAssessmentTask;

        var notificationSent = state.notificationSent;

        var chosenCourse = state.chosenCourse;

        var catIds = completedAssessmentTasks.map((task) => task.completed_assessment_id);

        const columns = [
            // Column 1 - assessment task name
            {
                name: "assessment_task_id",
                label: "Assessment Task",
                options: {
                    filter: true,
                    //Custom rendering: SHows assessment name instead of ID
                    customBodyRender: () => {
                        return (
                            <p variant="contained" align="left">
                                {chosenAssessmentTask ? chosenAssessmentTask["assessment_task_name"]: "N/A"}
                            </p>
                        );
                    },
                },
            },
            //Column 2 - student name
            {
                name: "last_name",
                label: "Student Name",
                options: {
                    filter: true,
                    // custom rendering shows last name or N/A if missing
                    customBodyRender: (last_name) => {
                        return (
                            <p variant="contained" align="left">
                                {last_name ? last_name : "N/A"}
                            </p>
                        );
                    },
                },
            },
            // column 3 - assessor (who graded the assessment)
            {
                name: "completed_by",
                label: "Assessor",
                options: {
                    filter: true,
                    // Customer rendering Maps user ID to readable name
                    customBodyRender: (completed_by) => {
                        return (
                            <p variant="contained" align="left">
                                {userNames && completed_by ? userNames[completed_by] : "N/A"}
                            </p>
                        );
                    },
                },
            },
            // Column 4 - Initial Time (when asessment was first started)
            {
                name: "initial_time",
                label: "Initial Time",
                options: {
                    filter: true,
                    // custom rendering converts timestamp to human-readable format in cousr timezone
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
            // Column 5: last upadted (when assessment was last modified)
            {
                name: "last_update",
                label: "Last Updated",
                options: {
                    filter: true,
                    // custom rendering: converts timezone to human readable
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
            // Column 6 - lock/unlock toggle
            {
                name: "completed_assessment_id",
                label: "Lock",
                options: {
                    filter: true,
                    customBodyRender: (completedAssessmentId) => {
                        const task = completedAssessmentTasks.find((task) => task["completed_assessment_id"] === completedAssessmentId);
                        // determine lock status by first checking local state (recent) and fallback to server data if state not set yet
                        const isLocked = this.state.lockStatus[completedAssessmentId] !== undefined ? this.state.lockStatus[completedAssessmentId] : (task ? task.locked : false);

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
                                        onClick={() => this.handleLockToggle(completedAssessmentId, task)}
                                    >
                                        {isLocked ? <LockIcon /> : <LockOpenIcon />}
                                    </IconButton>
                                </Tooltip>
                            );
                    },
                }
            },
            //Column 7 - sees more detail
            {
                name: "completed_assessment_id",
                label: "See More Details",
                options: {
                    filter: false,
                    sort: false,
                    setCellHeaderProps: () => { return { align:"center", className:"button-column-alignment"}},
                    setCellProps: () => { return { align:"center", className:"button-column-alignment"} },
                    customBodyRender: (completedAssessmentId, completeAssessmentTasks) => {
                        // Get row index to access user_id from props array
                        const rowIndex = completeAssessmentTasks.rowIndex;
                        // Extract user_id from completedAssessment prop 
                        const userId = this.props.completedAssessment[rowIndex].user_id;
                        if (completedAssessmentId) {
                            return (
                                <IconButton // problem : need to pass who im looking at
                                    align="center"
                                    onClick={() => {
                                        // Navigate to detailed assessment view
                                        //Passes assessment data, userID/ID, task info
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
      // Column 8 - indivudal notification button
      {
        name: "Student/Team Id",
        label: "Notify",
        options: {
          filter: false,
          sort: false,
          setCellHeaderProps: () => { return { align:"center", className:"button-column-alignment"}},
          setCellProps: () => { return { align:"center", className:"button-column-alignment"} },
          customBodyRender: (completedAssessmentId, completeAssessmentTasks) => {
            const rowIndex = completeAssessmentTasks.rowIndex;
            //Hardcoded in
            // Assumes completed_assessment_id is always at index 5 in tableData array
            //If columns are redordered this breaks
            const completedATIndex = 5;
            completedAssessmentId  = completeAssessmentTasks.tableData[rowIndex][completedATIndex];
            if (completedAssessmentId !== null) {
              return (
                <Tooltip
                    title={
                        <>
                            <p>
                                Notifies one individual.
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
                <p variant='contained' align='center' > {''} </p>
              )
            }
          }
        }
      },
    ];

        const options = {
            onRowsDelete: false,            //Disable row deletion
            download: false,                //Disable download button
            print: false,                   //Disable print button
            selectableRows: "none",         //Disable row selection checkboxes
            viewColumns: false,             //Disable view columns button
            selectableRowsHeader: false,    //Disable select all checkbox in header
            responsive: "vertical",         //table responsiveness scrolling
            tableBodyMaxHeight: "21rem",    //max height beofre scrolling
        };

        //Render UI
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
            <Tooltip
                title={
                    <>
                        <p>
                            Notifies all individuals results are available.
                        </p>
                    </>
                }>
                <span>
                    <CustomButton
                    label="Notify All"
                    onClick={() => this.handleDialog(false)}
                    isOutlined={false}
                    disabled={notificationSent}
                    aria-label="viewCompletedAssessmentIndividualSendNotificationButton"
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

export default ViewCompleteIndividualAssessmentTasks;
