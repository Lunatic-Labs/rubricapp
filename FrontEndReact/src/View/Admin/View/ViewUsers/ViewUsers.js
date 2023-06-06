import React, { Component } from "react"
import 'bootstrap/dist/css/bootstrap.css';
import MUIDataTable from "mui-datatables";

// THE LINK FOR THIS LIBRARY 
// https://www.npmjs.com/package/mui-datatables#available-plug-ins

export default class ViewUsers extends Component{
  render() {
    var users = this.props.users;
    var roles = this.props.roles;
    // var role_names = this.props.role_names;
    
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
            var role_name = "";
            if(roles) {
              for(var r = 0; r < roles.length; r++) {
                if(role_id===roles[r]["role_id"]) {
                  role_name = roles[r]["role_name"];
                }
              }
            }
            return (
              <p className="role_p pt-3" variant="contained">{ role_name }</p>
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
      //         <p className="pt-3" variant="contained">{ value===null ? "N/A" : (value ? "Approved" : "Not Approved") }</p>
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
        name: "team_id",
        label: "Team ID",
        options: {
          filter: true,
          customBodyRender: (team_id) => {
            return (
              <select name="team" id="team">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            )
          }, 
        }
      },  
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
                    // console.log("EDIT_________");
                    // console.log(user_id);
                    // console.log(users);
                    // console.log(this.props.chosenCourse);
                    // console.log("EDIT_________");
                    // this.props.setAddUserTabWithUser(users, user_id, roles, role_names);
                    this.props.setAddUserTabWithUser(users, user_id);
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