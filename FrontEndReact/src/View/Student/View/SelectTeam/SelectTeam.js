import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import CustomButton from '../Components/CustomButton.js';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Grid, IconButton, Button } from '@mui/material';
import CustomDataTable from '../../../Components/CustomDataTable.js';
import { FormControl, MenuItem, InputLabel, Select } from '@mui/material';
import { genericResourceGET, genericResourcePOST } from '../../../../utility.js';

class SelectTeam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            teams: null,
            teamID: null
        };

        this.handleSelect = (event) => {
            this.setState({
                teamID: event.target.value,
            })
        };

        this.checkInUser = () => {
            var navbar = this.props.navbar; 
	        var at_id = navbar.state.chosen_assessment_task.assessment_task_id;

	        genericResourcePOST(`/checkin?assessment_task_id=${at_id}&team_id=${this.state.teamID}`);
            navbar.setNewTab("StudentDashboard");
        }
    };

    componentDidMount() {
        let course = this.props.navbar.state.chosenCourse; 
        
        if (course.use_fixed_teams) {
            let courseID = this.props.navbar.state.chosenCourse.course_id;
            genericResourceGET(`/team?course_id=${courseID}`, "teams", this);
        }
        else {
            let teams = [];
            let numTeams = this.props.navbar.state.chosen_assessment_task.number_of_teams;
            for(let i = 1; i <= numTeams; i++)
            {
                teams.push({team_id: i, team_name: `Team ${i}`});
            }
            this.setState({
                teams: teams
            });
        }
    }

    render() {
        var teams = this.state.teams;
        return (
            <div style={{ padding: '50px', backgroundColor: '#F8F8F8' }}>
                <h1>Select a team</h1>
                {teams &&
                    <>
                        <div className="d-flex flex-column">
                            <div className="d-flex flex-row justify-content-between">
                                <div className="w-50 p-2 justify-content-between">
                                    <FormControl fullWidth>
                                        <InputLabel id="Team">Team</InputLabel>
                                        <Select
                                            labelId="Team"
                                            id="observer"
                                            value={this.state.teamID}
                                            label="Team"
                                            onChange={this.handleSelect}
                                            required
                                            sx={{ mb: 3 }}
                                        >
                                            {teams.map((x) =>
                                                <MenuItem value={x.team_id}>{x.team_name}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>
                        </div>

                        <CustomButton
                            label="Check In"
                            onClick={this.checkInUser}
                            isOutlined={false} // Default button
                            position={{ top: '10px', right: '0px' }} 
                        />
                    </>
                }
            </div>

        )
    }
}

export default SelectTeam;