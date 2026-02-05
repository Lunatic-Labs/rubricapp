import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import CustomDataTable from '../../../Components/CustomDataTable';
import { Button } from '@mui/material';
import { Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { genericResourceGET, genericResourcePUT, getHumanReadableDueDate } from '../../../../utility';
import Loading from '../../../Loading/Loading';
import { IconButton } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import PublishIcon from '@mui/icons-material/Publish';
import UnpublishedIcon from '@mui/icons-material/Unpublished';
import Cookies from 'universal-cookie';

//Child component that display a table of all assessment tasks (rubric) for a course comprehensive management capabilites 
// including publish/lock controls, editing, viewing completed
//assessment, starting new assessments and exporting results to Csv.

interface ViewAssessmentTasksState {
    isLoaded: any;
    errorMessage: any;
    csvCreation: any;
    downloadedAssessment: any;
    exportButtonId: any;
    completedAssessments: any;
    assessmentTasks: any;
    lockStatus: any;
    publishedStatus: any;
    isViewingAsStudent?: boolean;
}

class ViewAssessmentTasks extends Component<any, ViewAssessmentTasksState> {
    handleDownloadCsv: any;
    handleLockToggle: any;
    handlePublishToggle: any;
    constructor(props: any) {
        super(props);

        this.state = {
            isLoaded: null,                     // Loading state for data fetching
            errorMessage: null,                 // stores API error message
            csvCreation: null,                  // Holds CSV data from export API call
            downloadedAssessment: null,         //Name of assessemtn being downloads 
            exportButtonId: {},                 //Maps assessment name to button IDS for re-enabling 
            completedAssessments: null,         //Array of completed assessment counts per task
            assessmentTasks: null,              //Array of assessment taks 
            lockStatus: {},                     // Maps assessment_task_id -> boolean (locked state)
            publishedStatus: {},                //Maps assessment_task_id -> boolean (published state)
        }

        // Fetched CSV export data for an assessment task and triggers browser download
        // Temporarily disables export button to prevent duplicate  requests
        this.handleDownloadCsv = (atId: any, exportButtonId: any, assessmentTaskIdToAssessmentTaskName: any) => {
            let promise = genericResourceGET(
                `/csv_assessment_export?assessment_task_id=${atId}&format=0`,
                "csv_creation",
                this,
                {dest: "csvCreation"} // Maps API response to state.csvCreation
            );

            //Handle successful CSV data retrieval

            promise.then(result => {
                if (result !== undefined && result.errorMessage === null) {
                    //Look up human-readbable assessment name from ID
                    var assessmentName = assessmentTaskIdToAssessmentTaskName[atId];
                    //Store button ID for later re-enabling (after download completes)
                    var newExportButtonJSON = this.state.exportButtonId;
                    newExportButtonJSON[assessmentName] = exportButtonId;
                    //Update state - this triggers componentDidUpdate
                    this.setState({
                        downloadedAssessment: assessmentName,
                        exportButtonId: newExportButtonJSON
                    });
                }
                //Error handling: if result undefined or has error, nothing happens
                //User sees no feedback (should display error message)
            });
        }

        //Toggles lock state fir an assessment task
        //Lock prevents students from editing their submissions
        //This updates lock state, sends PUT request to server in setState callback
        this.handleLockToggle = (assessmentTaskId: any, task: any) => {
          this.setState((prevState: any) => {
              const newLockStatus = { ...prevState.lockStatus };
              //Flip booleans: true -> false and vice versa
              newLockStatus[assessmentTaskId] = !newLockStatus[assessmentTaskId];
              return { lockStatus: newLockStatus };
          }, () => {
            //Callback executes after state update completes
              const lockStatus = this.state.lockStatus[assessmentTaskId];
            //API call: Sync lock state with server
            //PUT /assessement_task_toggle_lock?
              genericResourcePUT(
                  `/assessment_task_toggle_lock?assessmentTaskId=${assessmentTaskId}`,
                  this,
                  JSON.stringify({ locked: lockStatus })
              );
          });
        };

        //Toggles published state for an assessment task (published <-> unpublished)
        //Published tasks are visible to students; unpublished task are hidden
        this.handlePublishToggle = (assessmentTaskId: any, task: any) => {
          this.setState((prevState: any) => {
              const newPublishedStatus = { ...prevState.publishedStatus };
              //Flip boolean: true<->false
              newPublishedStatus[assessmentTaskId] = !newPublishedStatus[assessmentTaskId];
              return { publishedStatus: newPublishedStatus };
          }, () => {
              const publishedStatus = this.state.publishedStatus[assessmentTaskId];

              genericResourcePUT(
                  `/assessment_task_toggle_published?assessmentTaskId=${assessmentTaskId}`,
                  this,
                  JSON.stringify({ published: publishedStatus })
              );
          });
        };

    }

    //detects when CSV data is ready in state and triggers browser download.
    //Handles the actual file download process after handleDownloadCsv sets up the data.

    componentDidUpdate () {
        //check if CSV data is ready for download
        if(this.state.isLoaded && this.state.csvCreation) {
            //Extract CSV string from API response
            const fileData = this.state.csvCreation["csv_data"];
            //Create Blob from CSV string
            //Blob is required for creating downloadable file in browser

            const blob = new Blob([fileData], { type: 'text/csv;charset=utf-8;' });
            //Create temporary object URL pointing to blob
            const url = URL.createObjectURL(blob);
            //Create invisible anchor element for download
            const link = document.createElement("a");
            //Set filename for download
            //Uses assessment name + ".csv"
            link.download = this.state.downloadedAssessment + ".csv";
            //Set href to blob URL
            link.href = url;
            //Override filename with course name + ".csv"
            link.setAttribute('download', this.props.navbar.state.chosenCourse['course_name']+'.csv');
            link.click();
            //Get assessment name for finding button
            var assessmentName = this.state.downloadedAssessment;
            //Find export button in DOM using stored ID
            const exportAssessmentTask = document.getElementById(this.state.exportButtonId[assessmentName])

            //Re-enable export button after 10 second delay
            //prevents rapid repeated exports

            setTimeout(() => {
                if(exportAssessmentTask) {
                    //Remove disabled atrribute to make button clickable again
                    exportAssessmentTask.removeAttribute("disabled");
                }
            }, 10000);
            //Clean up state after download initiated
            //resets to null so componentDidUpdate doesn't trigger again
            this.setState({
                isLoaded: null,
                csvCreation: null
            });
        }
    }

    //Fetches assessment tasks and completed assessment counts when component first loads
    //Also initializes lock and published status from parent's data.
    //This extracts course_id from props via navbar, fetches assessment task 

    componentDidMount() {
        //const isViewingAsStudent = user?.viewingAsStudent || false;
        
        const courseId = this.props.navbar.state.chosenCourse.course_id;

        //API Call 1: fetch Assessment Tasks
        //GET /assessment_task
        //Query Parameters - course_id: Filters to only this course's assessment tasks
        // Warning! This has a duplicate request data, parent function AdminViewAssessmentTask made exact API call

        const isViewingAsStudent = this.props.isViewingAsStudent !== undefined 
        ? this.props.isViewingAsStudent 
        : (() => {
            const cookies = new Cookies();
            const user = cookies.get('user');
            return user?.viewingAsStudent || false;
        })();
    
        genericResourceGET(
            `/assessment_task?course_id=${courseId}`,
            "assessment_tasks",
            this,
            {dest: "assessmentTasks"}
        );

        //API Call 2: FEtch completed Assessment Counts
        //Determined if View or export button should be enabled
        //Query Parameters: course_id: filters to this course, only_course=true: returns aggregated counts
    
        genericResourceGET(
            `/completed_assessment?course_id=${courseId}&only_course=true`,
            "completed_assessments",
            this,
            {dest: "completedAssessments"}  //maps to state.completedAssessments
        );
        
        //Initialization: Extract assessment taks from Parent's data
        //Note The PARENT already fetched this via API
        const assessmentTasks = this.props.navbar.adminViewAssessmentTask.assessmentTasks;
        //Create empty objects to store initial lock and published states
        const initialLockStatus: any = {};
        const initialPublishedStatus: any = {};
        
        //Loop through each assessment task and extract initial states
        assessmentTasks.forEach((task: any) => {
            initialLockStatus[task.assessment_task_id] = task.locked;
            initialPublishedStatus[task.assessment_task_id] = task.published;
        });
    
        this.setState({ 
            lockStatus: initialLockStatus, 
            publishedStatus: initialPublishedStatus,
            isViewingAsStudent: isViewingAsStudent  // Store this in state
        });
    }

    //Renders comprehensive assessment task management table with columns including 
    //task details, publish/lock controls and action buttons fro each/view/start/export.
    //This checks if assessment task or completed assessments are null, if null: will show loading spinner (API calls)

    render() {
        //Loading State check
        //Waiting on API calls before rendering table
        if (this.state.assessmentTasks === null || this.state.completedAssessments === null) {
            return <Loading />;
        }
        //Extract fixed teams setting from course configuration
        //If true: teams are pre-assigned by instructor
        const fixedTeams = this.props.navbar.state.chosenCourse["use_fixed_teams"];

        var navbar = this.props.navbar;
        var adminViewAssessmentTask = navbar.adminViewAssessmentTask;

        var roleNames = adminViewAssessmentTask.roleNames;
        var rubricNames = adminViewAssessmentTask.rubricNames;
        var assessmentTasks = adminViewAssessmentTask.assessmentTasks;

        let assessmentTasksToDueDates: any = {};

        for(let index = 0; index < assessmentTasks.length; index++) {
            assessmentTasksToDueDates[assessmentTasks[index]["assessment_task_id"]] = {
                "due_date": assessmentTasks[index]["due_date"],
                "time_zone": assessmentTasks[index]["time_zone"]
            };
        }

        var assessmentTaskIdToAssessmentTaskName: any = {};

        for(let index = 0; index < assessmentTasks.length; index++) {
            assessmentTaskIdToAssessmentTaskName[assessmentTasks[index]["assessment_task_id"]] = assessmentTasks[index]["assessment_task_name"];
        }

        var state = navbar.state;
        var chosenCourse = state.chosenCourse;
        var setAddAssessmentTaskTabWithAssessmentTask = navbar.setAddAssessmentTaskTabWithAssessmentTask;
        var setCompleteAssessmentTaskTabWithID = navbar.setCompleteAssessmentTaskTabWithID;

        const columns = [
            {
                name: "assessment_task_name",
                label: "Task Name",
                options: {
                    filter: true,
                    setCellHeaderProps: () => { return { width:"117px"}},
                    setCellProps: () => { return { width:"117px"} },
                    customBodyRender: (assessmentTaskName: any) => {
                        return(
                            <>
                                {assessmentTaskName ? assessmentTaskName : "N/A"}
                            </>
                        )
                    }
                }
            },
            {
                name: "assessment_task_id",
                label: "Due Date",
                options: {
                    filter: true,
                    setCellHeaderProps: () => { return { width:"160px"}},
                    setCellProps: () => { return { width:"160px"} },
                    customBodyRender: (assessmentTaskId: any) => {
                        let dueDateString = getHumanReadableDueDate(
                            assessmentTasksToDueDates[assessmentTaskId]["due_date"],
                            assessmentTasksToDueDates[assessmentTaskId]["time_zone"]
                        );

                        return(
                            <>
                                {assessmentTasksToDueDates[assessmentTaskId]["due_date"] && dueDateString ? dueDateString : "N/A"}
                            </>
                        )
                    }
                }
            },
            {
                name: "role_id",
                label: "Completed By",
                options: {
                    filter: true,
                    setCellHeaderProps: () => { return { width:"80px"}},
                    setCellProps: () => { return { width:"80px"} },
                    customBodyRender: (roleId: any) => {
                        return (
                            <>
                                {roleNames && roleId ? roleNames[roleId] : "N/A"}
                            </>
                        )
                    }
                }
            },
            {
                name: "rubric_id",
                label: "Rubric Used",
                options: {
                    filter: true,
                    setCellHeaderProps: () => { return { width:"117px"}},
                    setCellProps: () => { return { width:"117px"} },
                    customBodyRender: (rubricId: any) => {
                        return (
                            <>
                                {rubricNames && rubricId ? rubricNames[rubricId] : "N/A"}
                            </>
                        )
                    }
                }
            },
            /*
            {
                name: "show_ratings",
                label: "Ratings?",
                options: {
                    filter: true,
                    setCellHeaderProps: () => { return { width:"80px"}},
                    setCellProps: () => { return { width:"80px"} },
                    customBodyRender: (ratings) => {
                        return(
                            <>
                                {ratings ? "Yes" : "No"}
                            </>
                        )
                    }
                }
            },
            {
                name: "show_suggestions",
                label: "Improvements?",
                options: {
                    filter: true,
                    setCellHeaderProps: () => { return { width:"20px"}},
                    setCellProps: () => { return { width:"20px"} },
                    customBodyRender: (suggestions) => {
                        return(
                            <>
                                {suggestions ? "Yes" : "No"}
                            </>
                        )
                    }
                }
            },
            */
            {
                name: "unit_of_assessment",
                label: "Team?",
                options: {
                    filter: true,
                    setCellHeaderProps: () => { return { width:"80px"}},
                    setCellProps: () => { return { width:"80px"} },
                    customBodyRender: (unitOfAssessment: any) => {
                        return(
                            <>
                                {unitOfAssessment ? "Yes" : "No"}
                            </>
                        )
                    }
                }
            },
            {
                name: "assessment_task_id",
                label: "Publish",
                options: {
                    filter: false,
                    sort: false,
                    setCellHeaderProps: () => { return { align:"center", width:"70px", className:"button-column-alignment"}},
                    setCellProps: () => { return { align:"center", width:"70px", className:"button-column-alignment"} },
                    customBodyRender: (atId: any) => {
                        const task = assessmentTasks.find((task: any) => task["assessment_task_id"] === atId);
                        const isPublished = this.state.publishedStatus[atId] !== undefined ? this.state.publishedStatus[atId] : (task ? task.published : false);
                        return (
                            <Tooltip 
                                title={
                                    <>
                                        <p> 
                                            If the icon shows <strong>an upward arrow</strong>, the assessment task is published and visible to students; otherwise, the task is unpublished and hidden from students. 
                                        </p>
                                         
                                    </>
                                }>
                                <IconButton
                                    aria-label={isPublished ? "unlock" : "lock"}
                                    onClick={() => this.handlePublishToggle(atId, task)}
                                >
                                {isPublished ? <PublishIcon /> : <UnpublishedIcon />}
                                </IconButton>
                            </Tooltip>
                        );
                    }
                }
            },
            {
                name: "assessment_task_id",
                label: "Lock",
                options: {
                    filter: false,
                    sort: false,
                    setCellHeaderProps: () => { return { align:"center", width:"70px", className:"button-column-alignment"}},
                    setCellProps: () => { return { align:"center", width:"70px", className:"button-column-alignment"} },
                    customBodyRender: (atId: any) => {
                        const task = assessmentTasks.find((task: any) => task["assessment_task_id"] === atId);
                        const isLocked = this.state.lockStatus[atId] !== undefined ? this.state.lockStatus[atId] : (task ? task.locked : false);

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
                                    onClick={() => this.handleLockToggle(atId, task)}
                                >
                                {isLocked ? <LockIcon /> : <LockOpenIcon />}
                                </IconButton>
                            </Tooltip>
                        );
                    }
                }
            },
            {
                name: "assessment_task_id",
                label: "Edit",
                options: {
                    filter: false,
                    sort: false,
                    setCellHeaderProps: () => { return { align:"center", width:"70px", className:"button-column-alignment"}},
                    setCellProps: () => { return { align:"center", width:"70px", className:"button-column-alignment"} },
                    customBodyRender: (assessmentTaskId: any) => {
                        if (assessmentTaskId && assessmentTasks && chosenCourse && rubricNames) {
                            return (
                                <Tooltip
                                    title={
                                        <>
                                            <p>
                                                Instructors can modify the details of the assessment task such as its name, unit of assessment, due date or assigned rubric.
                                            </p>
                                        </>
                                    }>
                                    <IconButton
                                        id=""
                                        onClick={() => {
                                            setAddAssessmentTaskTabWithAssessmentTask(
                                                assessmentTasks,
                                                assessmentTaskId,
                                                chosenCourse,
                                                roleNames,
                                                rubricNames
                                            )
                                        }}
                                        aria-label='editAssessmentIconButton'
                                    >
                                    <EditIcon sx={{color:"black"}}/>
                                    </IconButton>
                                </Tooltip>
                            )

                        } else {
                            return(
                                <>
                                    {"N/A"}
                                </>
                            )
                        }
                    },
                }
            },
            {
                name: "assessment_task_id",
                label: "View",
                options: {
                    filter: false,
                    sort: false,
                    setCellHeaderProps: () => { return { align:"center", width:"70px", className:"button-column-alignment"}},
                    setCellProps: () => { return { align:"center", width:"70px", className:"button-column-alignment"} },
                    customBodyRender: (assessmentTaskId: any) => {
                        if (assessmentTaskId && assessmentTasks) {
                            const selectedTask = assessmentTasks.find((task: any) => task.assessment_task_id === assessmentTaskId);
                            const completedAssessments = this.state.completedAssessments.filter((ca: any) => ca.assessment_task_id === assessmentTaskId);
                            const completedCount = completedAssessments.length > 0 ? completedAssessments[0].completed_count : 0;

                            if (completedCount === 0) {
                                return (
                                    <>
                                        <Tooltip
                                            title={
                                                <>
                                                    <p>
                                                        Completed Rubrics are not present.
                                                    </p>
                                                </>
                                            }>
                                            <span>
                                                <IconButton
                                                    id=""
                                                    disabled
                                                    aria-label='viewCompletedAssessmentIconButton'
                                                >
                                                <VisibilityIcon sx={{color: "rgba(0, 0, 0, 0.26)"}} />
                                                </IconButton>
                                            </span>
                                        </Tooltip>
                                    </>
                                );
                            }
                            if (selectedTask) {
                                return (
                                    <>
                                        <Tooltip
                                            title={
                                                <>
                                                    <p>
                                                        Instructors can review the contents of the assessment task to ensure everything is up to date.
                                                    </p>
                                                </>
                                            }>
                                            <IconButton
                                                id=""
                                                onClick={() => {
                                                    if (this.state.isViewingAsStudent) {
                                                        // Call student view method
                                                        navbar.setStudentAssessmentView(selectedTask);
                                                    } else {
                                                        // Call admin view method
                                                        setCompleteAssessmentTaskTabWithID(selectedTask);
                                                    }
                                                }}
                                                aria-label='viewCompletedAssessmentIconButton'
                                            >
                                            <VisibilityIcon sx={{color:"black"}} />
                                            </IconButton>
                                        </Tooltip>
                                    </>
                                );
                            }
                        }
                        return(
                            <>
                                {"N/A"}
                            </>
                        )
                    }
                }
            },
            {
                name: "assessment_task_id",
                label: "To Do",
                options: {
                    filter: false,
                    sort: false,
                    setCellHeaderProps: () => { return { align:"center", width:"80px", className:"button-column-alignment"}},
                    setCellProps: () => { return { align:"center", width:"80px", className:"button-column-alignment"} },
                    customBodyRender: (atId: any) => {
                        const assessmentTask = assessmentTasks.find((task: any) => task.assessment_task_id === atId);
                        const isTeamAssessment = assessmentTask && assessmentTask.unit_of_assessment;
                        const teamsExist = this.props.teams && this.props.teams.length > 0;

                        if (isTeamAssessment && (fixedTeams && !teamsExist)) {
                            return (
                                <Tooltip title="No teams available for this team assessment">
                                    <span>
                                        <Button
                                            className='primary-color'
                                            variant='contained'
                                            disabled
                                            aria-label="startAssessmentTasksButton"
                                        >
                                            START
                                        </Button>
                                    </span>
                                </Tooltip>
                            );
                        }

                        return (
                            <Tooltip
                                title={
                                    <>
                                        <p>
                                            Begins the process of completing an assessment task, allowing the assessor to review the instructions and rubric criteria for the selected task.
                                        </p>
                                    </>
                                }>
                                <Button
                                    className='primary-color'
                                    variant='contained'
                                    onClick={() => {
                                        navbar.setAssessmentTaskInstructions(assessmentTasks, atId);
                                    }}
                                    aria-label='startAssessmentTasksButton'
                                >
                                START
                                </Button>
                            </Tooltip>
                        )
                    }
                }
            },
            {
                name: "assessment_task_id",
                label: "Export",
                options: {
                    filter: false,
                    sort: false,
                    setCellHeaderProps: () => { return { align:"center", width:"80px", className:"button-column-alignment"}},
                    setCellProps: () => { return { align:"center", width:"80px", className:"button-column-alignment"} },
                    customBodyRender: (atId: any) => {
                        const completedAssessments = this.state.completedAssessments.filter((ca: any) => ca.assessment_task_id === atId);
                        const completedCount = completedAssessments.length > 0 ? completedAssessments[0].completed_count : 0;

                        if (completedCount === 0) {                                     // this code makes the export button and its text darker when disabled.
                            return (
                                <Tooltip title="No completed assessments to export">
                                    <span>
                                        <Button
                                            id={"assessment_export_" + atId}
                                            className='primary-color'
                                            variant='contained'
                                            disabled
                                            aria-label='exportAssessmentTaskButton'
                                            sx={{
                                                '&.Mui-disabled': {
                                                color: 'var(--export_disabled_text)',
                                                backgroundColor: 'var(--button-disabled-bg)',
                                                }
                                            }}
                                            >
                                            EXPORT
                                        </Button>
                                    </span>
                                </Tooltip>
                            );
                        }
                        return (
                                <Button
                                    id={"assessment_export_" + atId}
                                    className='primary-color'
                                    variant='contained'

                                    onClick={() => {
                                        this.handleDownloadCsv(atId, "assessment_export_" + atId, assessmentTaskIdToAssessmentTaskName);
                                    }}

                                    aria-label='exportAssessmentTaskButton'
                                >
                                    Export
                                </Button>
                        )
                    }
                }
            },
        ]

        const options = {
            onRowsDelete: false,
            download: false,
            print: false,
            viewColumns: false,
            selectableRows: "none",
            selectableRowsHeader: false,
            responsive: "vertical",
            tableBodyMaxHeight: "50vh"
        };

        return(
            <>
                <CustomDataTable
                    data={assessmentTasks}
                    columns={columns}
                    options={options}
                />
            </>
        )
    }
}

export default ViewAssessmentTasks;
