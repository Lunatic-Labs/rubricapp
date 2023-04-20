import React from "react"
import MUIDataTable from "mui-datatables";
import { Box } from "@mui/material";
import Button from '@mui/material/Button';
import MOCK_DATA from "./MOCK_DATA.json"


// THE LINK FOR THIS LIBRARY 
// https://www.npmjs.com/package/mui-datatables#available-plug-ins



const columns = [
    // The name is the accessor for the json object. 
    {
      name: "course_name",
      label: "Course Name",
      options: {
        filter: true,
        
      }
    },   
    {
        name: "course_number",
        label: "Course Number",
        options: {
          filter: true,
          
        }
      },  
      {
        name: "term",
        label: "Term",
        options: {
          filter: true,
          
        }
      },  
      {
        name: "year",
        label: "Year",
        options: {
          filter: true,
          
        }
      }, 
      {
    name: "course_id",
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
  onRowsDelete: false ,
  download : false ,
  print : false ,
  selectableRows: "none",
  selectableRowsHeader: false,
//   There are different options for the responsiveness, I just chose this one. 
  responsive: "standard"
};


export function DataTable(){
  
    return (
        <Box sx={{m:2}}>
            <MUIDataTable 
            title={"Courses"}
            data={MOCK_DATA.courses}
            columns={columns}
            options={options} 
            />
        </Box>
    )
}


 




