import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { TextField } from '@mui/material';
import CustomButton from '../Components/CustomButton';
import ErrorMessage from '../../../Error/ErrorMessage';
import { genericResourceGET } from '../../../../utility';

class CodeRequirement extends Component {
	constructor(props) {
		super(props)
		this.state = {
			password: null,
			errorMessage: null,
			assessment_tasks: null
		};

		this.submitPasscode = () => {
			let pass = this.state.password
			let correctPass = this.state.assessment_tasks.create_team_password;

			this.setState({
				password: pass
			}
			);

			if (pass === correctPass) {
				this.props.navbar.setNewTab("SelectTeam")
			} else {
				this.setState({
					errorMessage: "Incorrect passcode"
				})
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
		let at_id = this.props.navbar.state.chosen_assessment_task.assessment_task_id;

		genericResourceGET(`/assessment_task?assessment_task_id=${at_id}`, "assessment_tasks", this);
	}

	render() {
		const { errorMessage } = this.state;

		return (
			<div style={{ padding: '50px', backgroundColor: '#F8F8F8' }}>
				{errorMessage &&
					<ErrorMessage errorMessage={errorMessage} />
				}
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
		)
	}
}

export default CodeRequirement;
