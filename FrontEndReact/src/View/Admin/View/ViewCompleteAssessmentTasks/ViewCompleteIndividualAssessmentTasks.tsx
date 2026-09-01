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
import { CompleteAssessmentTask } from '../../../../types/CompleteAssessmentTask';
import { GridColDef } from '@mui/x-data-grid';

// Shows a table of completed individual student rubrics with notifications and has privileges to who can edit submissions//
interface ViewCompleteIndividualAssessmentTasksProps {
    navbar: any;
    completedAssessment: CompleteAssessmentTask[];
}

interface ViewCompleteIndividualAssessmentTasksState {
    errorMessage: string | null;
    isLoaded: boolean | null;
    showDialog: boolean;
    notes: string;
    notificationSent: Date | false;
    isSingleMsg: boolean;
    compATId: number | null;
    lockStatus: Record<number, boolean>;
    errors: { notes: string };
}

class ViewCompleteIndividualAssessmentTasks extends Component<ViewCompleteIndividualAssessmentTasksProps, ViewCompleteIndividualAssessmentTasksState> {
    constructor(props: ViewCompleteIndividualAssessmentTasksProps) {
        super(props);
    // Initialize component state
    this.state = {
        errorMessage: null, // Stores API error messages
        isLoaded: null,     //Loading state indicator
        showDialog: false,    //controls notification dialog visibility
        notes: '',            // Notification message content typed by instructor
        notificationSent: false,    //tracks if notification sent this also block duplicate sends
        isSingleMsg: false,
        compATId: null,         //Completed assessment ID for individual notifications
        lockStatus: {}, // Maps completed_assessment_id -> boolean (locked state)

        errors: {
            notes:''
        }
      };
    }

    componentDidMount() {       // Initialize Lock Status from server data when component first loads
        // extract assessment data from props
        const completedAssessmentTasks = this.props.navbar.adminViewCompleteAssessmentTasks.completeAssessmentTasks;
        // Create empty object to store lock status
        const initialLockStatus: Record<number, boolean> = {};
        // Preload lock status from server data to avoid UI flicker //
        completedAssessmentTasks.forEach((task: CompleteAssessmentTask) => {
            initialLockStatus[task.completed_assessment_id] = task.locked;
        });
        // Update component state with lock status
        this.setState({ lockStatus: initialLockStatus });
    }

    handleLockToggle = (completedAssessmentId: number, task: CompleteAssessmentTask | undefined) => { //Toggles lock state for a single student assessment
        // Update local lock status state
        this.setState((prevState: ViewCompleteIndividualAssessmentTasksState) => {
            //create copy of lock status object
            const newLockStatus = { ...prevState.lockStatus };
            //Flip the boolean value for this assessment
            newLockStatus[completedAssessmentId] = !newLockStatus[completedAssessmentId];
            return { lockStatus: newLockStatus };
        }, () => {
            //callback executes after state update completes
            const lockStatus = this.state.lockStatus[completedAssessmentId];
            // Sync with server (in callback)
            //PUT /completed_assessment_toggle_lock?completed_assessment_id={id} into true/false
            genericResourcePUT(
                `/completed_assessment_toggle_lock?completed_assessment_id=${completedAssessmentId}&locked=${lockStatus}`,
                this,
                JSON.stringify({ locked: lockStatus })
            );
            // No error handling if API fails the UI shows wrong state until it is refreshed
        });
    };

