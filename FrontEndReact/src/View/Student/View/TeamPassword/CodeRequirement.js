import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import MUIDataTable from 'mui-datatables';
import CustomButton from '../Components/CustomButton';
import StudentPassword from './StudentCodeRequirement';

// NOTE: Header
class CodeRequirementHeader extends Component {

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


class CodeProvidedTable extends Component {

	
	render() {
		const students= this.props.users;
	 
			<>
				<div style={{ padding: '50px', backgroundColor: '#F8F8F8' }}>
					<div>
						<h2>hello </h2>
						
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

							<MUIDataTable 
								data={students ? students : []} 
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
		
		return;
	}
}

export default CodeProvidedTable; 
