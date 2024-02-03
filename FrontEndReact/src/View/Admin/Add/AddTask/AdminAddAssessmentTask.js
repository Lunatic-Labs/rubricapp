import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../../../SBStyles.css';
import ErrorMessage from '../../../Error/ErrorMessage.js';
import { genericResourcePOST, genericResourcePUT } from '../../../../utility.js';
import { Box, Button, FormControl, Typography, TextField, FormControlLabel, Checkbox, MenuItem, Select, InputLabel, Radio, RadioGroup, FormLabel, FormGroup } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

class AdminAddAssessmentTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: null,
            validMessage: '',
            editAssessmentTask: false,
            due_date: new Date(),
            taskName: '',
            timeZone: '',
            roleId: '',
            rubricId: '',
            password: '',
            notes: '',
            numberOfTeams: null,
            suggestions: true,
            ratings: true,
            usingTeams: true,

            errors: {
                taskName: '',
                timeZone: '',
                numberOfTeams: '',
                roleId: '',
                rubricId: '',
                password: '',
                notes: '',
            }
        }
    }

    componentDidMount() {
        var navbar = this.props.navbar;
        var state = navbar.state;
        var assessment_task = state.assessment_task;
        var addAssessmentTask = state.addAssessmentTask;

        if (assessment_task && !addAssessmentTask) {
            const {
                assessment_task_name,
                time_zone,
                role_id,
                rubric_id,
                create_team_password,
                comment,
                show_suggestions,
                show_ratings,
                unit_of_assessment,
                number_of_teams
            } = assessment_task;

            this.setState({
                taskName: assessment_task_name,
                timeZone: time_zone,
                roleId: role_id,
                rubricId: rubric_id,
                password: create_team_password,
                notes: comment,
                suggestions: show_suggestions,
                ratings: show_ratings,
                usingTeams: unit_of_assessment,
                due_date: new Date(assessment_task["due_date"]),
                editAssessmentTask: true,
                numberOfTeams: number_of_teams
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
            [key]: event.target.value,
        });
    };

    handleTeams = (event) => {
        const test = event.target.value === 'true' ? true : false;

        this.setState({
            usingTeams: test,
        });
    };

    handleSubmit = () => {
        const {
            taskName,
            due_date,
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
        var assessment_task = state.assessment_task;
        var chosenCourse = state.chosenCourse;

        if (taskName === '' || timeZone === '' || roleId === '' || rubricId === ''
            || notes === '') {

            this.setState({
                errors: {
                    taskName: taskName.trim() === '' ? 'Task Name cannot be empty' : '',
                    due_date: due_date === '' ? 'Due Date cannot be empty' : '',
                    timeZone: timeZone === '' ? 'Time Zone cannot be empty' : '',
                    roleId: roleId === '' ? 'Completed By cannot be empty' : '',
                    rubricId: rubricId === '' ? 'Term cannot be empty' : '',
                    notes: notes.trim() === '' ? 'Assessment Notes cannot be empty' : '',
                },
            });
        }
        else {
            var body = JSON.stringify({
                "assessment_task_name": taskName,
                "course_id": chosenCourse["course_id"],
                "rubric_id": rubricId,
                "role_id": roleId,
                "due_date": due_date,
                "time_zone": timeZone,
                "show_suggestions": suggestions,
                "show_ratings": ratings,
                "unit_of_assessment": usingTeams,
                "create_team_password": password,
                "comment": notes,
                "number_of_teams": numberOfTeams
            });

            if (navbar.state.addAssessmentTask) {
                genericResourcePOST(
                    "/assessment_task",
                    this, body
                );
            } else {
                genericResourcePUT(
                    `/assessment_task?assessment_task_id=${assessment_task["assessment_task_id"]}`,
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
        var role_names = adminViewAssessmentTask.role_names;
        var rubric_names = adminViewAssessmentTask.rubric_names;
        var addAssessmentTask = adminViewAssessmentTask.addAssessmentTask;

        var role_options = [];

        Object.keys(role_names).map((role) => {
            if (role_names[role] === "TA/Instructor" || role_names[role] === "Student") {
                role_options = [...role_options, <FormControlLabel value={role} control={<Radio />} label={role_names[role]} key={role} />];
            }
            return role;
        });

        var confirmCreateResource = navbar.confirmCreateResource;

        var rubric_options = [];

        Object.keys(rubric_names).map((rubric) => {
            rubric_options = [...rubric_options, <MenuItem value={rubric} key={rubric}>{rubric_names[rubric]}</MenuItem>];
            return rubric;
        });

        const {
            errors,
            errorMessage,
            validMessage,
            due_date,
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
                                <Typography id="addTaskTitle" variant="h5"> {editAssessmentTask ? "Edit Assessment Task" : "Add Assessment Task"} </Typography>

                                <Box className="form-input">
                                    <TextField
                                        id="taskName"
                                        name="newTaskName"
                                        variant='outlined'
                                        label="Task Name"
                                        value={taskName}
                                        error={!!errors.taskName}
                                        onChange={this.handleChange}
                                        required
                                        sx={{ mb: 2 }}
                                    />

                                    <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'row', gap: '20px', justifyContent: 'start' }}>
                                        <FormControl sx={{width: '38%', height: '100%' }}>
                                            <InputLabel id="rubricId">Rubric</InputLabel>

                                            <Select
                                                id="rubricId"
                                                name="rubricID"
                                                value={rubricId}
                                                label="Rubric"
                                                error={!!errors.rubricId}
                                                onChange={(event) => this.handleSelect("rubricId", event)}
                                                required
                                            >
                                                {rubric_options}
                                            </Select>
                                        </FormControl>
                                    </div>

                                    <FormControl>
                                        <FormLabel id="demo-row-radio-buttons-group-label">Unit of Assessment</FormLabel>

                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            value={usingTeams}
                                            id="using_teams"
                                            name="using_teams"
                                            sx={{ mb: 2 }}
                                            onChange={this.handleTeams}
                                        >
                                            <FormControlLabel value={false} control={<Radio />} label="Individual Assessment" />

                                            <FormControlLabel value={true} control={<Radio />} label="Group Assessment" />
                                        </RadioGroup>
                                    </FormControl>

                                    {usingTeams && !chosenCourse.use_fixed_teams &&
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
                                            {role_options}
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

                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <div style={{ position: "relative", marginRight: '10px' }}>
                                            <LocalizationProvider sx={{ width: '38%' }} dateAdapter={AdapterDateFns}>
                                                <DateTimePicker label="Due Date" value={due_date}
                                                    views={['year', 'month', 'day', 'hours', 'minutes',]}
                                                    ampm={false}
                                                    onSelect={(date) => {
                                                        this.setState({ due_date: date });
                                                    }}
                                                    onChange={(date) => {
                                                        this.setState({ due_date: date });
                                                    }}
                                                />
                                            </LocalizationProvider>
                                        </div>

                                        <div style={{ position: "relative", marginTop: '16px' }}>
                                            <FormControl>
                                                <InputLabel id="timeone">Time Zone</InputLabel>

                                                <Select
                                                    labelId="timeone"
                                                    id="timeZone"
                                                    value={timeZone}
                                                    label="Time Zone"
                                                    error={!!errors.timeZone}
                                                    onChange={(event) => this.handleSelect("timeZone", event)}
                                                    required
                                                    sx={{ mb: 2 }}
                                                    style={{width: "200px"}}
                                                >
                                                    {timeZone ? <MenuItem value={timeZone}>{timeZone}</MenuItem> : ''}

                                                    <MenuItem value={"EST"}>EST</MenuItem>
                                                    <MenuItem value={"CST"}>CST</MenuItem>
                                                    <MenuItem value={"MST"}>MST</MenuItem>
                                                    <MenuItem value={"PST"}>PST</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </div>
                                    </div>

                                    <TextField
                                        id="password"
                                        name="newPassword"
                                        variant='outlined'
                                        label="Password to switch teams"
                                        value={password}
                                        error={!!errors.password}
                                        onChange={this.handleChange}
                                        sx={{ mb: 2 }}
                                    />

                                    <TextField
                                        id="notes"
                                        name="notes"
                                        variant='outlined'
                                        label="Instructions to Students/TA's"
                                        value={notes}
                                        error={!!errors.notes}
                                        onChange={this.handleChange}
                                        required
                                        multiline
                                        minRows={2}
                                        maxRows={8}
                                        sx={{ mb: 2 }}
                                    />

                                    <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "20px" }}>
                                        <Button onClick={() => {
                                            confirmCreateResource("AssessmentTask")
                                        }}
                                            id="" className="">
                                            Cancel
                                        </Button>

                                        <Button onClick={this.handleSubmit} id="createAssessmentTask" className="primary-color"
                                            variant="contained"
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