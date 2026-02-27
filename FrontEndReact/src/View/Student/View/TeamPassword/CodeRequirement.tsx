import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Box, TextField, Alert } from '@mui/material';
import CustomButton from '../Components/CustomButton';
import ErrorMessage from '../../../Error/ErrorMessage';
import { genericResourceGET } from '../../../../utility';
import Loading from '../../../Loading/Loading';

interface CodeRequirementProps {
	navbar: any;
}

interface CodeRequirementState {
	password: string;
	errorMessage: string | null;
	assessmentTasks: any | null;
	validationError: string | null;
}

class CodeRequirement extends Component<CodeRequirementProps, CodeRequirementState> {
	constructor(props: CodeRequirementProps) {
		super(props)
		this.state = {
			password: '',
			errorMessage: null,
			assessmentTasks: null,
			validationError: null
		};
	}

	submitPasscode = () => {
		const enteredPassword = this.state.password;
		const correctPassword = this.state.assessmentTasks["create_team_password"];
		this.setState({
			validationError: null
		});

		if (!enteredPassword || enteredPassword.trim() === '') {
			this.setState({
				validationError: "Please enter a password"
			});
			return;
		}

		if (enteredPassword !== correctPassword) {
			this.setState({
				validationError: "Incorrect password. Please contact your instructor if you need to switch teams."
			});
			return;
		}
		this.props.navbar.setState({
			teamSwitchPassword: enteredPassword
		});
		this.props.navbar.setNewTab("SelectTeam");
	}

	handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		this.setState({
			password: value,
			validationError: null // Clear error when user types
		});
	};

	handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			this.submitPasscode();
		}
	};

	componentDidMount() {
		let atId = this.props.navbar.state.chosenAssessmentTask["assessment_task_id"];

		genericResourceGET(
			`/assessment_task?assessment_task_id=${atId}`, 
			"assessment_tasks", this as any, {dest: "assessmentTasks"});
	}

	render() {
		const { errorMessage, validationError } = this.state;

		if (errorMessage) {
            return (
				<Box>
					{errorMessage &&
						<ErrorMessage errorMessage={errorMessage} />
					}
				</Box>
            );
		} else if (this.state.assessmentTasks === null) {
            return (
                <Loading />
            );
		}
		
		return (
			<Box>
				<div style={{ padding: '50px', backgroundColor: '#F8F8F8' }}>
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
						<div>
							<h2>Enter Password to Switch Teams</h2>
							<p style={{ marginBottom: '20px'}}>
								Your instructor has set a password for team switching. Please enter it below.
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
								value={this.state.password}
								onChange={this.handleChange}
								onKeyPress={this.handleKeyPress}
								fullWidth
								autoFocus
								sx={{ mb: 2 }}
								inputProps={{ maxLength: 20 }}
								aria-label="teamPasswordInput"
							/>

							<CustomButton
								label="Continue"
								onClick={this.submitPasscode}
								isOutlined={false} // Default button
								position={{ top: '10px', right: '0px' }}
								aria-label="continueWithPasswordButton"
							/>
						</div>
					</div>
				</div>
			</Box>
		)
	}
}

export default CodeRequirement;