import React, { Component } from "react"
import 'bootstrap/dist/css/bootstrap.css';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CustomDataTable from "../../../Components/CustomDataTable.js";



class ViewTeams extends Component{
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
          setCellHeaderProps: () => { return { width:"178px"}},
          setCellProps: () => { return { width:"178px"} },
        }
      },
      {
        name: "observer_id",
        label: chosenCourse["use_tas"] ? "TA Name" : "Instructor Name",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"165px"}},
          setCellProps: () => { return { width:"165px"} },
          customBodyRender: (observerId) => {
            return(
              observerId === chosenCourse["admin_id"]? 
              <p className="pt-3" variant='contained'> Admin </p> :
              <p className="pt-3" variant='contained'>{users[observerId]}</p>
            )
          }
        }
      },
      {
        name: "date_created",
        label: "Date Created",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"165px"}},
          setCellProps: () => { return { width:"165px"} },
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
          setCellHeaderProps: () => { return { align:"center", width:"130px", className:"button-column-alignment"}},
          setCellProps: () => { return { align:"center", width:"130px", className:"button-column-alignment"} },
          customBodyRender: (teamId) => {
            return(
              <IconButton
               align="center"
               onClick={() => {
                setAddTeamTabWithTeam(teams, teamId, users, "AddTeam");;
               }}
              >
                <EditIcon sx={{color:"black"}}/>
              </IconButton>
            )
          }
        }
      },
      {
        name: "team_id",
        label: "VIEW TEAM MEMBERS",
        options: {
          filter: false,
          sort: false,
          setCellHeaderProps: () => { return { align:"center", width:"120px", className:"button-column-alignment"}},
          setCellProps: () => { return { align:"center", width:"120px", className:"button-column-alignment"} },
          customBodyRender: (teamId) => {
            return(
              <IconButton
                align="center"
                onClick={() => {
                  setAddTeamTabWithTeam(teams, teamId, users, "TeamMembers");
                }}
              >
                <VisibilityIcon sx={{color:"black"}}/>
             </IconButton>
            )
          }
        }
      },
    ];

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
      <CustomDataTable data={teams ? teams:[]} columns={columns} options={options}/>
    )
  }
}

export default ViewTeams;