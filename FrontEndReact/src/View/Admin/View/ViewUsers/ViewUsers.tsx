import React, { Component } from "react"
import 'bootstrap/dist/css/bootstrap.css';
import IconButton from '@mui/material/IconButton';
import { Visibility } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomDataTable from "../../../Components/CustomDataTable";
import Cookies from 'universal-cookie';
import { genericResourceDELETE } from "../../../../utility";
import { GridColDef } from '@mui/x-data-grid';
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

interface ViewUsersProps {
    navbar: any;
    onError: (message: string) => void;
    onSuccess: (message: string) => void;
    refreshData: () => void;
}

class ViewUsers extends Component<ViewUsersProps> {
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
  async deleteUser(userId: number) {
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
    var setCoursesTabWithUser = navbar.setCoursesTabWithUser;

    const columns: GridColDef[] = [
      {
        field: "first_name",
        headerName: "First Name",
        width: 150,
      },
      {
        field: "last_name",
        headerName: "Last Name",
        width: 150,
      },
      {
        field: "email",
        headerName: "Email",
        width: 260,
      }];

    if (!navbar.props.isSuperAdmin) {
      columns.push(
        {
          field: "role_id",
          headerName: "Role",
          width: 110,
          renderCell: (params) => (
            <p>{roleNames[params.value]}</p>
          )
        }
      );
    }

    if (navbar.props.isSuperAdmin) {
      columns.push(
        {
          field: "lms_id",
          headerName: "LMS ID",
          width: 110,
        }
      );
      columns.push({
        field: "view_action",
        headerName: "View",
        width: 90,
        filterable: false,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => {
          const userId = params.row.user_id;
          var cookies = new Cookies();
          return (
            <IconButton id={"viewUsersViewButton" + userId}
              size="small"
              hidden={cookies.get('user')['user_id'] === userId && navbar.props.isAdmin}
              onClick={() => {
                setCoursesTabWithUser(users, userId);
              }}
              aria-label="viewUserButton"
            >
              <Visibility />
            </IconButton>
          )
        },
      });
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
    if (!navbar.props.isSuperAdmin) {
      columns.push({
        field: "edit_action",
        headerName: "Edit",
        width: 90,
        filterable: false,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => {
          const userId = params.row.user_id;
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
      });
    }
    columns.push({
      field: "delete_action",
      headerName: "Delete",
      width: 90,
      filterable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const userId = params.row.user_id;
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
    });

    return (
      <CustomDataTable
        data={users ? users : []}
        columns={columns}
        getRowId={(row) => row.user_id}
        height="50vh"
      />
    )
  }
}

export default ViewUsers;
