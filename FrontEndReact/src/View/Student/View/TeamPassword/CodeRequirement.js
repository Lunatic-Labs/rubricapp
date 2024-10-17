import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Box, TextField } from '@mui/material';
import CustomButton from '../Components/CustomButton.js';
import ErrorMessage from '../../../Error/ErrorMessage.js';
import { genericResourceGET } from '../../../../utility.js';



class CodeRequirement extends Component {
	constructor(props) {
		super(props)

		this.state = {
			password: null,
			errorMessage: null,
			assessmentTasks: null
		};

		this.submitPasscode = () => {
			let pass = this.state.password
			let correctPass = this.state.assessmentTasks["create_team_password"];

			this.setState({
				password: pass
			});

			if (pass === correctPass) {
				this.props.navbar.setNewTab("SelectTeam")

			} else {
				this.setState({
					errorMessage: "Incorrect passcode"
				});
			}
		}

		this.handleChange = (e) => {
			const { value } = e.target;

			this.setState({
				password: value
			});
        };

	}

	componentDidMount() {
		let atId = this.props.navbar.state.chosenAssessmentTask["assessment_task_id"];

		genericResourceGET(
			`/assessment_task?assessment_task_id=${atId}`, 
			"assessmentTasks", this);
	}

	render() {
		const { errorMessage } = this.state;

		return (
			<Box>
				<Box>
					{errorMessage &&
						<ErrorMessage errorMessage={errorMessage} />
					}
				</Box>
				
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
							<h2>Enter passcode to change teams</h2>

							<TextField
								id="password"
								name="password"
								variant='outlined'
								label="Passcode"
								onChange={this.handleChange}
								sx={{ mb: 2 }}
							/>

							<CustomButton
								label="Continue"
								onClick={this.submitPasscode}
								isOutlined={false} // Default button
								position={{ top: '10px', right: '0px' }}
							/>
						</div>
					</div>
				</div>
			</Box>
			
		)
	}
}

export default CodeRequirement;