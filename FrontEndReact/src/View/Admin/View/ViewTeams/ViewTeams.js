import React, { Component } from "react"
import 'bootstrap/dist/css/bootstrap.css';
import MUIDataTable from "mui-datatables";

// THE LINK FOR THIS LIBRARY 
// https://www.npmjs.com/package/mui-datatables#available-plug-ins

export default class ViewTeams extends Component{
  render() {
    var teams = this.props.teams;
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
        label: "Observer ID",
        options: {
          filter: true,
        }
      },  
      {
        name: "date",
        label: "Date",
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
                  this.props.setAddTeamTabWithTeam(teams[0], team_id, "AddTeam");
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
                  this.props.setAddTeamTabWithTeam(teams[0], team_id, "TeamMembers");
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
      responsive: "vertical"
    };
    return (
      <>
        <MUIDataTable data={teams[0]} columns={columns} options={options}/>
      </>
    )
  }
}