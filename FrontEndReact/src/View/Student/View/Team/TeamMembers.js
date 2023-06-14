import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import MUIDataTable from "mui-datatables";

// THE LINK FOR THIS LIBRARY 
// https://www.npmjs.com/package/mui-datatables#available-plug-ins

//the difference between StudentTeamMembers.js and TeamMemebers.js is TeamMembers.js is the location of the mui-datatable is located

export default class ViewTeams extends Component{
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
      //   name: "owner_id",
      //   label: "Team Number",
      //   options: {
      //     filter: true,
      //     customBodyRender: (value) => {
      //       return (
      //           <select name="cars" id="cars">
      //           <option value="volvo">1</option>
      //           <option value="saab">2</option>
      //           <option value="mercedes">3</option>
      //           <option value="audi">4</option>
      //         </select>
      //       )
      //     },
      //   }
      // }
    ]
    const options = {
      onRowsDelete: false,
      download: false,
      print: false,
      selectableRows: "none",
      selectableRowsHeader: false,
      responsive: "standard",
      tableBodyMaxHeight: "75%"
    };
    return (
      <>
        <MUIDataTable data={users ? users[0]:[]} columns={columns} options={options}/>
      </>
    )
  }
}