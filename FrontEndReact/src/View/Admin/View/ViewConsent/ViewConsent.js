import React, { Component } from 'react';
import MUIDataTable from 'mui-datatables';

// THE LINK FOR THIS LIBRARY 
// https://www.npmjs.com/package/mui-datatables#available-plug-ins

export default class ViewConsent extends Component {
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
        name: "consent",
        label: "Consent",
        options : {
          filter: true,
          customBodyRender: (value) => {
            return(
              <p className="pt-3" variant="contained">{ value===null ? "N/A" : (value ? "Yes" : "No") }</p>
            )
          }
        }
      },
      {
        name: "user_id",
        label: "Edit",
        options : {
          filter: true,
          customBodyRender: (value) => {
            return(
              <button
                className='btn btn-primary'
                onClick={() => {
                  this.props.setEditConsentWithUser(
                    value,
                    users
                  );
                }}
              >
                Edit 
              </button>
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
        <MUIDataTable data={users ? users : []} columns={columns} options={options}/>
      </>
    )
  }
}