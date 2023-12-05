import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../../../SBStyles.css';
import ErrorMessage from '../../../Error/ErrorMessage';
import { API_URL } from '../../../../App';
import { Box, Button, FormControl, Typography, TextField, FormControlLabel, Checkbox, MenuItem, Select, InputLabel, Radio, RadioGroup, FormLabel, FormGroup} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';

class AdminAddAssessmentTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorMessage: null,
            validMessage: '',
            editAssessmentTask: false,
            due_date: new Date(),
            taskName : '',
            timeZone: '',
            roleId: '',
            rubricId: '',
            password: '',
            notes: '',
            suggestions: true,
            ratings: true,
            usingTeams: true,

            errors: {
                taskName : '',
                timeZone: '',
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

        if(assessment_task && !addAssessmentTask) { 
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
                editAssessmentTask: true
            })

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

        handleSelect = (event) => {
            
            this.setState({
                timeZone: event.target.value,
            })
          };

        handleSelect2 = (event) => {
            
            this.setState({
                roleId: event.target.value,
            })
        };

        handleSelect3 = (event) => {
            
            this.setState({
                rubricId: event.target.value,
            })
        };

        handleSelect4 = (event) => {
            const test = event.target.value === 'true' ? true : false
            this.setState({
                usingTeams: test,
            })
        };

       
    
        handleSubmit = () => {
            const {
                taskName ,
                due_date,
                timeZone,
                roleId,
                rubricId,
                password,
                notes,
                suggestions,
                ratings,
                usingTeams,
            } = this.state;
            var navbar = this.props.navbar;
            var state = navbar.state;
            var confirmCreateResource = navbar.confirmCreateResource;
            var assessment_task = state.assessment_task;
            var chosenCourse = state.chosenCourse;
    
            // Your validation logic here
            if (taskName.trim() === '' || timeZone === '' || roleId === '' || rubricId === '' || password === ''
            || notes.trim() === '') {
                // Handle validation error
                console.error('Validation error: Fields cannot be empty');
                this.setState({
                    errors: {
                        taskName: taskName.trim() === '' ? 'Task Name cannot be empty' : '',
                        due_date: due_date === '' ? 'Due Date cannot be empty' : '',
                        timeZone: timeZone === '' ? 'Time Zone cannot be empty' : '',
                        roleId: roleId === '' ? 'Completed By cannot be empty' : '',
                        rubricId: rubricId === '' ? 'Term cannot be empty' : '',
                        password: password.trim() === '' ? 'Assessment Password cannot be empty' : '',
                        notes: notes.trim() === '' ? 'Assessment Notes cannot be empty' : '',
                    },
                });
            } 
            else {
                var url = API_URL;
                var method;
                if(taskName) {
                    url += "/assessment_task";
                    method = "POST";
                } else {
                    url += `/assessment_task/${assessment_task["assessment_task_id"]}`;
                    method = "PUT";
                }
                fetch(
                    ( url ),
                    {
                        method: method,
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            'assessment_task_name': taskName,
                            'course_id': chosenCourse["course_id"],
                            'rubric_id': rubricId,
                            'role_id': roleId,
                            'due_date': this.state.due_date,
                            'time_zone': timeZone,
                            'show_suggestions': suggestions,
                            'show_ratings': ratings,
                            'unit_of_assessment': usingTeams,
                            'create_team_password': password,
                            'comment': notes,
                        })
                    }
                )
                .then(res => res.json())
                .then(
                    (result) => {
                        if(result["success"] === false) {
                            this.setState({
                                errorMessage: result["message"]
                            })
                        }
                    },
                    (error) => {
                        this.setState({
                            error: error
                        })
                    }
                )
                confirmCreateResource("AssessmentTask");
            }
        };
    

    hasErrors = () => {
        const { errors } = this.state;
        return Object.values(errors).some((error) => !!error);
    };

    render() {
        var navbar = this.props.navbar;
        // var state = navbar.state;
        var adminViewAssessmentTask = navbar.adminViewAssessmentTask;
        var role_names = adminViewAssessmentTask.role_names;
        var rubric_names = adminViewAssessmentTask.rubric_names;
        var addAssessmentTask = adminViewAssessmentTask.addAssessmentTask;
        var confirmCreateResource = navbar.confirmCreateResource;
        var role_options = [];
        if(role_names) {
            for(var r = 4; r < 6; r++) {
                role_options = [...role_options, <FormControlLabel value={r} control={<Radio />} label={role_names[r]} key={r}/>];
            }
        }
        var rubric_options = [];
        if(rubric_names) {
            for(r = 1; r < 8; r++) {
                rubric_options = [...rubric_options, <MenuItem value={r} key={r}>{rubric_names[r]}</MenuItem>];
            }
        }
        const {
            error,
            errors,
            errorMessage,
            validMessage,
            due_date,
            taskName ,
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
            <React.Fragment>
                { error &&
                    <ErrorMessage
                        add={addAssessmentTask}
                        resource={"Assessment Task"}
                        errorMessage={error.message}
                    />
                }
                { errorMessage &&
                    <ErrorMessage
                        add={addAssessmentTask}
                        resource={"Assessment Task"}
                        errorMessage={errorMessage}
                    />
                }
                { validMessage!=="" &&
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
                                        fullWidth
                                        value={taskName}
                                        error={!!errors.taskName}
                                        helperText={errors.taskName}
                                        onChange={this.handleChange}
                                        required
                                        sx={{mb: 2}}
                                    />
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DemoContainer sx={{mb: 2}} 
                                            components={[
                                            'DateTimePicker',
                                            'MobileDateTimePicker',
                                            'DesktopDateTimePicker',
                                            'StaticDateTimePicker',
                                            ]}
                                        >
                                            <DemoItem > 
                                            <DateTimePicker label="Due Date" value={due_date} 
                                             views={['year', 'month', 'day', 'hours', 'minutes',]}
                                             ampm={false}
                                             onSelect={(date) => {
                                                this.setState({due_date: date});
                                            }}
                                            onChange={(date) => {
                                                this.setState({due_date: date});
                                            }}/>
                                            </DemoItem>
                                        </DemoContainer>
                                        </LocalizationProvider>
    
                                    <FormControl fullWidth>
                                        <InputLabel id="timeone">Time Zone</InputLabel>
                                        <Select
                                        labelId="timeone"
                                        id="timeZone"
                                        value={timeZone}
                                        label="Time Zone"
                                        error={!!errors.timeZone}
                                        helperText={errors.timeZone}
                                        onChange={this.handleSelect}
                                        required
                                        sx={{mb: 2}}
                                        >
                                        {timeZone? <MenuItem value={timeZone}>{timeZone}</MenuItem> : ''}
                                        <MenuItem value={"EST"}>EST</MenuItem>
                                        <MenuItem value={"CST"}>CST</MenuItem>
                                        <MenuItem value={"MST"}>MST</MenuItem>
                                        <MenuItem value={"PST"}>PST</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl>
                                    <FormLabel fullWidth id="demo-row-radio-buttons-group-label">Completed By</FormLabel>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            value={roleId}
                                            id="roleId" 
                                            name="roleID"
                                            sx={{mb: 2}}
                                            onChange={this.handleSelect2}
                                        >
                                            {role_options}
                                        </RadioGroup>
                                    </FormControl>

                                    <FormControl fullWidth>
                                        <InputLabel id="rubricId">Rubric</InputLabel>
                                        <Select
                                        id="rubricId" 
                                        name="rubricID"
                                        value={rubricId}
                                        label="Rubric"
                                        error={!!errors.rubricId}
                                        helperText={errors.rubricId}
                                        onChange={this.handleSelect3}
                                        required
                                        sx={{mb: 2}}
                                        >
                                        {rubric_options}
                                        </Select>
                                    </FormControl>
                                      <TextField
                                        id="password" 
                                        name="newPassword"
                                        variant='outlined'
                                        label="Password"
                                        fullWidth
                                        value={password}
                                        error={!!errors.password}
                                        helperText={errors.password}
                                        onChange={this.handleChange}
                                        required
                                        sx={{mb: 2}}
                                    />
                                    <TextField
                                        id="notes" 
                                        name="notes"
                                        variant='outlined'
                                        label="Assessment Task Notes"
                                        fullWidth
                                        value={notes}
                                        error={!!errors.notes}
                                        helperText={errors.notes}
                                        onChange={this.handleChange}
                                        required
                                        sx={{mb: 2}}
                                    />
                                    <FormGroup sx={{mb: 2}}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                onChange={(event) => {
                                                    this.setState({suggestions:event.target.checked});
                                                
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
                                                    this.setState({ratings:event.target.checked});
                                                
                                                }}
                                                id="ratings"
                                                value={ratings}
                                                checked={ratings}
                                            />
                                        }
                                        name="ratings"
                                        label="Use Tas"
                                    />
                                    </FormGroup>
                                     <FormControl>
                                    <FormLabel fullWidth id="demo-row-radio-buttons-group-label">Unit of Assessment</FormLabel>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            value={usingTeams}
                                            id="using_teams" 
                                            name="using_teams"
                                            sx={{mb: 2}}
                                            onChange={this.handleSelect4}
                                        >
                                            <FormControlLabel value={false} control={<Radio />} label="Individual Assessment"/>
                                            <FormControlLabel value={true} control={<Radio />} label="Group Assessment"/>
                                        </RadioGroup>
                                    </FormControl>
                                 

                                    <Box sx={{display:"flex", justifyContent:"flex-end", alignItems:"center", gap: "20px"}}>
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
                </React.Fragment>
        )
    }
}

export default AdminAddAssessmentTask;




