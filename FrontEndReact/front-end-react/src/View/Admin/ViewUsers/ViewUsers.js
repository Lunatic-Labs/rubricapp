import React from "react"
import MUIDataTable from "mui-datatables";
import { Box } from "@mui/material";
import Button from '@mui/material/Button';

// THE LINK FOR THIS LIBRARY 
// https://www.npmjs.com/package/mui-datatables#available-plug-ins

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
    label: "LMS ID",
    options: {
      filter: true,
      }
  }, 
  {
    name: "consent",
    label: "Consent",
    options: {
      filter: true,
      }
  }, 
  {
    name: "owner_id",
    label: "Owner ID",
    options: {
      filter: true,
      }
  }, 
  {
    name: "user_id",
    label: "Edit",
    options: {
      filter: true,
      customBodyRender: (value) => {
        return (
          // Request to edit page with unique ID here!!!
          <Button onClick={() => window.alert(`Clicked "Edit" for row ${value}`)} variant="contained">Edit</Button>
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

export default function ViewUsers(users){
    return (
        // <Box sx={{m:2}}><MUIDataTable title={"Users"} data={users.users[0]} columns={columns} options={options}/></Box>
        <Box sx={{m:2}}><MUIDataTable data={users.users[0]} columns={columns} options={options}/></Box>
    )
}