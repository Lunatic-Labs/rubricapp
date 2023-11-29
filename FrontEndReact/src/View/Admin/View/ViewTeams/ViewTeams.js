import React, { Component } from "react"
import 'bootstrap/dist/css/bootstrap.css';
import CustomDataTable from "../../../Components/CustomDataTable";
// THE LINK FOR THIS LIBRARY 
// https://www.npmjs.com/package/mui-datatables#available-plug-ins

export default class ViewTeams extends Component{
  render() {
    var navbar = this.props.navbar;
    var adminViewTeams = navbar.adminViewTeams;
    var users = adminViewTeams.users;
    var teams = adminViewTeams.teams;
    var state = navbar.state;
    var chosenCourse = state.chosenCourse;
    var setAddTeamTabWithTeam = navbar.setAddTeamTabWithTeam;
    const columns = [
      {
        name: "team_name",
        label: "Team Name",
        options: {
          filter: true,
        }
      },   
      {
        name: "observer_id",
        label: chosenCourse["use_tas"] ? "TA Name" : "Instructor Name",
        options: {
          filter: true,
          customBodyRender: (observer_id) => {
            var observer_name = "";
            if(users) {
              for( var u = 0; u < users.length; u++) {
                if(users[u]["user_id"]===observer_id) {
                  observer_name = users[u]["first_name"] + " " + users[u]["last_name"];
                }
              }
            }
            return(
              <p className="pt-3" variant="contained">{observer_name}</p>
            )
          }
        }
      },  
      {
        name: "date_created",
        label: "Date Created",
        options: {
          filter: true,
          customBodyRender: (date) => {
            var year = "";
            var month = "";
            var day = "";
            for(var dateIndex = 0; dateIndex < date.length; dateIndex++) {
                if(date[dateIndex]!=='-') {
                    if(dateIndex >= 0 && dateIndex < 4) {
                        year += date[dateIndex];
                    }
                    if(dateIndex === 5 || dateIndex === 6) {
                        month += date[dateIndex];
                    }
                    if(dateIndex > 6 && dateIndex < date.length) {
                        day += date[dateIndex];
                    }
                }
            }
            return(
              <p className="pt-3" variant='contained'>{month+'/'+day+'/'+year}</p>
            )
          }
        }
      }, 
      {
        name: "team_id",
        label: "EDIT",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (team_id) => {
            return(
              <button
                className="btn btn-primary"
                onClick={() => {
                  setAddTeamTabWithTeam(teams, team_id, users, "AddTeam");
                }}
              >
                Edit
              </button>
            )
          }
        }
      },
      {
        name: "team_id",
        label: "ASSIGN TEAM MEMBERS",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (team_id) => {
            return(
              <button
                className="btn btn-primary"
                onClick={() => {
                  setAddTeamTabWithTeam(teams, team_id, users, "TeamMembers");
                }}
              >
                Assign
              </button>
            )
          }
        }
      },
    ]
    const options = {
      onRowsDelete: false,
      download: false,
      print: false,
      selectableRows: "none",
      selectableRowsHeader: false,
      responsive: "standard",
      tableBodyMaxHeight: "55vh"
    };
    return (
      <>
        <CustomDataTable data={teams ? teams:[]} columns={columns} options={options}/>
      </>
    )
  }
}