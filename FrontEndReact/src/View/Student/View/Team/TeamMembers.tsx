import React, { Component } from 'react';
// @ts-ignore: allow importing CSS without type declarations
import 'bootstrap/dist/css/bootstrap.css';
import CustomDataTable from '../../../Components/CustomDataTable';

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

    const columns = [
      {
        name: "first_name",
        label: "First Name",
        options: {
          filter: true,
        }
      },
      {
        name: "last_name",
        label: "Last Name",
        options: {
          filter: true,
        }
      },
      {
        name: "email",
        label: "Email",
        options: {
          filter: true,
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
      tableBodyMaxHeight: "75%"
    };

    return (
      <CustomDataTable
        data={users ? users : []}
        columns={columns}
        options={options}
      />
    )
  }
}

export default TeamMembers;
