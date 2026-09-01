import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import CustomDataTable from "../../../Components/CustomDataTable";
import { GridColDef } from '@mui/x-data-grid';

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
interface ViewTeamMembersProps {
    navbar: any;
}

class ViewTeamMembers extends Component<ViewTeamMembersProps>{
  render() {
    var navbar = this.props.navbar;
    var users = navbar.adminViewTeamMembers.users;

    const columns: GridColDef[] = [
      {
        field: "first_name",
        headerName: "First Name",
        width: 300,
      },
      {
        field: "last_name",
        headerName: "Last Name",
        width: 300,
      },
      {
        field: "email",
        headerName: "Email",
        width: 300,
      }
    ];

    return (
      <CustomDataTable
        data={users ? users : []}
        columns={columns}
        getRowId={(row) => row.user_id}
        height="21rem"
      />
    )
  }
}

export default ViewTeamMembers;