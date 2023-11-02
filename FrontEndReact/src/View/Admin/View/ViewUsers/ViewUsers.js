import React, { Component } from "react"
import 'bootstrap/dist/css/bootstrap.css';
import MUIDataTable from "mui-datatables";

// THE LINK FOR THIS LIBRARY 
// https://www.npmjs.com/package/mui-datatables#available-plug-ins

export default class ViewUsers extends Component{
  render() {
    var users = this.props.users;
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
      },  
      {
        name: "role_id",
        label: "Role",
        options: {
          filter: true,
          customBodyRender: (role_id) => {
            return (
              <p className="role_p pt-3" variant="contained" align="center">{ this.props.roles[role_id] }</p>
            )
          }
        }
      }, 
      // This data should be only seen by SuperAdmin and not each individual Admin logged in!
      // {
      //   name: "lms_id",
      //   label: "LMS ID",
      //   options: {
      //     filter: true,
      //   }
      // }, 
      // {
      //   name: "consent",
      //   label: "Consent",
      //   options: {
      //     filter: true,
      //     customBodyRender: (value) => {
      //       return (
      //         <p className="pt-3" variant="contained" align="center">{ value===null ? "N/A" : (value ? "Approved" : "Not Approved") }</p>
      //       )
      //     }
      //   }
      // }, 
      // {
      //   name: "owner_id",
      //   label: "Owner ID",
      //   options: {
      //     filter: true,
      //   }
      // }, 
      
      {
        name: "user_id",
        label: "EDIT",
        options: {
          filter: true,
          sort: false,
          customBodyRender: (user_id) => {
            return (
              <button
                id={"viewUsersEditButton"+user_id}
                className="editUserButton btn btn-primary"
                onClick={
                  () => {
                    this.props.navbar.setAddUserTabWithUser(users, user_id);
                  }
                }>
                  Edit
              </button>
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
      tableBodyMaxHeight: "30rem"
    };
    return (
      <>
        <MUIDataTable data={users ? users : []} columns={columns} options={options}/>
      </>
    )
  }
}