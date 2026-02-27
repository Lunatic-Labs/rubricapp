import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import CustomButton from '../Components/CustomButton';
import { FormControl, MenuItem, InputLabel, Select, Alert } from '@mui/material';
import { genericResourceGET, genericResourcePOST } from '../../../../utility';

interface SelectTeamProps {
    navbar: any;
}

interface SelectTeamState {
    teams: any[] | null;
    teamID: string;
    error: boolean;
    errorMessage: string;
}

class SelectTeam extends Component<SelectTeamProps, SelectTeamState> {
    checkInUser: any;
    handleSelect: any;
    constructor(props: SelectTeamProps) {
        super(props);

        this.state = {
            teams: null,
            teamID: "",
            error: false,
            errorMessage: ""
        };

        this.handleSelect = (event: any) => {
            this.setState({
                teamID: event.target.value,
                error: false,
                errorMessage: ""
            })
        };

        this.checkInUser = () => {
            var navbar = this.props.navbar; 
	        var atId = navbar.state.chosenAssessmentTask["assessment_task_id"];

            if (this.state.teamID === '') {
                this.setState({
                    error: true,
                    errorMessage: "Please select a team"
                });
                return;
            }

            const password = navbar.state.teamSwitchPassword || "";
            const requestBody = password ? JSON.stringify({ password: password }) : JSON.stringify({});

	        genericResourcePOST(
                `/checkin?assessment_task_id=${atId}&team_id=${this.state.teamID}`, 
                this as any, 
                requestBody
            ).then((result) => {
                if (result !== undefined && result.errorMessage === null) {
                    navbar.setState({ teamSwitchPassword: null });
                    navbar.setNewTab("StudentDashboard");
                } else if (result && result.errorMessage) {
                    this.setState({
                        error: true,
                        errorMessage: result.errorMessage
                    });
                }
            }).catch((error) => {
                this.setState({
                    error: true,
                    errorMessage: "An error occurred while checking in. Please try again."
                });
            });
        };
    }

    componentDidMount() {
        let course = this.props.navbar.state.chosenCourse;
        
        if (course["use_fixed_teams"]) {
            let courseID = course["course_id"];
            genericResourceGET(
                `/team?course_id=${courseID}`, 
                "teams", this as any);
        }
        else {
            // using Ad Hoc teams
            let navbar = this.props.navbar; 
            let atId = navbar.state.chosenAssessmentTask["assessment_task_id"];

            genericResourceGET(
                `/nonfull-adhoc?assessment_task_id=${atId}`,
                "teams", this as any
            )
        }
    }

    render() {
        var teams = this.state.teams;

        return (
            <div style={{ padding: '50px', backgroundColor: '#F8F8F8' }}>
                {teams &&
                    <>
                        <div className='container'
                            style={{
                                backgroundColor: '#FFF',
                                border: '3px, 0px, 0px, 0px',
                                borderTop: '3px solid #4A89E8',
                                borderRadius: '10px',
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                width: '100%',
                                height: '100%',
                                marginTop: '40px',
                                padding: '24px',
                                paddingBottom: '20px',
                                gap: 20,
                            }}>
                            <h2 style={{ paddingTop: '16px', marginLeft: '-10px', fontWeight: 'bold' }}> Choose a Team</h2>

                            {this.state.error && this.state.errorMessage && (
                                <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                                    {this.state.errorMessage}
                                </Alert>
                            )}
                            <div className="d-flex flex-column">
                                <div className="d-flex flex-row justify-content-between">
                                    <FormControl fullWidth error={this.state.error && !this.state.errorMessage}>
                                        <InputLabel id="Team">Team</InputLabel>

                                        <Select
                                            labelId="Team"
                                            id="observer"
                                            value={this.state.teamID}
                                            label="Team"
                                            onChange={this.handleSelect}
                                            required
                                            sx={{ mb: 3 }}
                                            aria-label="selectTeamDropdown"
                                        >
                                            {teams.map((x: any) =>
                                                <MenuItem key={x["team_id"]} value={x["team_id"]}>{x["team_name"]}</MenuItem>)
                                            }
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>

                            <CustomButton
                                label="Check In"
                                onClick={this.checkInUser}
                                isOutlined={false} // Default button
                                position={{ top: '10px', right: '0px' }}
                                aria-label="checkInButton"
                            />
                        </div>
                    </>
                }
            </div>
        )
    }
}

export default SelectTeam;