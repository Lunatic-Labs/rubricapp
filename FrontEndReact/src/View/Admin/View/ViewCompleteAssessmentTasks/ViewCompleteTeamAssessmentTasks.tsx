import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "../../../../SBStyles.css";
import CustomDataTable from "../../../Components/CustomDataTable";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, Typography, Tooltip } from "@mui/material";
import CustomButton from "../../../Student/View/Components/CustomButton";
import { genericResourcePUT, genericResourcePOST, getHumanReadableDueDate } from "../../../../utility";
import ResponsiveNotification from "../../../Components/SendNotification";
import CourseInfo from "../../../Components/CourseInfo";
import { CompleteAssessmentTask } from '../../../../types/CompleteAssessmentTask';
import { GridColDef } from '@mui/x-data-grid';

interface ViewCompleteTeamAssessmentTasksProps {
    navbar: any;
    completedAssessment: CompleteAssessmentTask[];
}

interface ViewCompleteTeamAssessmentTasksState {
    errorMessage: string | null;
    isLoaded: boolean | null;
    showDialog: boolean;
    notes: string;
    notificationSent: Date | false;
    isSingleMsg: boolean;
    compATId: number | null;
    errors: {
        notes: string;
        [key: string]: string;
    };
}

class ViewCompleteTeamAssessmentTasks extends Component<
    ViewCompleteTeamAssessmentTasksProps,
    ViewCompleteTeamAssessmentTasksState
