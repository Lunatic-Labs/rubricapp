import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import CustomDataTable from '../../../Components/CustomDataTable';



class TeamMembers extends Component{
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