    handleUnlockAllCats = (assessmentTaskIds: number[]) => { // unlocks all student assessments in bulk (allows all students to edit submissions)
        // Loop through each assessment ID
        assessmentTaskIds.forEach((completedAssessmentId: number) => {
            // Update local state to unlocked for this assessment
            this.setState((prevState: ViewCompleteIndividualAssessmentTasksState) => {
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

    handleLockAllCats = (assessmentTaskIds: number[]) => { // Locks all student assessment in bulk (prevents all student from editing)
        // Loop through each assessment ID
        assessmentTaskIds.forEach((completedAssessmentId: number) => {
            // Update local state to locked for this assessment
            this.setState((prevState: ViewCompleteIndividualAssessmentTasksState) => {
                const newLockStatus = { ...prevState.lockStatus };
                newLockStatus[completedAssessmentId] = true;
                return { lockStatus: newLockStatus };
            }, () => {
                // Callback executes after state update
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

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { // Updates notification message as instructor types and validates input
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
        } as any);
    };

    handleDialog = (isSingleMessage: boolean, singleCompletedAT: number | null) => { // Opens or closes the notification dialog and sets notification mode
      this.setState({
        // toggle dialog visibility
          showDialog: this.state.showDialog === false ? true : false,
          // Store whether this is single or mass notification
          isSingleMsg: isSingleMessage,
          // Store assessment ID for single notifications
          compATId: singleCompletedAT,
      });
    }

    handleSendNotification = () => { //Sends notification email to students that their assessment results are available
      // Gets notification message from state
      var notes = this.state.notes;
      //Create timestamp for notification
      var navbar = this.props.navbar;
        // Create timestamp for notification
      var state = navbar.state;

      var chosenAssessmentTask = state.chosenAssessmentTask;

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
        //Individual Student notification Path
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
                showDialog: false, //Close notification dialog
                notificationSent: date, // Set timestamp (disables all notify buttons)
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
              showDialog: false,     //Close notification dialog
              notificationSent: date,   // Set timestamp
            });
          }
        });
      }

    };

    render() {      // Renders the component UI with assessment table, lock controls, and notification buttons
        var navbar = this.props.navbar;

        var completedAssessmentTasks = navbar.adminViewCompleteAssessmentTasks.completeAssessmentTasks;

        var userNames = navbar.adminViewCompleteAssessmentTasks.userNames;

        var state = navbar.state;

        var chosenAssessmentTask = state.chosenAssessmentTask;

        var notificationSent = state.notificationSent;

        var chosenCourse = state.chosenCourse;

        var catIds = completedAssessmentTasks.map((task: any) => task.completed_assessment_id);

        const columns: GridColDef[] = [
            // Column 1 - assessment task name
            {
                field: "assessment_task_id",
                headerName: "Assessment Task",
                flex: 1,
                //Custom rendering: Shows assessment name instead of ID
                renderCell: () => {
                    return (
                        <p>
                            {chosenAssessmentTask ? chosenAssessmentTask["assessment_task_name"]: "N/A"}
                        </p>
                    );
                },
            },
            //Column 2 - student name
            {
                field: "last_name",
                headerName: "Student Name",
                flex: 1,
                // custom rendering shows last name or N/A if missing
                renderCell: (params) => {
                    return (
                        <p>
                            {params.value ? params.value : "N/A"}
                        </p>
                    );
                },
            },
            // column 3 - assessor (who graded the assessment)
            {
                field: "completed_by",
                headerName: "Assessor",
                flex: 1,
                // Custom rendering Maps user ID to readable name
                renderCell: (params) => {
                    return (
                        <p>
                            {userNames && params.value ? userNames[params.value] : "N/A"}
                        </p>
                    );
                },
            },
            // Column 4 - Initial Time (when assessment was first started)
            {
                field: "initial_time",
                headerName: "Initial Time",
                flex: 1,
                // custom rendering converts timestamp to human-readable format in course timezone
                renderCell: (params) => {
                    const timeZone = chosenAssessmentTask ? chosenAssessmentTask.time_zone : "";

                    return (
                        <p>
                            {getHumanReadableDueDate(params.value,timeZone)}
                        </p>
                    );
                },
            },
            // Column 5: last updated (when assessment was last modified)
            {
                field: "last_update",
                headerName: "Last Updated",
                flex: 1,
                // custom rendering: converts timezone to human readable
                renderCell: (params) => {
                    const timeZone = chosenAssessmentTask ? chosenAssessmentTask.time_zone : "";

                    return(
                        <p>
                            {getHumanReadableDueDate(params.value,timeZone)}
                        </p>
                    )
                },
            },
            // Column 6 - lock/unlock toggle
            {
                field: "completed_assessment_id",
                headerName: "Lock",
                flex: 1,
                renderCell: (params) => {
                    const completedAssessmentId = params.value;
                    const task = completedAssessmentTasks.find((task: any) => task["completed_assessment_id"] === completedAssessmentId);
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
            },
            //Column 7 - sees more detail
            {
                field: "see_more_action",
                headerName: "See More Details",
                flex: 1,
                sortable: false,
                filterable: false,
                align: "center",
                headerAlign: "center",
                renderCell: (params) => {
                    const completedAssessmentId = params.row.completed_assessment_id;
                    const userId = params.row.user_id;
                    if (completedAssessmentId) {
                        return (
                            <IconButton
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
                            <p> {"N/A"} </p>
                        )
                    }
                }
            },
            // Column 8 - individual notification button
            {
                field: "notify_action",
                headerName: "Notify",
                flex: 1,
                sortable: false,
                filterable: false,
                align: "center",
                headerAlign: "center",
                renderCell: (params) => {
                    const completedAssessmentId = params.row.completed_assessment_id;
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
                                    // align="center"
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
            },
        ];

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
              handleDialog={() => this.handleDialog(false, null)}
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
                    onClick={() => this.handleDialog(false, null)}
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
          getRowId={(row) => row.completed_assessment_id}
          height="21rem"
        />
        </Box>
      </Box>
    );
  }
}

export default ViewCompleteIndividualAssessmentTasks;
