import React, { Component } from "react"
import 'bootstrap/dist/css/bootstrap.css';
import MUIDataTable from "mui-datatables";

// THE LINK FOR THIS LIBRARY 
// https://www.npmjs.com/package/mui-datatables#available-plug-ins

export default class ViewTeams extends Component{
  render() {
    var navbar = this.props.navbar;
    var adminViewTeams = navbar.adminViewTeams;
    var teams = adminViewTeams.teams;
    var users = adminViewTeams.users;
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
            return(
              <p className="pt-3" variant="contained" align="center">{users[observer_id]}</p>
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
              <p className="pt-3" variant='contained' align="center">{month+'/'+day+'/'+year}</p>
            )
          }
        }
      }, 
      // SKIL-161-Confirm-Team contains a new way for TA/Instructors and Students will change their teams!
      // {
      //   name: "team_id",
      //   label: "View",
      //   options: {
      //     filter: false,
      //     sort: false,
      //     customBodyRender: (team_id) => {
      //       return(
      //         <button
      //           className="btn btn-primary"
      //           onClick={() => {
      //             this.props.navbar.setAddTeamTabWithTeam(this.props.teams, team_id, this.props.users, "StudentTeamMembers");}}
      //           >
      //           View
      //         </button>
      //       )
      //     }
      //   }
      // },
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
        <MUIDataTable data={teams ? teams:[]} columns={columns} options={options}/>
      </>
    )
  }
}
