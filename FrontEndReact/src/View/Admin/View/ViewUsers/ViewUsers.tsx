// @ts-expect-error TS(2307): Cannot find module 'react' or its corresponding ty... Remove this comment to see the full error message
import React, { Component } from "react"
import 'bootstrap/dist/css/bootstrap.css';
// @ts-expect-error TS(2307): Cannot find module '@mui/material/IconButton' or i... Remove this comment to see the full error message
import IconButton from '@mui/material/IconButton';
// @ts-expect-error TS(2307): Cannot find module '@mui/icons-material/Edit' or i... Remove this comment to see the full error message
import EditIcon from '@mui/icons-material/Edit';
// @ts-expect-error TS(2307): Cannot find module '@mui/icons-material/Delete' or... Remove this comment to see the full error message
import DeleteIcon from '@mui/icons-material/Delete';
import CustomDataTable from "../../../Components/CustomDataTable.js";
// @ts-expect-error TS(2307): Cannot find module 'universal-cookie' or its corre... Remove this comment to see the full error message
import Cookies from 'universal-cookie';
import { genericResourceDELETE } from "../../../../utility.js";

class ViewUsers extends Component {
  props: any;
  async deleteUser(userId: any) {
    try {
      const result = await genericResourceDELETE(`/user?uid=${userId}`, this, {
        dest: "users",
      });
      if (result.errorMessage) {
        throw new Error(result.errorMessage);
      }
      //window.alert("User can be deleted")
      this.props.onSuccess("User deleted successfully");
      setTimeout(() => {
        this.props.refreshData();
      }, 1000);
    } catch (error) {
      // @ts-expect-error TS(2571): Object is of type 'unknown'.
      const errorMessage = error.message || "Cannot delete user. There are assessment task associated with this user.";
      window.alert(errorMessage);
      this.props.onError(errorMessage);
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
          setCellHeaderProps: () => { return { width: "20%" } },
          setCellProps: () => { return { width: "20%" } },
        }
      },
      {
        name: "last_name",
        label: "Last Name",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width: "20%" } },
          setCellProps: () => { return { width: "20%" } },
        }
      },
      {
        name: "email",
        label: "Email",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width: "40%" } },
          setCellProps: () => { return { width: "40%" } },
        }
      }];

    if (!navbar.props.isSuperAdmin) {
      columns.push(
        {
          name: "role_id",
          label: "Role",
          options: {
            filter: true,
            setCellHeaderProps: () => { return { width: "10%" } },
            setCellProps: () => { return { width: "10%" } },
            // @ts-expect-error TS(2322): Type '{ filter: true; setCellHeaderProps: () => { ... Remove this comment to see the full error message
            customBodyRender: (roleId: any) => {
              return (
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <p>{roleNames[roleId]}</p>
              )
            }
          }
        }
      );
    }

    if (navbar.props.isSuperAdmin) {
      columns.push(
        {
          name: "lms_id",
          label: "LMS ID",
          // @ts-expect-error TS(2739): Type '{ filter: true; }' is missing the following ... Remove this comment to see the full error message
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
        // @ts-expect-error TS(2322): Type '{ filter: false; sort: false; setCellHeaderP... Remove this comment to see the full error message
        sort: false,
        setCellHeaderProps: () => { return { align: "center", width: "10%", className: "button-column-alignment" } },
        setCellProps: () => { return { align: "center", width: "10%", className: "button-column-alignment" } },
        customBodyRender: (userId: any) => {
          var cookies = new Cookies();
          return (
            <IconButton id={"viewUsersEditButton" + userId}
              align="center"
              size="small"
              hidden={cookies.get('user')['user_id'] === userId && navbar.props.isAdmin}
              onClick={() => {
                setAddUserTabWithUser(users, userId);
              }}
              aria-label="editUserButton"
            >
              <EditIcon sx={{ color: "black" }} />
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
        // @ts-expect-error TS(2322): Type '{ filter: false; sort: false; setCellHeaderP... Remove this comment to see the full error message
        sort: false,
        setCellHeaderProps: () => { return { align: "center", width: "10%", className: "button-column-alignment" } },
        setCellProps: () => { return { align: "center", width: "10%", className: "button-column-alignment" } },
        customBodyRender: (userId: any) => {
          var cookies = new Cookies();
          return (
            <IconButton id={"viewUsersDeleteButton" + userId}
              align="center"
              size="small"
              hidden={cookies.get('user')['user_id'] === userId && navbar.props.isAdmin}
              onClick={() => {
                if (
                  window.confirm("Are you sure you want to delete this user?")
                ) {
                  this.deleteUser(userId)
                }
              }}
              aria-label="deleteUserButton"
            >
              <DeleteIcon sx={{ color: "black" }} />
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
