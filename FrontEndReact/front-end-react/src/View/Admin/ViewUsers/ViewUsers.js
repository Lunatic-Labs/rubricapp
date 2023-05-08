import React, { Component } from "react"
import 'bootstrap/dist/css/bootstrap.css';
import MUIDataTable from "mui-datatables";
import EditUserModal from "./EditUserModal";

// THE LINK FOR THIS LIBRARY 
// https://www.npmjs.com/package/mui-datatables#available-plug-ins

export default class ViewUsers extends Component{
  render() {
    var users = this.props.users;
    const columns = [
      // The name is the accessor for the json object. 
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
        name: "role",
        label: "Role",
        options: {
          filter: true,
        }
      }, 
      {
        name: "lms_id",
        label: "LMS_ID",
        options: {
          filter: true,
        }
      }, 
      {
        name: "consent",
        label: "Consent",
        options: {
          filter: true,
          customBodyRender: (value) => {
            return (
              <p className="pt-3" variant="contained">{value ? "True":"False"}</p>
            )
          }
        }
      }, 
      {
        name: "owner_id",
        label: "Owner_ID",
        options: {
          filter: true,
        }
      }, 
      {
        name: "user_id",
        label: "Edit",
        options: {
          filter: true,
          sort: false,
          customBodyRender: (value) => {
            return (
              // Request to edit page with unique ID here!!!
              <EditUserModal user_id={value} users={users}/>
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
      // There are different options for the responsiveness, I just chose this one. 
      responsive: "standard"
    };
    return (
      <>
        <MUIDataTable data={users[0]} columns={columns} options={options}/>
      </>
    )
  }
}