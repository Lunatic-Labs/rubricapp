import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import CustomDataTable from "../../../Components/CustomDataTable";

/**
 * Creates an instance of the ViewTeamMembers component.
 * Displays a table of team members. 
 * 
 * @constructor
 * @param {Object} props - The properties passed to the component.
 * @property {Object} props.navbar - The navbar object containing state and methods for navigation.
 * 
 * Source:
 * @see AdminViewTeamMembers.js
 * 
 * Sorting and Filtering:
 * Handled via CustomDataTable component.
 * 
 */

class ViewTeamMembers extends Component<any>{
  render() {
    var navbar = this.props.navbar;
    var users = navbar.adminViewTeamMembers.users;

    const columns = [
      {
        name: "first_name",
        label: "First Name",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"300px"}},
          setCellProps: () => { return { width:"300px"} },
        }
      },
      {
        name: "last_name",
        label: "Last Name",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"300px"}},
          setCellProps: () => { return { width:"300px"} },
        }
      },
      {
        name: "email",
        label: "Email",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"300px"}},
          setCellProps: () => { return { width:"300px"} },
        }
      }
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
      <CustomDataTable data={users ? users:[]} columns={columns} options={options}/>
    )
  }
}

export default ViewTeamMembers;