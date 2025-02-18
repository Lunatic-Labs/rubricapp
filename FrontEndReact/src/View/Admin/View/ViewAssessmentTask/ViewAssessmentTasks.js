import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import CustomDataTable from '../../../Components/CustomDataTable.js';
import { Button } from '@mui/material';
import { Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { formatDueDate, genericResourceGET, genericResourcePUT, getHumanReadableDueDate } from '../../../../utility.js';
import Loading from '../../../Loading/Loading.js';
import { IconButton } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import PublishIcon from '@mui/icons-material/Publish';
import UnpublishedIcon from '@mui/icons-material/Unpublished';

class ViewAssessmentTasks extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoaded: null,
            errorMessage: null,
            csvCreation: null,
            downloadedAssessment: null,
            exportButtonId: {},
            completedAssessments: null,
            assessmentTasks: null,
            lockStatus: {},
            publishedStatus: {},
        }

        this.handleDownloadCsv = (atId, exportButtonId, assessmentTaskIdToAssessmentTaskName) => {
            let promise = genericResourceGET(
                `/csv_assessment_export?assessment_task_id=${atId}&format=0`,
                "csv_creation",
                this,
                {dest: "csvCreation"}
            );

            promise.then(result => {
                if (result !== undefined && result.errorMessage === null) {
                    var assessmentName = assessmentTaskIdToAssessmentTaskName[atId];

                    var newExportButtonJSON = this.state.exportButtonId;

                    newExportButtonJSON[assessmentName] = exportButtonId;

                    this.setState({
                        downloadedAssessment: assessmentName,
                        exportButtonId: newExportButtonJSON
                    });
                }
            });
        }

        this.handleLockToggle = (assessmentTaskId, task) => {
          this.setState((prevState) => {
              const newLockStatus = { ...prevState.lockStatus };
              newLockStatus[assessmentTaskId] = !newLockStatus[assessmentTaskId];
              return { lockStatus: newLockStatus };
          }, () => {
              const lockStatus = this.state.lockStatus[assessmentTaskId];

              genericResourcePUT(
                  `/assessment_task_toggle_lock?assessmentTaskId=${assessmentTaskId}`,
                  this,
                  JSON.stringify({ locked: lockStatus })
              );
          });
        };

        this.handlePublishToggle = (assessmentTaskId, task) => {
          this.setState((prevState) => {
              const newPublishedStatus = { ...prevState.publishedStatus };
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

    componentDidUpdate () {
        if(this.state.isLoaded && this.state.csvCreation) {
            const fileData = this.state.csvCreation["csv_data"];

            const blob = new Blob([fileData], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.download = this.state.downloadedAssessment + ".csv";
            link.href = url;
            link.setAttribute('download', this.props.navbar.state.chosenCourse['course_name']+'.csv');
            link.click();

            var assessmentName = this.state.downloadedAssessment;

            const exportAssessmentTask = document.getElementById(this.state.exportButtonId[assessmentName])

            setTimeout(() => {
                if(exportAssessmentTask) {
                    exportAssessmentTask.removeAttribute("disabled");
                }
            }, 10000);

            this.setState({
                isLoaded: null,
                csvCreation: null
            });
        }
    }

    componentDidMount() {
        const courseId = this.props.navbar.state.chosenCourse.course_id;

        genericResourceGET(
            `/assessment_task?course_id=${courseId}`,
            "assessment_tasks",
            this,
            {dest: "assessmentTasks"}
        );

        genericResourceGET(
            `/completed_assessment?course_id=${courseId}&only_course=true`,
            "completed_assessments",
            this,
            {dest: "completedAssessments"}
        );

        const assessmentTasks = this.props.navbar.adminViewAssessmentTask.assessmentTasks;
        const initialLockStatus = {};
        const initialPublishedStatus = {};

        assessmentTasks.forEach((task) => {
            initialLockStatus[task.assessment_task_id] = task.locked;
            initialPublishedStatus[task.assessment_task_id] = task.published;
        });

        this.setState({ lockStatus: initialLockStatus, publishedStatus: initialPublishedStatus });
    }

    render() {
        if (this.state.assessmentTasks === null || this.state.completedAssessments === null) {
            return <Loading />;
        }
        const fixedTeams = this.props.navbar.state.chosenCourse["use_fixed_teams"];

        var navbar = this.props.navbar;
        var adminViewAssessmentTask = navbar.adminViewAssessmentTask;

        var roleNames = adminViewAssessmentTask.roleNames;
        var rubricNames = adminViewAssessmentTask.rubricNames;
        var assessmentTasks = adminViewAssessmentTask.assessmentTasks;

        let assessmentTasksToDueDates = {};

        for(let index = 0; index < assessmentTasks.length; index++) {
            assessmentTasksToDueDates[assessmentTasks[index]["assessment_task_id"]] = {
                "due_date": formatDueDate(assessmentTasks[index]["due_date"], assessmentTasks[index]["time_zone"]),
                "time_zone": assessmentTasks[index]["time_zone"]
            };
        }

        var assessmentTaskIdToAssessmentTaskName = {};

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
                    customBodyRender: (assessmentTaskName) => {
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
                    customBodyRender: (assessmentTaskId) => {
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
                    customBodyRender: (roleId) => {
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
                    customBodyRender: (rubricId) => {
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
                    customBodyRender: (unitOfAssessment) => {
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
                    customBodyRender: (atId) => {
                        const task = assessmentTasks.find((task) => task["assessment_task_id"] === atId);
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
                                {isPublished ? <UnpublishedIcon /> : <PublishIcon />}
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
                    customBodyRender: (atId) => {
                        const task = assessmentTasks.find((task) => task["assessment_task_id"] === atId);
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
                    customBodyRender: (assessmentTaskId) => {
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
                    customBodyRender: (assessmentTaskId) => {
                        if (assessmentTaskId && assessmentTasks) {
                            const selectedTask = assessmentTasks.find(task => task.assessment_task_id === assessmentTaskId);
                            const completedAssessments = this.state.completedAssessments.filter(ca => ca.assessment_task_id === assessmentTaskId);
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
                                                    setCompleteAssessmentTaskTabWithID(selectedTask);
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
                    customBodyRender: (atId) => {
                        const assessmentTask = assessmentTasks.find(task => task.assessment_task_id === atId);
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
                                            aria-label='startAssessmentTasksButton'
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
                    customBodyRender: (atId) => {
                        const completedAssessments = this.state.completedAssessments.filter(ca => ca.assessment_task_id === atId);
                        const completedCount = completedAssessments.length > 0 ? completedAssessments[0].completed_count : 0;

                        if (completedCount === 0) {
                            return (
                                <Tooltip title="No completed assessments to export">
                                    <span>
                                        <Button
                                            id={"assessment_export_" + atId}
                                            className='primary-color'
                                            variant='contained'
                                            disabled
                                            aria-label='exportAssessmentTaskButton'
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
