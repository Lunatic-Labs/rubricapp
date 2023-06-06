import React, { Component } from "react"
import 'bootstrap/dist/css/bootstrap.css';
import MUIDataTable from "mui-datatables";

// THE LINK FOR THIS LIBRARY 
// https://www.npmjs.com/package/mui-datatables#available-plug-ins

export default class ViewTeams extends Component{
  render() {
    var teams = this.props.teams;
    var users = this.props.users;
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
        label: this.props.chosenCourse["use_tas"] ? "TA Name" : "Instructor Name",
        options: {
          filter: true,
          customBodyRender: (observer_id) => {
            var observer_name = "";
            var users = this.props.chosenCourse["use_tas"] ? this.props.users[0]: this.props.users;
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
                  this.props.setAddTeamTabWithTeam(teams[0], team_id, users, "AddTeam");
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
                  // console.log("TeamMembers");
                  // console.log(teams[0]);
                  // console.log(team_id);
                  // console.log(users);
                  this.props.setAddTeamTabWithTeam(teams[0], team_id, users, "TeamMembers");
                }}
              >
                Assign
              </button>
            )
          }
        }
      }
      //   name: "owner_id",
      //   label: "Team Number",
      //   options: {
      //     filter: true,
      //     customBodyRender: (value) => {
      //       return (
      //           <select name="cars" id="cars">
      //           <option value="volvo">1</option>
      //           <option value="saab">2</option>
      //           <option value="mercedes">3</option>
      //           <option value="audi">4</option>
      //         </select>
      //       )
      //     },
      //   }
      // }
    ]
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
        <MUIDataTable data={teams ? teams[0]:[]} columns={columns} options={options}/>
      </>
    )
  }
}