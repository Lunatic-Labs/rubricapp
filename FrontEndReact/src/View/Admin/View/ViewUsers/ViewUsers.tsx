import React, { Component } from "react"
import 'bootstrap/dist/css/bootstrap.css';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomDataTable from "../../../Components/CustomDataTable";
import Cookies from 'universal-cookie';
import { genericResourceDELETE } from "../../../../utility.js";
/**
 * Creates an instance of the ViewUsers component.
 * Displays a table of users with options to edit and delete.
 * 
 * @constructor
 * @param {Object} props - The properties passed to the component.
 * @property {Object} props.navbar - The navbar object containing state and methods for navigation.
 * @property {Function} props.onSuccess - Callback function to handle success messages.
 * @property {Function} props.onError - Callback function to handle error messages.
 * @property {Function} props.refreshData - Function to refresh the user data after deletion.
 * 
 * Source:
 * @see AdminViewUsers.js
 * 
 * Permissions:
 * - Users cannot delete themselves (buttons hidden when userId matches logged-in user).
 *    - Only applies when the logged-in user is an admin.
 * 
 */


class ViewUsers extends Component<any> {
  /**
   * @method deleteUser - Deletes a user by their user ID.
   * 
   * API Endpoint: /user
   * HTTP Method: DELETE
   * 
   * Parameters:
   * @param {string} userId - The ID of the user to be deleted.
   * 
   * Operation:
   * - Deletes specified user.
   * - Single user deletion only.
   * 
   * Flow:
   * 1. Calls genericResourceDELETE with userId.
   * 2. Calls onSuccess or onError based on result.
   * 3. Waits 1 second before refreshing data.
   * 4. Calls refreshData to update user list.
   * 
   * Error Handling:
   * - displays error message via window.alert
   */
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
    } catch (error: any) {
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
            customBodyRender: (roleId: any) => {
              return (
                <p>{roleNames[roleId]}</p>
              )
            }
          }
        } as any
      );
    }

    if (navbar.props.isSuperAdmin) {
      columns.push(
        {
          name: "lms_id",
          label: "LMS ID",
          options: {
            filter: true,
            setCellHeaderProps: () => { return { width: "10%" } },
            setCellProps: () => { return { width: "10%" } },
          }
        } as any
      );
    }
/**
 * Edit and Delete Buttons:
 * - Added as custom columns to the table.
 * - Edit Button:
 *   - Opens the AddUser tab with the selected user's data for editing.
 * - Delete Button:
 *   - Prompts for confirmation before deleting the user.
 *   - Calls deleteUser method to perform deletion.
 * - Permissions:
 *   - Buttons are hidden if the userId matches the logged-in user and the user is an admin.
 * 
 */
    columns.push({
      name: "user_id",
      label: "Edit",
      options: {
        filter: false,
        setCellHeaderProps: () => { return { align: "center", width: "10%", className: "button-column-alignment" } },
        setCellProps: () => { return { align: "center", width: "10%", className: "button-column-alignment" } },
        customBodyRender: (userId: any) => {
          var cookies = new Cookies();
          return (
            <IconButton id={"viewUsersEditButton" + userId}
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
    } as any);
    columns.push({
      name: "user_id",
      label: "Delete",
      options: {
        filter: false,
        setCellHeaderProps: () => { return { align: "center", width: "10%", className: "button-column-alignment" } },
        setCellProps: () => { return { align: "center", width: "10%", className: "button-column-alignment" } },
        customBodyRender: (userId: any) => {
          var cookies = new Cookies();
          return (
            <IconButton id={"viewUsersDeleteButton" + userId}
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
    } as any);

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
