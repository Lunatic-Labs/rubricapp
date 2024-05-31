import React, { Component } from "react"
import 'bootstrap/dist/css/bootstrap.css';
import CustomDataTable from "../../Components/CustomDataTable";
import { getHumanReadableDueDate } from "../../../utility";



class ViewTeams extends Component{
  render() {
    var teams = this.props.teams;

    var users = this.props.users;

    var navbar = this.props.navbar;

    const columns = [
      {
        name: "team_name",
        label: "Team Name",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"230px" } },
          setCellProps: () => { return { width:"230px" } },
        }
      },
      {
        name: "observer_id",
        label: navbar.state.chosenCourse["use_tas"] ? "TA Name" : "Instructor Name",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"230px" } },
          setCellProps: () => { return { width:"230px" } },
          customBodyRender: (observerId) => {
            return(
              <p className="pt-3" variant="contained">{users[observerId]}</p>
            )
          }
        }
      },
      {
        name: "date_created",
        label: "Date Created",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"160px" } },
          setCellProps: () => { return { width:"160px" } },
          customBodyRender: (date_created) => {
            let dateCreatedString = getHumanReadableDueDate(date_created);

            return(
              <p className="pt-3" variant='contained'>
                {date_created ? dateCreatedString : "N/A"}
              </p>
            )
          }
        }
      },
    ];

    const options = {
      onRowsDelete: false,
      download: false,
      print: false,
      viewColumns: false,
      selectableRows: "none",
      selectableRowsHeader: false,
      responsive: "vertical",
      tableBodyMaxHeight: "21rem"
    };

    return (
      <CustomDataTable
        data={teams ? teams : []}
        columns={columns}
        options={options}
      />
    )
  }
}

export default ViewTeams;