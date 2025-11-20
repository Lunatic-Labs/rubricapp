import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import CustomDataTable from "../../../Components/CustomDataTable";



class ViewTeamMembers extends Component{
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