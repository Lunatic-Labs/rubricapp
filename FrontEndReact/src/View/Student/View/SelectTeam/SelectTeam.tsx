// @ts-expect-error TS(2307): Cannot find module 'react' or its corresponding ty... Remove this comment to see the full error message
import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import CustomButton from '../Components/CustomButton.js';
// @ts-expect-error TS(2307): Cannot find module '@mui/material' or its correspo... Remove this comment to see the full error message
import { FormControl, MenuItem, InputLabel, Select, Alert } from '@mui/material';
import { genericResourceGET, genericResourcePOST } from '../../../../utility.js';



class SelectTeam extends Component {
    checkInUser: any;
    handleSelect: any;
    props: any;
    setState: any;
    state: any;
    constructor(props: any) {
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
                this, 
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
                "teams", this);
        }
        else {
            // using Ad Hoc teams
            let navbar = this.props.navbar; 
            let atId = navbar.state.chosenAssessmentTask["assessment_task_id"];

            genericResourceGET(
                `/nonfull-adhoc?assessment_task_id=${atId}`,
                "teams", this
            )
        }
    }

    render() {
        var teams = this.state.teams;

        return (
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <div style={{ padding: '50px', backgroundColor: '#F8F8F8' }}>
                {teams &&
                    <>
                        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
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
                            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                            <h2 style={{ paddingTop: '16px', marginLeft: '-10px', bold: true }}> Choose a Team</h2>

                            {this.state.error && this.state.errorMessage && (
                                <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                                    {this.state.errorMessage}
                                </Alert>
                            )}

                            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                            <div className="d-flex flex-column">
                                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
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
                                            // @ts-expect-error TS(7006): Parameter 'x' implicitly has an 'any' type.
                                            {teams.map((x) =>
                                                <MenuItem key={x["team_id"]} value={x["team_id"]}>{x["team_name"]}</MenuItem>)
                                            }
                                        </Select>
                                    </FormControl>
                                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                                </div>
                            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                            </div>

                            <CustomButton
                                label="Check In"
                                onClick={this.checkInUser}
                                isOutlined={false} // Default button
                                position={{ top: '10px', right: '0px' }}
                                aria-label="checkInButton"
                            />
                        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                        </div>
                    </>
                }
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            </div>
        )
    }
}

export default SelectTeam;