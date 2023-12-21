import React, { Component } from 'react';
import MUIDataTable from 'mui-datatables';
import { API_URL } from '../../../../App';

// THE LINK FOR THIS LIBRARY 
// https://www.npmjs.com/package/mui-datatables#available-plug-ins

export default class ViewConsent extends Component {
  constructor(props) {
    super(props);
    var navbar = this.props.navbar;
    var viewConsent = navbar.viewConsent;
    var users = viewConsent.users;
    this.state = {
      users: users
    }
    this.getConsent = (user_id) => {
      for(var i = 0; i < this.state.users.length; i++) {
        if(this.state.users[i]["user_id"] === user_id) {
          return this.state.users[i]["consent"];
        }
      }
    }
    this.editConsent = (user_id) => {
      var new_user = null;
      for(var i = 0; i < this.state.users.length; i++) {
        if(this.state.users[i]["user_id"] === user_id) {
          new_user = this.state.users[i];
        }
      }
      new_user["consent"] = (new_user["consent"]===null || new_user["consent"]===false) ? true: false;
      fetch(API_URL + `/user/${user_id}`,
      {
          method: "PUT",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(new_user)
        }      
      )
      .then((res => res.json()))
      .then((result) => {
        if(result["success"] === false) {
          console.log(result["message"]);
        } else {
          console.log(result);
        }
      }, 
      (error) => {
        console.log(error);
      })
    }
  }
  render() {
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
        name: "user_id",
        label: "CONSENT",
        options : {
          filter: true,
          sort: false,
          customBodyRender: (user_id) => {
            return(
              <>
                <input
                  className='pt-3'
                  variant="contained"
                  type="checkbox"
                  defaultChecked={
                    this.getConsent(user_id)
                  }
                  onChange={() => {
                    this.editConsent(user_id);
                  }}
                >
                </input>
              </>
            )
          }
        }
      }
    ]
    const options = {
      onRowsDelete: false,
      download: false,
      print: false,
      selectableRows: "none",
      selectableRowsHeader: false,
      responsive: "vertical",
      tableBodyMaxHeight: "500px"
    };
    return (
      <>
        <MUIDataTable
          data={this.state.users ? this.state.users : []}
          columns={columns}
          options={options}
        />
      </>
    )
  }
}