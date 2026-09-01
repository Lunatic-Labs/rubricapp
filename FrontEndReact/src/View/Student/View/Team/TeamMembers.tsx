import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import CustomDataTable from '../../../Components/CustomDataTable';
import { GridColDef } from '@mui/x-data-grid';

/**
 * @description
 * Simple table view that shows team members (first name, last name, email).
 *
 * Responsibilities:
 *  - Reads users from navbar.studentTeamMembers.users.
 *  - Renders the data in a CustomDataTable.
 *
 * Props:
 *  @prop {object} navbar - Navbar instance; must have navbar.studentTeamMembers.users
 *                          set by a parent (e.g., StudentTeamMembers).
 *
 * Notes:
 *  - No fetch/POST occurs here; this is a pure-presentational component.
 *  - Sorting and filtering are provided by CustomDataTable according to the
 *    column definitions below.
 */

interface TeamMembersProps {
  navbar: any;
}

class TeamMembers extends Component<TeamMembersProps>{
  render() {
    var navbar = this.props.navbar;
    var users = navbar.studentTeamMembers.users;

    const columns: GridColDef[] = [
      {
        field: "first_name",
        headerName: "First Name",
        flex: 1,
      },
      {
        field: "last_name",
        headerName: "Last Name",
        flex: 1,
      },
      {
        field: "email",
        headerName: "Email",
        flex: 1,
      }
    ];

    return (
      <CustomDataTable
        data={users ? users : []}
        columns={columns}
        getRowId={(row) => row.user_id}
        height="75%"
      />
    )
  }
}

export default TeamMembers;
