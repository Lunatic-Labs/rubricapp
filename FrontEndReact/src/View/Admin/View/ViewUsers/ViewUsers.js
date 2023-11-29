import React, { Component } from "react"
import 'bootstrap/dist/css/bootstrap.css';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import CustomDataTable from "../../../Components/CustomDataTable";
// THE LINK FOR THIS LIBRARY 
// https://www.npmjs.com/package/mui-datatables#available-plug-ins

export default class ViewUsers extends Component{
  render() {
    var navbar = this.props.navbar;
    var adminViewUsers = navbar.adminViewUsers;
    var users = adminViewUsers.users;
    var roles = adminViewUsers.roles;
    var setAddUserTabWithUser = navbar.setAddUserTabWithUser;
    const columns = [
      {
        name: "first_name",
        label: "First Name",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"240px"}},
          setCellProps: () => { return { width:"240px"} },
        }
      },   
      {
        name: "last_name",
        label: "Last Name",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"240px"}},
          setCellProps: () => { return { width:"240px"} },
        }
      },  
      {
        name: "email",
        label: "Email",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"350px"}},
          setCellProps: () => { return { width:"350px"} },
        }
      },  
      {
        name: "role_id",
        label: "Role",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"210px"}},
          setCellProps: () => { return { width:"210px"} },
          customBodyRender: (role_id) => {
            var role_name = "";
            if(roles) {
              for(var r = 0; r < roles.length; r++) {
                if(role_id===roles[r]["role_id"]) {
                  role_name = roles[r]["role_name"];
                }
              }
            }
            return (
              <p>{ role_name }</p>
              
            )
          }
        }
      },
      {
        name: "user_id",
        label: "EDIT",
        options: {
          filter: true,
          sort: false,
          setCellHeaderProps: () => { return { align:"center", width:"116px"}},
          setCellProps: () => { return { align:"center", width:"116px"} },
          customBodyRender: (user_id) => {
            return (
              <IconButton id={"viewUsersEditButton"+user_id}
                onClick={() => {
                  setAddUserTabWithUser(users, user_id);
                }}
              >
                <EditIcon sx={{color:"black"}}/>
              </IconButton>
            )
          },    
        }
      }
    ]
    
    const options = {
      onRowsDelete: false,
      download: false,
      print: false,
      selectableRows: "none",
      selectableRowsHeader: false,
      responsive: "standard",
      tableBodyMaxHeight: "50vh"
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