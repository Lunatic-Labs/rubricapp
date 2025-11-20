// @ts-expect-error TS(2307): Cannot find module 'react' or its corresponding ty... Remove this comment to see the full error message
import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
// @ts-expect-error TS(2307): Cannot find module '@mui/material' or its correspo... Remove this comment to see the full error message
import { Box, TextField, Alert } from '@mui/material';
import CustomButton from '../Components/CustomButton.js';
import ErrorMessage from '../../../Error/ErrorMessage.js';
import { genericResourceGET } from '../../../../utility.js';
import Loading from '../../../Loading/Loading.js';

class CodeRequirement extends Component {
// @ts-expect-error TS(7006): Parameter 'props' implicitly has an 'any' type.
	constructor(props) {
		super(props)

// @ts-expect-error TS(2339): Property 'state' does not exist on type 'CodeRequi... Remove this comment to see the full error message
		this.state = {
			password: '',
			errorMessage: null,
			assessmentTasks: null,
			validationError: null
		};

// @ts-expect-error TS(2339): Property 'submitPasscode' does not exist on type '... Remove this comment to see the full error message
		this.submitPasscode = () => {
// @ts-expect-error TS(2339): Property 'state' does not exist on type 'CodeRequi... Remove this comment to see the full error message
			const enteredPassword = this.state.password;
// @ts-expect-error TS(2339): Property 'state' does not exist on type 'CodeRequi... Remove this comment to see the full error message
			const correctPassword = this.state.assessmentTasks["create_team_password"];

// @ts-expect-error TS(2339): Property 'setState' does not exist on type 'CodeRe... Remove this comment to see the full error message
			this.setState({
				validationError: null
			});

			if (!enteredPassword || enteredPassword.trim() === '') {
// @ts-expect-error TS(2339): Property 'setState' does not exist on type 'CodeRe... Remove this comment to see the full error message
				this.setState({
					validationError: "Please enter a password"
				});
				return;
			}

			if (enteredPassword !== correctPassword) {
// @ts-expect-error TS(2339): Property 'setState' does not exist on type 'CodeRe... Remove this comment to see the full error message
				this.setState({
					validationError: "Incorrect password. Please contact your instructor if you need to switch teams."
				});
				return;
			}

// @ts-expect-error TS(2339): Property 'props' does not exist on type 'CodeRequi... Remove this comment to see the full error message
			this.props.navbar.setState({
				teamSwitchPassword: enteredPassword
			});

// @ts-expect-error TS(2339): Property 'props' does not exist on type 'CodeRequi... Remove this comment to see the full error message
			this.props.navbar.setNewTab("SelectTeam");
		}

// @ts-expect-error TS(2339): Property 'handleChange' does not exist on type 'Co... Remove this comment to see the full error message
		this.handleChange = (e) => {
			const { value } = e.target;

// @ts-expect-error TS(2339): Property 'setState' does not exist on type 'CodeRe... Remove this comment to see the full error message
			this.setState({
				password: value,
				validationError: null // Clear error when user types
			});
        };

// @ts-expect-error TS(2339): Property 'handleKeyPress' does not exist on type '... Remove this comment to see the full error message
		this.handleKeyPress = (e) => {
			if (e.key === 'Enter') {
// @ts-expect-error TS(2339): Property 'submitPasscode' does not exist on type '... Remove this comment to see the full error message
				this.submitPasscode();
			}
		};
	}

	componentDidMount() {
// @ts-expect-error TS(2339): Property 'props' does not exist on type 'CodeRequi... Remove this comment to see the full error message
		let atId = this.props.navbar.state.chosenAssessmentTask["assessment_task_id"];

		genericResourceGET(
			`/assessment_task?assessment_task_id=${atId}`, 
			"assessment_tasks", this, {dest: "assessmentTasks"});
	}

	render() {
// @ts-expect-error TS(2339): Property 'state' does not exist on type 'CodeRequi... Remove this comment to see the full error message
		const { errorMessage, validationError } = this.state;

		if (errorMessage) {
            return (
// @ts-expect-error TS(2307): Cannot find module 'react/jsx-runtime' or its corr... Remove this comment to see the full error message
				<Box>
					{errorMessage &&
						<ErrorMessage errorMessage={errorMessage} />
					}
				</Box>
            );

// @ts-expect-error TS(2339): Property 'state' does not exist on type 'CodeRequi... Remove this comment to see the full error message
		} else if (this.state.assessmentTasks === null) {
            return (
                <Loading />
            );
		}
		
		return (
			<Box>
// @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
				<div style={{ padding: '50px', backgroundColor: '#F8F8F8' }}>
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
						<div>
// @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
							<h2>Enter Password to Switch Teams</h2>
// @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
							<p style={{ marginBottom: '20px'}}>
								Your instructor has set a password for team switching. Please enter it below.
// @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
							</p>

							{validationError && (
								<Alert severity="error" sx={{ mb: 2 }}>
									{validationError}
								</Alert>
							)}

							<TextField
								id="password"
								name="password"
								variant='outlined'
								label="Team Password"
								type="password"
// @ts-expect-error TS(2339): Property 'state' does not exist on type 'CodeRequi... Remove this comment to see the full error message
								value={this.state.password}
// @ts-expect-error TS(2339): Property 'handleChange' does not exist on type 'Co... Remove this comment to see the full error message
								onChange={this.handleChange}
// @ts-expect-error TS(2339): Property 'handleKeyPress' does not exist on type '... Remove this comment to see the full error message
								onKeyPress={this.handleKeyPress}
								fullWidth
								autoFocus
								sx={{ mb: 2 }}
								inputProps={{ maxLength: 20 }}
								aria-label="teamPasswordInput"
							/>

							<CustomButton
								label="Continue"
// @ts-expect-error TS(2339): Property 'submitPasscode' does not exist on type '... Remove this comment to see the full error message
								onClick={this.submitPasscode}
								isOutlined={false} // Default button
								position={{ top: '10px', right: '0px' }}
								aria-label="continueWithPasswordButton"
							/>
// @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
						</div>
// @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
					</div>
// @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
				</div>
			</Box>
		)
	}
}

export default CodeRequirement;