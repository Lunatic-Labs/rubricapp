import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../../../SBStyles.css';
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ErrorMessage from '../../../Error/ErrorMessage.js';
import { genericResourceGET, genericResourcePOST, genericResourcePUT, getDueDateString } from '../../../../utility.js';
import { Box, Button, FormControl, Typography, IconButton, TextField, Tooltip, FormControlLabel, Checkbox, MenuItem, Select, InputLabel, Radio, RadioGroup, FormLabel, FormGroup } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ImageModal from "../AddCustomRubric/CustomRubricModal.js";
import RubricDescriptionsImage from "../../../../../src/RubricDetailedOverview.png";
import FormHelperText from '@mui/material/FormHelperText';



class AdminAddAssessmentTask extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMessage: null,
            validMessage: '',
            editAssessmentTask: false,
            dueDate: new Date(),
            taskName: '',
            timeZone: '',
            roleId: '4', // 4 = TA/Instructor
            rubricId: '',
            password: '',
            notes: '',
            numberOfTeams: null,
            suggestions: true,
            ratings: true,
            usingTeams: false,
            completedAssessments: null,
            isHelpOpen: false,

            errors: {
                taskName: '',
                timeZone: '',
                numberOfTeams: '',
                roleId: '',
                rubricId: '',
                password: '',
                notes: '',
            }
        };

        this.toggleHelp = () => {
            this.setState({
                isHelpOpen: !this.state.isHelpOpen,
            });
        };
    }

    componentDidUpdate() {
        var navbar = this.props.navbar;
        var state = navbar.state;
        var assessmentTask = state.assessmentTask;
        var addAssessmentTask = state.addAssessmentTask;

        if (assessmentTask && !addAssessmentTask && this.state.completedAssessments !== null && this.state.completedAssessments.length !== 0) {
            if (document.getElementById("formSelectRubric") !== null) {
                document.getElementById("formSelectRubric").remove();
            }
        }
    }

    componentDidMount() {
        var navbar = this.props.navbar;
        var state = navbar.state;
        var assessmentTask = state.assessmentTask;
        var addAssessmentTask = state.addAssessmentTask;

        if (assessmentTask && !addAssessmentTask) {
            genericResourceGET(
            `/completed_assessment?assessment_task_id=${assessmentTask["assessment_task_id"]}`, 
            "completedAssessments", this);

            this.setState({
                taskName: assessmentTask["assessment_task_name"],
                timeZone: assessmentTask["time_zone"],
                roleId: assessmentTask["role_id"],
                rubricId: assessmentTask["rubric_id"],
                password: assessmentTask["create_team_password"],
                notes: assessmentTask["comment"],
                suggestions: assessmentTask["show_suggestions"],
                ratings: assessmentTask["show_ratings"],
                usingTeams: assessmentTask["unit_of_assessment"],
                dueDate: new Date(assessmentTask["due_date"]),
                editAssessmentTask: true,
                numberOfTeams: assessmentTask["number_of_teams"]
            });
        }
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

    handleSelect = (key, event) => {
        this.setState({
            [key]: event.target.value
        });
    };

    handleTeams = (event) => {
        const unitOfAssessment = event.target.value === 'true' ? true : false;

        this.setState({
            usingTeams: unitOfAssessment,
        });
    };

    handleSubmit = () => {
        const {
            taskName,
            dueDate,
            timeZone,
            roleId,
            rubricId,
            password,
            notes,
            suggestions,
            ratings,
            usingTeams,
            numberOfTeams
        } = this.state;

        var navbar = this.props.navbar;
        var state = navbar.state;
        var confirmCreateResource = navbar.confirmCreateResource;
        var assessmentTask = state.assessmentTask;
        var chosenCourse = state.chosenCourse;

        if (taskName === '' || timeZone === '' || roleId === '' || rubricId === '' || notes === '') {
            this.setState({
                errors: {
                    taskName: taskName.trim() === '' ? 'Task Name cannot be empty' : '',
                    dueDate: dueDate === '' ? 'Due Date cannot be empty' : '',
                    timeZone: timeZone === '' ? 'Time Zone cannot be empty' : '',
                    roleId: roleId === '' ? 'Completed By cannot be empty' : '',
                    rubricId: rubricId === '' ? 'Rubric cannot be empty' : '',
                    notes: notes.trim() === '' ? 'Assessment Notes cannot be empty' : '',
                },
            });

        } else {
            var body = JSON.stringify({
                "assessment_task_name": taskName,
                "course_id": chosenCourse["course_id"],
                "rubric_id": rubricId,
                "role_id": roleId,
                "due_date": getDueDateString(dueDate),
                "time_zone": timeZone,
                "show_suggestions": suggestions,
                "show_ratings": ratings,
                "unit_of_assessment": usingTeams,
                "create_team_password": password,
                "comment": notes,
                "number_of_teams": numberOfTeams
            });
console.log("rubricapp/FrontEndReact/src/View/Admin/Add/AddTask/AdminAddAssessmentTask.js this.state: ", this.state);
            if (navbar.state.addAssessmentTask) {
                genericResourcePOST(
                    "/assessment_task",
                    this, body
                );

            } else {
                genericResourcePUT(
                    `/assessment_task?assessment_task_id=${assessmentTask["assessment_task_id"]}`,
                    this, body
                );
            }

            confirmCreateResource("AssessmentTask");
        }
    };

    hasErrors = () => {
        const { errors } = this.state;

        return Object.values(errors).some((error) => !!error);
    };

    render() {
        var navbar = this.props.navbar;
        var state = navbar.state;
        var chosenCourse = state.chosenCourse;
        var adminViewAssessmentTask = navbar.adminViewAssessmentTask;
        var roleNames = adminViewAssessmentTask.roleNames;
        var rubricNames = adminViewAssessmentTask.rubricNames;
        var addAssessmentTask = adminViewAssessmentTask.addAssessmentTask;
        const { isHelpOpen } = this.state;

        var roleOptions = [];

        Object.keys(roleNames).map((role) => {
            if (roleNames[role] === "TA/Instructor" || roleNames[role] === "Student") {
                roleOptions = [...roleOptions, <FormControlLabel value={role} control={<Radio />} label={roleNames[role]} key={role} aria-label="addAssessmentRoleOption" />];
            }

            return role;
        });

        var confirmCreateResource = navbar.confirmCreateResource;

        var rubricOptions = [];

        Object.keys(rubricNames).map((rubric) => {
            rubricOptions = [...rubricOptions, <MenuItem value={rubric} key={rubric} aria-label="addAssessmentRubricOption">{rubricNames[rubric]}</MenuItem>];

            return rubric;
        });

        const {
            errors,
            errorMessage,
            validMessage,
            dueDate,
            taskName,
            timeZone,
            roleId,
            rubricId,
            password,
            notes,
            suggestions,
            ratings,
            usingTeams,
            editAssessmentTask,
        } = this.state;

        return (
            <>
                {errorMessage &&
                    <ErrorMessage
                        add={addAssessmentTask}
                        resource={"Assessment Task"}
                        errorMessage={errorMessage}
                    />
                }

                {validMessage !== "" &&
                    <ErrorMessage
                        add={addAssessmentTask}
                        error={validMessage}
                    />
                }
                
                <Box className="card-spacing">
                    <Box className="form-position">
                        <Box className="card-style">
                            <FormControl className="form-spacing">
                                <Typography id="addTaskTitle" variant="h5" aria-label='adminAddAssessmentTaskTitle'> {editAssessmentTask ? "Edit Assessment Task" : "Add Assessment Task"} </Typography>

                                <Box className="form-input">
                                    <TextField
                                        id="taskName"
                                        name="newTaskName"
                                        variant='outlined'
                                        label="Task Name"
                                        value={taskName}
                                        error={!!errors.taskName}
                                        helperText={errors.taskName}
                                        onChange={this.handleChange}
                                        required
                                        sx={{ mb: 2 }}
                                        aria-label="addAssessmentTaskName"
                                    />
                                    <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'row', gap: '10px', justifyContent: 'start' }}>
                                        <FormControl id="formSelectRubric" sx={{width: '38%', height: '100%' }} error={!!errors.rubricId} required>
                                            <InputLabel required id="rubricId">Rubric</InputLabel>
                                            <Select
                                                id="rubricId"
                                                name="rubricID"
                                                value={rubricId}
                                                label="Rubric"
                                                error={!!errors.rubricId}
                                                onChange={(event) => this.handleSelect("rubricId", event)}
                                                required
                                                aria-label="addAssessmentRubricDropdown"
                                            >
                                                {rubricOptions}
                                            </Select>
                                            <FormHelperText>{errors.rubricId}</FormHelperText>
                                        </FormControl>
                                        <div style={{padding: '3px'}}>
                                            <Tooltip title="Help">
                                                <IconButton aria-label="help" onClick={this.toggleHelp}>
                                                    <HelpOutlineIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                        <ImageModal 
                                            isOpen={isHelpOpen}
                                            handleClose={this.toggleHelp}
                                            imageUrl={RubricDescriptionsImage}
                                        />
                                    </div>
                                    <FormControl>
                                        <FormLabel id="demo-row-radio-buttons-group-label">Unit of Assessment</FormLabel>

                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            value={usingTeams}
                                            id="usingTeams"
                                            name="usingTeams"
                                            sx={{ mb: 2 }}
                                            onChange={this.handleTeams}
                                        >
                                            <FormControlLabel value={false} control={<Radio />} label="Individual Assessment" aria-label="addAssessmentInvididualAssessmentRadioOption"/>

                                            <FormControlLabel value={true} control={<Radio />} label="Team Assessment" aria-label="addAssessmentGroupAssessmentRadioOption" />
                                        </RadioGroup>
                                    </FormControl>

                                    {usingTeams && !chosenCourse["use_fixed_teams"] &&
                                        <TextField
                                            id="numberOfTeams"
                                            name="newPassword"
                                            variant='outlined'
                                            label="Number of teams"
                                            error={!!errors.numberOfTeams}
                                            onChange={this.handleChange}
                                            required
                                            type={"number"}
                                            sx={{ mb: 2 }}
                                        />
                                    }

                                    <FormControl>
                                        <FormLabel id="demo-row-radio-buttons-group-label">Completed By</FormLabel>

                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            value={roleId}
                                            id="roleId"
                                            name="roleID"
                                            sx={{ mb: 2 }}
                                            onChange={(event) => this.handleSelect("roleId", event)}
                                        >
                                            {roleOptions}
                                        </RadioGroup>
                                    </FormControl>

                                    <FormGroup sx={{ mb: 2 }}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    onChange={(event) => {
                                                        this.setState({ suggestions: event.target.checked });
                                                    }}
                                                    id="suggestions"
                                                    value={suggestions}
                                                    checked={suggestions}
                                                />
                                            }
                                            name="suggestions"
                                            label="Show Suggestions for Improvement"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    onChange={(event) => {
                                                        this.setState({ ratings: event.target.checked });
                                                    }}
                                                    id="ratings"
                                                    value={ratings}
                                                    checked={ratings}
                                                />
                                            }
                                            name="ratings"
                                            label="Show Ratings"
                                        />
                                    </FormGroup>

                                    {/* NOTE: The due date and time are in the time zone of the course are here */}
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <div style={{ position: "relative", marginRight: '10px' }}>
                                            <LocalizationProvider sx={{ width: '38%' }} dateAdapter={AdapterDateFns}>
                                                <DateTimePicker label="Due Date" value={dueDate}
                                                    views={['year', 'month', 'day', 'hours', 'minutes']}

                                                    ampm={true}

                                                    onChange={(date) => {
                                                        this.setState({ dueDate: date });
                                                    }}

                                                    sx={{ mb: errors.timeZone ? 2 : 0 }}
                                                />
                                            </LocalizationProvider>
                                        </div>

                                        <div style={{ position: "relative", marginTop: '16px'}}>
                                            <FormControl error={!!errors.timeZone} required fullWidth sx={{ mb: 2 }}> 
                                                <InputLabel className={errors.timeZone ? "errorSelect" : ""} required id="timeone">Time Zone</InputLabel>

                                                <Select
                                                    labelId="timeone"
                                                    id="timeZone"
                                                    value={timeZone}
                                                    label="Time Zone"
                                                    error={!!errors.timeZone}

                                                    onChange={(event) => {
                                                        this.handleSelect("timeZone", event);
                                                    }}

                                                    required
                                                    style={{width: "200px"}}
                                                    aria-label="addAssessmentTimezoneDropdown"
                                                >
                                                    {timeZone ? <MenuItem value={timeZone}>{timeZone}</MenuItem> : ''}

                                                    <MenuItem value={"EST"} aria-label="addAssessmentEstRadioOption" >EST</MenuItem>

                                                    <MenuItem value={"CST"} aria-label="addAssessmentCstRadioOption" >CST</MenuItem>

                                                    <MenuItem value={"MST"} aria-label="addAssessmentMstRadioOption" >MST</MenuItem>

                                                    <MenuItem value={"PST"} aria-label="addAssessmentPstRadioOption" >PST</MenuItem>
                                                </Select>
                                                <FormHelperText>{errors.timeZone}</FormHelperText>
                                            </FormControl>
                                        </div>
                                    </div>
                                    
                                    {usingTeams &&
                                    
                                    <TextField
                                        id="password"
                                        name="newPassword"
                                        variant='outlined'
                                        label="Password to switch teams"
                                        value={password}
                                        error={!!errors.password}
                                        helperText={errors.password}
                                        onChange={this.handleChange}
                                        sx={{ mb: 2 }}
                                        aria-label="addAssessmentTeamPassword"
                                    />

                                    }

                                    <TextField
                                        id="notes"
                                        name="notes"
                                        variant='outlined'
                                        label="Instructions to Students/TA's"
                                        value={notes}
                                        error={!!errors.notes}
                                        helperText={errors.notes}
                                        onChange={this.handleChange}
                                        required
                                        multiline
                                        minRows={2}
                                        maxRows={8}
                                        sx={{ mb: 2 }}
                                        aria-label="addAssessmentNotes"
                                    />

                                    <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "20px" }}>
                                        <Button onClick={() => { confirmCreateResource("AssessmentTask"); }} aria-label="adminAddAssessmentCancelButton">
                                            Cancel
                                        </Button>

                                        <Button
                                            id="createAssessmentTask"
                                            className="primary-color"
                                            variant="contained"
                                            onClick={this.handleSubmit}
                                            aria-label="addAssessmentCreateOrUpdateButton"
                                        >
                                            {editAssessmentTask ? "Update Task" : "Create Task"}
                                        </Button>
                                    </Box>
                                </Box>
                            </FormControl>
                        </Box>
                    </Box>
                </Box>
            </>
        )
    }
}

export default AdminAddAssessmentTask;
