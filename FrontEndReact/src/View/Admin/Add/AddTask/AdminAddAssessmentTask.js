import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../../../SBStyles.css';
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ErrorMessage from '../../../Error/ErrorMessage.js';
import { genericResourceGET, genericResourcePOST, genericResourcePUT, getDueDateString } from '../../../../utility.js';
import { Box, Button, FormControl, Typography, IconButton, TextField, Tooltip, FormControlLabel, Checkbox, MenuItem, Select, InputLabel, Radio, RadioGroup, FormLabel, FormGroup } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
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
            numberOfTeams: '',
            maxTeamSize: '',
            suggestions: true,
            ratings: true,
            usingTeams: false,
            completedAssessments: null,
            isHelpOpen: false,

            errors: {
                taskName: '',
                timeZone: '',
                numberOfTeams: '',
                maxTeamSize: '',
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
            "completed_assessments", 
            this,
            { dest: "completedAssessments" }
        );

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
                numberOfTeams: assessmentTask["number_of_teams"],
                maxTeamSize: assessmentTask["max_team_size"]
            });
        }
    }

    handleChange = (e) => {
        const { id, value } = e.target;
        const regex = /^[1-9]\d*$/; // Positive digits
        const {usingTeams} = this.state;

        if (id === 'numberOfTeams' && usingTeams) {
            if (value !== '' && !regex.test(value)) {
                this.setState({
                    errors: {
                        ...this.state.errors,
                        [id]: 'Number of teams must be greater than zero',
                    }
                });
            return;
            }
        }

        if (id === 'maxTeamSize' && usingTeams) {
            if (value !== '' && !regex.test(value)) {
                this.setState({
                    errors: {
                        ...this.state.errors,
                        [id]: 'Number of members on a team must be greater than zero',
                    }
                });
                return;
            }
        }

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
            numberOfTeams,
            maxTeamSize
        } = this.state;

        var navbar = this.props.navbar;
        var state = navbar.state;
        var confirmCreateResource = navbar.confirmCreateResource;
        var assessmentTask = state.assessmentTask;
        var chosenCourse = state.chosenCourse;

        if (usingTeams && !chosenCourse["use_fixed_teams"]) {
            if (!numberOfTeams || !/^[1-9]\d*$/.test(numberOfTeams)) {
                this.setState({
                    errors: {
                        ...this.state.errors,
                        numberOfTeams: 'Number of teams must be greater than zero',
                    },
                });
                return;
            }
            
            if (!maxTeamSize || !/^[1-9]\d*$/.test(maxTeamSize)) {
                this.setState({
                    errors: {
                        ...this.state.errors,
                        maxTeamSize: 'Number of members on a team must be greater than zero'
                    }
                });
                return;
            }
        }
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
            const adhoc = this.props.navbar.state.chosenCourse.use_fixed_teams;
            const fixTeamData = (i) => this.state.usingTeams && !adhoc ? i : null;
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
                "number_of_teams": fixTeamData(numberOfTeams),
                "max_team_size": fixTeamData(maxTeamSize)
            });

            let promise;
            
            if (navbar.state.addAssessmentTask) {
                promise = genericResourcePOST(
                    "/assessment_task",
                    this, body
                );

            } else {
                promise = genericResourcePUT(
                    `/assessment_task?assessment_task_id=${assessmentTask["assessment_task_id"]}`,
                    this, body
                );
            }

            if(usingTeams && !chosenCourse.use_fixed_teams){
                genericResourceGET(`/adhoc_amount?course_id=${chosenCourse.course_id}`,"teams",this).then(amountOfExistingAdhocs =>{
                    if(amountOfExistingAdhocs.teams === undefined || amountOfExistingAdhocs.teams === null){
                        return;
                    }
                    amountOfExistingAdhocs = amountOfExistingAdhocs.teams;
                    
                    const date = new Date().getDate();
                    const month = new Date().getMonth() + 1;
                    const year = new Date().getFullYear();

                    for (let i=amountOfExistingAdhocs; i < numberOfTeams; ++i){
                        const body = JSON.stringify({
                            team_name: "Team "+ (i+1),
                            observer_id: chosenCourse.admin_id,
                            course_id: chosenCourse.course_id,
                            date_created: `${month}/${date}/${year}`,
                            active_until: null,
                        });
                        genericResourcePOST(`/team?course_id=${chosenCourse.course_id}`, this, body).catch(
                            error =>{
                                return;
                            });
                    }
                    }).catch(error => {
                        return;
                    });
            }

            promise.then(result => {
                if (result !== undefined && result.errorMessage === null) {
                    confirmCreateResource("AssessmentTask");
                }
            });
        }
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
                                <Typography id="addTaskTitle" variant="h5" aria-label={editAssessmentTask ? 'adminEditAssessmentTaskTitle' : 'adminAddAssessmentTaskTitle'}> {editAssessmentTask ? "Edit Assessment Task" : "Add Assessment Task"} </Typography>

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
                                            label="Maximum number of teams you will use during class for this assessment"
                                            value={this.state.numberOfTeams}
                                            error={!!errors.numberOfTeams}
                                            helperText={errors.numberOfTeams}
                                            onChange={this.handleChange}
                                            required
                                            type={"text"}
                                            inputProps={{ 
                                                pattern: "[1-9][0-9]*", 
                                                inputMode: "numeric"
                                            }}
                                            sx={{ mb: 2 }}
                                        />
                                    }

                                    {usingTeams && !chosenCourse["use_fixed_teams"] &&
                                        <TextField 
                                            id="maxTeamSize"
                                            name="setTeamSize"
                                            variant='outlined'
                                            label="Max team size allowed for each team in class"
                                            value={this.state.maxTeamSize}
                                            error={!!errors.maxTeamSize}
                                            helperText={errors.maxTeamSize}
                                            onChange={this.handleChange}
                                            required
                                            type={"text"}
                                            inputProps={{
                                                pattern: "[1-9][0-9]*",
                                                inputMode: "numeric"
                                            }}
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

                                                    <MenuItem value={"EDT"} aria-label="addAssessmentEdtRadioOption" >EDT</MenuItem>

                                                    <MenuItem value={"CST"} aria-label="addAssessmentCstRadioOption" >CST</MenuItem>

                                                    <MenuItem value={"CDT"} aria-label="addAssessmentCdtRadioOption" >CDT</MenuItem>

                                                    <MenuItem value={"MST"} aria-label="addAssessmentMstRadioOption" >MST</MenuItem>

                                                    <MenuItem value={"MDT"} aria-label="addAssessmentMdtRadioOption" >MDT</MenuItem>

                                                    <MenuItem value={"PST"} aria-label="addAssessmentPstRadioOption" >PST</MenuItem>

                                                    <MenuItem value={"PDT"} aria-label="addAssessmentPdtRadioOption" >PDT</MenuItem>
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
                                        label="Password to switch teams (Prevents students from switching teams without instructor approval.)"
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
                                        label="Instructions for Students/TA's about the Assessment or particular focus areas"
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
