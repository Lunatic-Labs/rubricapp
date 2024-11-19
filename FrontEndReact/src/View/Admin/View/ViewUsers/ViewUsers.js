import React, { Component } from "react"
import 'bootstrap/dist/css/bootstrap.css';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomDataTable from "../../../Components/CustomDataTable.js";
import Cookies from 'universal-cookie';
import { genericResourceDELETE } from "../../../../utility.js";


class ViewUsers extends Component{
  async deleteUser(userId) {
    try {
      const result = await genericResourceDELETE(`/user?user_id=${userId}`, this, {
        dest: "users",
      });
      if (result.errorMessage) {
        throw new Error(result.errorMessage);
      }
      //window.alert("User can be deleted")
      this.setState("User deleted successfully");
      setTimeout(() => {
        this.props.refreshData();
      }, 1000);
    } catch (error) {
      const errorMessage = error.message || "Cannot delete user. There are assessment task associated with this user.";
      window.alert(errorMessage);
      this.setState(errorMessage);
      setTimeout(() => {
        this.props.refreshData();
      }, 1000);
    }
  }
    
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
          setCellHeaderProps: () => { return { width:"20%"}},
          setCellProps: () => { return { width:"20%"} },
        }
      },
      {
        name: "last_name",
        label: "Last Name",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"20%"}},
          setCellProps: () => { return { width:"20%"} },
        }
      },  
      {
        name: "email",
        label: "Email",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"40%"}},
          setCellProps: () => { return { width:"40%" } },
        }
      }];

      if(!navbar.props.isSuperAdmin) {
        columns.push(
          {
            name: "role_id",
            label: "Role",
            options: {
              filter: true,
              setCellHeaderProps: () => { return { width:"10%"}},
              setCellProps: () => { return { width:"10%" } },
              customBodyRender: (roleId) => {
                return (
                  <p>{ roleNames[roleId] }</p>
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
      label: "Edit",
      options: {
        filter: false,
        sort: false,
        setCellHeaderProps: () => { return { align:"center", width:"10%", className:"button-column-alignment" } },
        setCellProps: () => { return { align:"center", width:"10%", className:"button-column-alignment" } },
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
      },
    });
    columns.push({
      name: "user_id",
      label: "Delete",
      options: {
        filter: false,
        sort: false,
        setCellHeaderProps: () => { return { align:"center", width:"10%", className:"button-column-alignment" } },
        setCellProps: () => { return { align:"center", width:"10%", className:"button-column-alignment" } },
        customBodyRender: (userId) => {
          return (
            <IconButton id={"viewUsersDeleteButton"+userId}
              align="center"
              size="small"
              onClick={() => {
                this.deleteUser(userId);
              }}
              aria-label="deleteUserButton"
            >
              <DeleteIcon sx={{color:"black"}}/>
            </IconButton>
          )
        },        
      },
    });
    
    const options = {
      onRowsDelete: false,
      download: false,
      print: false,
      viewColumns: false,
      selectableRows: "none",
      selectableRowsHeader: false,
      responsive: "vertical",
      tableBodyMaxHeight: "50vh",
      //setRowProps: () => { return { padding: "none" } },
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