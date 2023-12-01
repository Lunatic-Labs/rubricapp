import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import CustomHeader from '../Components/CustomHeader.js';
import { Grid, Button, IconButton } from '@mui/material';
import CustomDataTable from '../../../Components/CustomDataTable.js'
import ShowTeamMembers from './ShowTeamMembers.js';
import VisibilityIcon from '@mui/icons-material/Visibility';

class BuildTeamTable extends Component {
  constructor(props) {
    super(props);
    var navbar = this.props.navbar;
    var studentBuildTeam = navbar.studentBuildTeam;
    var teams = studentBuildTeam.teams;
    this.state = {
      selectedTeam: null,
      teams: teams
    };
    this.chooseTeam = (team_id) => {
      this.setState({
        selectedTeam: team_id
      });
    }
  }

	render() {
    const teamColumns = [
		  {
				name: "team_name",
				label: "Team Name",
				options: {
					filter: true,
					align: "center"
				}
			},
      {
        name: "team_id",
        label: "VIEW",
        options: {
          filter: false,
          align: "center",
          customBodyRender: (team_id) => {
            return (
              <IconButton
                onClick={
                  () => {
                    this.chooseTeam(team_id);
                  }
                }
              >
                <VisibilityIcon
                  sx={{color:"black"}}
                />
              </IconButton>
            );
          }
        }
      }
		];

    const options = {
    	onRowsDelete: false,
      download: false,
      print: false,
      selectableRows: "none",
      selectableRowsHeader: false,
      responsive: "standard",
      tableBodyMaxHeight: "21rem",
    };

    var navbar = this.props.navbar;
    navbar.buildTeam = {};
    navbar.buildTeam.selectedTeam = this.state.selectedTeam;

		return (
			<>
       <div style={{ padding: '50px', backgroundColor: '#F8F8F8' }}>
          <div>
            <CustomHeader
              label='All Teams'
              style={{
                padding: '16px',
                marginLeft: '-400px',
              }}
              bold='bold'
            />
            <Grid container spacing={8}>
              <Grid item xs={6}>
                <CustomDataTable 
                  data={this.state.teams} 
                  columns={teamColumns}
                  options={options}
                />
              </Grid>
              <Grid item xs={6}>
                <ShowTeamMembers
                  navbar={navbar}
                />
              </Grid>
              <Grid
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "end"
                  }}
              >
                  <Button
                      style={{
                          color: "white",
                          backgroundColor: "#2196F3",
                          marginTop: "30px"
                      }}
                      onClick={
                        () => {
                          console.log("Confirm Team");
                        }
                      }
                  >
                      Confirm Team
                  </Button>
              </Grid>
            </Grid>
          </div>
       </div>
			</>
		)
	}
}

export default BuildTeamTable;
