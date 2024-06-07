import React, { Component } from "react"
import 'bootstrap/dist/css/bootstrap.css';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import CustomDataTable from "../../../Components/CustomDataTable.js";
import Cookies from 'universal-cookie';



class ViewUsers extends Component{
  render() {
    var navbar = this.props.navbar;
    var adminViewUsers = navbar.adminViewUsers;
    var users = adminViewUsers.users;
    var roleNames = adminViewUsers.roleNames;
    var setAddUserTabWithUser = navbar.setAddUserTabWithUser;

    const columns = [
      {
        name: "first_name",
        label: "First Name",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"260px"}},
          setCellProps: () => { return { width:"260px"} },
        }
      },
      {
        name: "last_name",
        label: "Last Name",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"260px"}},
          setCellProps: () => { return { width:"260px"} },
        }
      },  
      {
        name: "email",
        label: "Email",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"400px"}},
          setCellProps: () => { return { width:"450px" } },
        }
      }];

      if(!navbar.props.isSuperAdmin) {
        columns.push(
          {
            name: "role_id",
            label: "Role",
            options: {
              filter: true,
              setCellHeaderProps: () => { return { width:"40px"}},
              setCellProps: () => { return { width:"40px" } },
              customBodyRender: (roleId) => {
                return (
                  <p className="role_p pt-3" variant="contained">{ roleNames[roleId] }</p>
                )
              }
            }
          }
        );
      }

      if(navbar.props.isSuperAdmin) {
        columns.push(
          {
            name: "lms_id",
            label: "LMS ID",
            options: {
              filter: true
            }
          }
        );
      }

    columns.push({
      name: "user_id",
      label: "EDIT",
      options: {
        filter: false,
        sort: false,
        setCellHeaderProps: () => { return { align:"center", width:"140px", className:"button-column-alignment" } },
        setCellProps: () => { return { align:"center", width:"140px", className:"button-column-alignment" } },
        customBodyRender: (userId) => {
          var cookies = new Cookies();
          return (
            <IconButton id={"viewUsersEditButton"+userId}
              align="center"
              size="small"
              hidden={cookies.get('user')['user_id'] === userId && navbar.props.isAdmin}
              onClick={() => {
                setAddUserTabWithUser(users, userId);
              }}
              aria-label="editUserButton"
            >
              <EditIcon sx={{color:"black"}}/>
            </IconButton>
          )
        },
      }
    });
    
    const options = {
      onRowsDelete: false,
      download: false,
      print: false,
      viewColumns: false,
      selectableRows: "none",
      selectableRowsHeader: false,
      responsive: "vertical",
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

export default ViewUsers;