> {
    constructor(props: ViewCompleteTeamAssessmentTasksProps) {
        super(props);

        this.state = {
            errorMessage: null,
            isLoaded: null,
            showDialog: false,
            notes: "",
            notificationSent: false,
            isSingleMsg: false,
            compATId: null,
            errors: {
                notes: "",
            },
        };
    }

    handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;

        this.setState((prev) => {
            const next: any = { ...prev };

            if (id) {
                next[id] = value;
                next.errors = {
                    ...prev.errors,
                    [id]:
                        value.trim() === ""
                            ? `${id.charAt(0).toUpperCase() + id.slice(1)} cannot be empty`
                            : "",
                };
            }

            return next;
        });
    };

    handleDialog = (isSingleMessage: boolean, singleCompletedAT: number | null = null) => {
        this.setState((prev) => ({
            showDialog: !prev.showDialog,
            isSingleMsg: isSingleMessage,
            compATId: singleCompletedAT,
        }));
    };

    handleSendNotification = () => {
        const notes = this.state.notes;

        const navbar = this.props.navbar;
        const state = navbar?.state;

        const chosenAssessmentTask = state?.chosenAssessmentTask;

        const date = new Date();

        if (!notes || notes.trim() === "") {
            this.setState({
                errors: {
                    ...this.state.errors,
                    notes: "Notification Message cannot be empty",
                },
            });
            return;
        }

        // Individual team notification
        if (this.state.isSingleMsg) {
            this.setState({ isSingleMsg: false }, () => {
                genericResourcePOST(
                    `/send_single_email?team=${true}` +
                        `&completed_assessment_id=${this.state.compATId}` +
                        `&assessment_task_id=${chosenAssessmentTask?.["assessment_task_id"]}`,
                    this,
                    JSON.stringify({
                        notification_message: notes,
                        date: date,
                    })
                ).then((result: any) => {
                    if (result !== undefined && result.errorMessage === null) {
                        this.setState({
                            showDialog: false,
                            notificationSent: date,
                        });
                    }
                });
            });

            return;
        }

        // Mass notification to all teams
        genericResourcePUT(
            `/mass_notification?assessment_task_id=${chosenAssessmentTask?.["assessment_task_id"]}&team=${true}`,
            this,
            JSON.stringify({
                date: date,
                notification_message: notes,
            })
        ).then((result: any) => {
            if (result !== undefined && result.errorMessage === null) {
                this.setState({
                    showDialog: false,
                    notificationSent: date,
                });
            }
        });
    };

    render(): JSX.Element {
        const navbar = this.props.navbar;

        const completedAssessmentTasks = navbar?.adminViewCompleteAssessmentTasks?.completeAssessmentTasks;
        const userNames = navbar?.adminViewCompleteAssessmentTasks?.userNames;

        const state = navbar?.state;

        const chosenAssessmentTask = state?.chosenAssessmentTask;
        const notificationSent = state?.notificationSent;
        const chosenCourse = state?.chosenCourse;

        const columns: GridColDef[] = [
            {
                field: "assessment_task_id",
                headerName: "Assessment Task",
                flex: 1,
                renderCell: () => (
                    <Typography variant="body2" align="left">
                        {chosenAssessmentTask ? chosenAssessmentTask["assessment_task_name"] : "N/A"}
                    </Typography>
                ),
            },
            {
                field: "team_name",
                headerName: "Team Name",
                flex: 1,
                renderCell: (params) => (
                    <Typography variant="body2" align="left">
                        {params.value ? params.value : "N/A"}
                    </Typography>
                ),
            },
            {
                field: "completed_by",
                headerName: "Assessor",
                flex: 1,
                renderCell: (params) => (
                    <Typography variant="body2" align="left">
                        {userNames && params.value ? userNames[params.value] : "N/A"}
                    </Typography>
                ),
            },
            {
                field: "initial_time",
                headerName: "Initial Time",
                flex: 1,
                renderCell: (params) => {
                    const timeZone = chosenAssessmentTask ? chosenAssessmentTask.time_zone : "";
                    return (
                        <Typography variant="body2" align="left">
                            {getHumanReadableDueDate(params.value, timeZone)}
                        </Typography>
                    );
                },
            },
            {
                field: "last_update",
                headerName: "Last Updated",
                flex: 1,
                renderCell: (params) => {
                    const timeZone = chosenAssessmentTask ? chosenAssessmentTask.time_zone : "";
                    return (
                        <Typography variant="body2" align="left">
                            {getHumanReadableDueDate(params.value, timeZone)}
                        </Typography>
                    );
                },
            },
            {
                field: "completed_assessment_id",
                headerName: "See More Details",
                flex: 1,
                sortable: false,
                filterable: false,
                align: "center",
                headerAlign: "center",
                renderCell: (params) => {
                    const completedAssessmentId = params.value;
                    const teamId = params.row.team_id ?? null;

                    if (completedAssessmentId) {
                        return (
                            <IconButton
                                onClick={() => {
                                    navbar.setViewCompleteAssessmentTaskTabWithAssessmentTask(
                                        completedAssessmentTasks,
                                        completedAssessmentId,
                                        chosenAssessmentTask,
                                        teamId
                                    );
                                }}
                                aria-label="See more details"
                            >
                                <VisibilityIcon sx={{ color: "black" }} />
                            </IconButton>
                        );
                    }

                    return (
                        <Typography variant="body2" align="center">
                            N/A
                        </Typography>
                    );
                },
            },
            {
                field: "notify_action",
                headerName: "Notify",
                flex: 1,
                sortable: false,
                filterable: false,
                align: "center",
                headerAlign: "center",
                renderCell: (params) => {
                    const completedAssessmentId = params.row.completed_assessment_id ?? null;

                    if (completedAssessmentId !== null && completedAssessmentId !== undefined) {
                        return (
                            <Tooltip
                                title={<Typography variant="body2">Notify individual team.</Typography>}
                            >
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
                        );
                    }

                    return (
                        <Typography variant="body2" align="center">
                            {" "}
                        </Typography>
                    );
                },
            },
        ];

        return (
            <Box sx={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "20px" }}>
                <Box className="content-spacing">
                    <CourseInfo
                        courseTitle={chosenCourse?.["course_name"]}
                        courseNumber={chosenCourse?.["course_number"]}
                        aria-label={chosenCourse?.["course_name"]}
                    />
                </Box>

                <Box className="subcontent-spacing">
                    <Typography sx={{ fontWeight: "700" }} variant="h5" aria-label="viewCompletedTeamRubricsTitle">
                        Completed Rubrics
                    </Typography>

                    <Box>
                        <ResponsiveNotification
                            show={this.state.showDialog}
                            handleDialog={() => this.handleDialog(false, null)}
                            sendNotification={this.handleSendNotification}
                            handleChange={this.handleChange}
                            notes={this.state.notes}
                            error={this.state.errors}
                        />

                        <Tooltip title={<Typography variant="body2">Notifies all teams results are available.</Typography>}>
                            <span>
                                <CustomButton
                                    label="Send Notification"
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
                        getRowId={(row) => row.completed_assessment_id}
                        height="21rem"
                    />
                </Box>
            </Box>
        );
    }
}

export default ViewCompleteTeamAssessmentTasks;
