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
import RubricDescriptionsImage2 from "../../../../../src/RubricDetailedOverview2.png";
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

        //Define max lengths for fields
        const maxLengths = {
            taskName: 50,
            timeZone: 5,
            password: 20,
        };

            // Check for validation
        let errorMessage = '';
        if (value.trim() === '') {
            errorMessage = `${id.charAt(0).toUpperCase() + id.slice(1)} cannot be empty`;
        } else if (maxLengths[id] && value.length > maxLengths[id]) {
            errorMessage = `${id.charAt(0).toUpperCase() + id.slice(1)} cannot exceed ${maxLengths[id]} characters`;
        }

        this.setState({
            [id]: value,
            errors: {
                ...this.state.errors,
                [id]: errorMessage,
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
                    taskName: taskName.trim() === '' ? 'Task Name cannot be empty' : taskName.length > 50 ? 'Task Name cannot exceed 50 characters' : '',
                    dueDate: dueDate === '' ? 'Due Date cannot be empty' : '',
                    timeZone: timeZone === '' ? 'Time Zone cannot be empty' : timeZone.length > 5 ? 'Time Zone cannot exceed 5 characters' : '',
                    roleId: roleId === '' ? 'Completed By cannot be empty' : '',
                    rubricId: rubricId === '' ? 'Rubric cannot be empty' : '',
                    notes: notes.trim() === '' ? 'Assessment Notes cannot be empty' : '',
                },
            });

        } else {

            // Add password length check here at the top of the else block
            if (password && password.length > 20) {
                this.setState({
                    errors: {
                        ...this.state.errors,
                        password: 'Password cannot exceed 20 characters',
                    },
                });
                return;
            }

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
                    this, body,
                    { rawResponse: true }
                );

            } else {
                promise = genericResourcePUT(
                    `/assessment_task?assessment_task_id=${assessmentTask["assessment_task_id"]}`,
                    this, body,
                    { rawResponse: true }
                );
            }

            promise.then(result => {
                if (result !== undefined && result.success === true) {
                    confirmCreateResource("AssessmentTask");

                    const assessmentTaskId = navbar.state.addAssessmentTask ? result?.["content"]?.["assessment_task"]?.[0]?.["assessment_task_id"] : assessmentTask["assessment_task_id"];

                    if(usingTeams && !chosenCourse.use_fixed_teams){
                        genericResourceGET(`/adhoc_amount?assessment_task_id=${assessmentTaskId}`,"teams",this).then(amountOfExistingAdhocs =>{
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
                                    assessment_task_id: assessmentTaskId,
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
                roleOptions = [...roleOptions, <FormControlLabel value={role} control={<Radio sx={{ color: 'var(--icon-color)' }} />} label={roleNames[role]} key={role} aria-label="addAssessmentRoleOption" />];
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
                                        sx={{ 
                                            mb: 2,
                                            '& .MuiOutlinedInput-root': {
                                                color: 'var(--text-color)',
                                                '& fieldset': {
                                                    borderColor: 'var(--border-color)',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: 'var(--border-hover-color)',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#2E8BEF',
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: errors.taskName ? 'var(--error-color)' : 'var(--text-color)',
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: errors.taskName ? 'var(--error-color)' : '#2E8BEF',
                                            },
                                            '& .MuiIconButton-root': {
                                                color: 'var(--icon-color)',
                                            },
                                        }}
   
                                        inputProps={{ maxLength: 50 }}
                                        aria-label="addAssessmentTaskName"
                                    />
                                    <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'row', gap: '10px', justifyContent: 'start' }}>
                                        <FormControl id="formSelectRubric" sx={{width: '38%', height: '100%'}} error={!!errors.rubricId} required>
                                            <InputLabel
                                            required
                                            id="rubricId"
                                            sx={{
                                                color: errors.rubricId ? 'var(--error-color)' : 'var(--text-color)',
                                                '&.Mui-focused': {
                                                    color: errors.rubricId ? 'var(--error-color)' : '#2E8BEF',
                                                },
                                             }}
                                            >
                                                Rubric
                                            </InputLabel>
                                            <Select
                                                id="rubricId"
                                                name="rubricID"
                                                value={rubricId}
                                                label="Rubric"
                                                error={!!errors.rubricId}
                                                onChange={(event) => this.handleSelect("rubricId", event)}
                                                required
                                                aria-label="addAssessmentRubricDropdown"
                                                sx={{
                                                    color: 'var(--text-color)',
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: 'var(--border-color)',
                                                    },
                                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: 'var(--border-hover-color)',
                                                    },
                                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: '#2E8BEF',
                                                    },
                                                    '& .MuiSvgIcon-root': {
                                                        color: 'var(--icon-color)',
                                                    },
                                                }}
                                            >
                                                {rubricOptions}
                                            </Select>
                                            <FormHelperText>{errors.rubricId}</FormHelperText>
                                        </FormControl>
                                        <div style={{padding: '3px'}}>
                                            <Tooltip title="Help">
                                                <IconButton aria-label="help" onClick={this.toggleHelp} sx={{ color: 'var(--icon-color)' }}>
                                                    <HelpOutlineIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                        <ImageModal 
                                            isOpen={isHelpOpen}
                                            handleClose={this.toggleHelp}
                                            imageUrl={RubricDescriptionsImage}
                                            imageUrl2={RubricDescriptionsImage2}
                                        />
                                    </div>
                                    <FormControl>
                                        <FormLabel id="demo-row-radio-buttons-group-label" sx={{ color: 'var(--text-color)' }}>Unit of Assessment</FormLabel>

                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            value={usingTeams}
                                            id="usingTeams"
                                            name="usingTeams"
                                            sx={{ mb: 2 }}
                                            onChange={this.handleTeams}
                                        >
                                            <FormControlLabel value={false} control={<Radio sx={{ color: 'var(--icon-color)' }} />} label="Individual Assessment" aria-label="addAssessmentInvididualAssessmentRadioOption"/>

                                            <FormControlLabel value={true} control={<Radio sx={{ color: 'var(--icon-color)' }} />} label="Team Assessment" aria-label="addAssessmentGroupAssessmentRadioOption" />
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
                                            sx={{ 
                                                mb: 2,
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: 'var(--border-color)',
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: 'var(--border-hover-color)',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: '#2E8BEF',
                                                    },
                                                },
                                                '& .MuiInputLabel-root': {
                                                    color: 'var(--text-color)',
                                                },
                                                '& .MuiInputLabel-root.Mui-focused': {
                                                    color: '#2E8BEF',
                                                },
                                            }}
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
                                            sx={{ 
                                                mb: 2,
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: 'var(--border-color)',
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: 'var(--border-hover-color)',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: '#2E8BEF',
                                                    },
                                                },
                                                '& .MuiInputLabel-root': {
                                                    color: 'var(--text-color)',
                                                },
                                                '& .MuiInputLabel-root.Mui-focused': {
                                                    color: '#2E8BEF',
                                                },
                                            }}
                                        
                                        />
                                    }

                                    <FormControl>
                                        <FormLabel id="demo-row-radio-buttons-group-label" sx={{ color: 'var(--text-color)' }}>Completed By</FormLabel>

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
                                                    sx={{ color: 'var(--icon-color)' }}
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
                                                    sx={{ color: 'var(--icon-color)' }}
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

                                                    sx={{
                                                        mb: errors.timeZone ? 2 : 0,
                                                        '& .MuiInputLabel-root': {
                                                            color: 'var(--text-color)',
                                                        },
                                                        '& .MuiInputLabel-root.Mui-focused': {
                                                            color: '#2E8BEF',
                                                        },
                                                        '& .MuiOutlinedInput-root': {
                                                            color: 'var(--text-color)',
                                                            '& fieldset': {
                                                                borderColor: 'var(--border-color)',
                                                            },
                                                            '&:hover fieldset': {
                                                                borderColor: 'var(--border-hover-color)',
                                                            },
                                                            '&.Mui-focused fieldset': {
                                                                borderColor: '#2E8BEF',
                                                            },
                                                        },
                                                        '& .MuiIconButton-root': {
                                                            color: 'var(--icon-color)',
                                                        },
                                                    }}
                                                />
                                            </LocalizationProvider>
                                        </div>

                                        <div style={{ position: "relative", marginTop: '16px'}}>
                                            <FormControl error={!!errors.timeZone} required fullWidth sx={{ mb: 2 }}> 
                                                <InputLabel className={errors.timeZone ? "errorSelect" : ""} required id="timeone" sx={{ color: 'var(--text-color)' }}>Time Zone</InputLabel>

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
                                                    sx={{
                                                        color: 'var(--text-color)',
                                                        '& .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: 'var(--border-color)',
                                                        },
                                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: 'var(--border-hover-color)',
                                                        },
                                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: '#2E8BEF',
                                                        },
                                                        '& .MuiSvgIcon-root': {
                                                            color: 'var(--icon-color)',
                                                        },
                                                    }}
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
                                        sx={{ 
                                            mb: 2,
                                            '& .MuiOutlinedInput-root': {
                                                color: 'var(--text-color)',
                                                '& fieldset': {
                                                    borderColor: 'var(--border-color)',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: 'var(--border-hover-color)',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#2E8BEF',
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                    color: errors.password ? 'var(--error-color)' : 'var(--text-color)',
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                    color: errors.password ? 'var(--error-color)' : '#2E8BEF',
                                            },
                                        }}
                                        inputProps={{ maxLength: 20 }}
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
                                        sx={{ 
                                            mb: 2,
                                            '& .MuiInputLabel-root': {
                                                color: errors.notes ? 'var(--error-color)' : 'var(--text-color)',
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: errors.notes ? 'var(--error-color)' : '#2E8BEF',
                                            },
                                            '& .MuiOutlinedInput-root': {
                                                color: 'var(--text-color)',
                                                '& fieldset': {
                                                    borderColor: 'var(--border-color)',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: 'var(--border-hover-color)',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#2E8BEF',
                                                },
                                            },
                                        }}
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
