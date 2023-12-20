import React, { Component } from "react"
import 'bootstrap/dist/css/bootstrap.css';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Custom from "../../../Components/CustomDataTable";
import Cookies from 'universal-cookie';
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
        name: "user_id",
        label: "EDIT",
        options: {
          filter: true,
          sort: false,
          customBodyRender: (user_id) => {
            var cookies = new Cookies();
            return (
              <IconButton id={"viewUsersEditButton"+user_id}
                align="center"
                disabled={cookies.get("user")["user_id"] === user_id && this.props.navbar.props.isAdmin}
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
      tableBodyMaxHeight: "45vh"
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