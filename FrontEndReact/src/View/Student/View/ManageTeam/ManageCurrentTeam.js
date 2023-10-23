import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import MUIDataTable from 'mui-datatables';
import EditConfirmButtons from './ManageCurrentTeamButtons.js';

// NOTE: Header
class ManageCurrentTeamHeader extends Component {

	render() {
    const headerStyle = {
			paddingTop: '16px',
      marginLeft: '-420px',
      fontWeight: 'bold', // You can set fontWeight here as well
    };

    return (
      <>
        <div className='container' style={headerStyle}>
          <h2>Manage your current team</h2>
        </div>
      </>
    );
  }
}

// NOTE: Team name
// TODO: Function needs to fetch the team name 
class TeamName extends Component {
	render() {
		return (
		<>
			<div className='container' style={{ marginTop: '35px' }}>
				<h3 style={{ textAlign: 'left', marginBottom: '10px', marginLeft: '-21px' }}>Confirm your team members</h3>
				<h4 style={{ textAlign: 'left', marginBottom: '20px', marginLeft: '-21px', color: '#2E8BEF' }}>Lunatic Labs</h4>
			</div>
		</>	
		)
	}
}

// NOTE: Creates Table
class ManageCurrentTeamTable extends Component {
	constructor(props) {
		super(props);
	}

	// NOTE: Edit Action
	handleEditClick = () => {
		this.props.setNewTab( "ViewComplete");
    // Add your edit functionality here
  };

	// NOTE: Confirm Action
  handleConfirmClick = () => {
    console.log('Confirm Team button clicked');
    // Add your confirm team functionality here
  };

	render() {
		const students= this.props.users;
	 
		// NOTE: Column names
		const columns = [
			{
				name: "first_name",
				label: "First Name",
				options: {
					filter: true
    		},
			},
			{
				name: "last_name",
				label: "Last Name",
				optiions: {
					filter: true
				},
			},
			{
				name: "email",
				label: "Email",
				optiions: {
					customBodyRender: (value) => <div style={{ textAlign: 'right' }}>{value}</div>,
					filter: true
				},
			},
		];
        const options = {
            onRowsDelete: false,
            download: false,
            print: false,
            selectableRows: "none",
            selectableRowsHeader: false,
            responsive: "standard",
            tableBodyMaxHeight: "21rem"
        };
		return (
			<>
				<div style={{ padding: '70px', backgroundColor: '#F8F8F8' }}>
					<div>
						<ManageCurrentTeamHeader />
						<div className='container' 
							style={{ 
								backgroundColor: '#FFF',
								border: '3px, 0px, 0px, 0px',
								borderTop: '3px solid #4A89E8', 
								borderRadius: '10', 
								marginTop: '60px', 
								marginBottom: '10px',
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
							<EditConfirmButtons
          			onEditClick={this.handleEditClick}
          			onConfirmClick={this.handleConfirmClick}
        />
						</div>
					</div>
				</div>
			</>
		);

	}
}

export default ManageCurrentTeamTable; 
