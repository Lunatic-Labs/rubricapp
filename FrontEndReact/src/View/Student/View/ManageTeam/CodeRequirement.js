import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import MUIDataTable from 'mui-datatables';
import CustomButton from '../Components/Button.js';

// NOTE: Header
class ManageCurrentTeamHeader extends Component {

	render() {
    const headerStyle = {
	    paddingTop: '16px',
        marginLeft: '-420px',
        fontWeight: 'bold',
    };

    return (
      <>
        <div className='container' style={headerStyle}>
          <h2></h2>
        </div>
      </>
    );
  }
}


class TeamName extends Component {
	render() {
		return (
		<>
			<div className='container' style={{ marginTop: '15px' }}>
				<h3 style={{ textAlign: 'left', marginBottom: '10px', marginLeft: '-21px' }}>Code Required</h3>
                <h4 style={{textAlign:'left', marginBottom: '10px', marginLeft: '-21px'}}>Please enter the code provided by the instructor to edit team </h4>
			</div>
		</>	
		)
	}
}


class ManageCurrentTeamTable extends Component {

	
	render() {
		const students= this.props.users;
	 
			<>
				<div style={{ padding: '50px', backgroundColor: '#F8F8F8' }}>
					<div>
						<ManageCurrentTeamHeader />
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
								padding:'24px', 
								paddingBottom: '80px',
								gap: 20,
							}}>
							<TeamName />
							<MUIDataTable 
								data={students ? students : []} 
								columns={columns} 
								options={options} 
							/>

							
  						
							<CustomButton
  							label="Continue "
  							onClick={this.handleConfirmClick}
  							isOutlined={false} // Default button
  							position={{ top: '10px', right: '0px' }}
							/>
						</div>
					</div>
				</div>
			</>
		

	}
}

export default ManageCurrentTeamTable; 
