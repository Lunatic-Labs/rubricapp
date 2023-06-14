For most of the views, we are using a react component called MUIDataTable. 
This react component is very helpful for many applications
as it can create a very organized data table with sorting functionaplity. 
However, there is alot of Limitations to this program. This document
some information about the component.

Explanation of Parts:

The contruction of the MUIDataTable requires information about each column.
The following is an example of what it requires.
const columns = [
      {
        name: "first_name",     //the name of the field
        label: "First Name",   //this is what will display as the column label in all caps
        options: {
          filter: true,
        }
      }

In order to add any additional column, simply add a comma after the previous and add the second column

     {
        .....
        .....
        .....{
          filter: true,
        }
      },
     
      {
        name: "last_name",
        label: "Last Name",
        options: {
          filter: true,
        }
      }


Limitations Discoverd:
The labels of the columns will automatiocally be in all caps if it is sortable. 
In most cases, you do want it to be sortable, 
so the columns will be in all caps.


In order to target a specic cell of the data table, you must override the default style. 
The only way we have discoverd so far to change style is by using 
ThemeProvider to override the theme and style.
ViewAssessmentTask.js has an example of this functioning, 
but a general overview will be provided below.

ThemeProvider has issues with forcing size style of specfic cells.
Additional research and testing is required for it to change the width
and alignment of specific columns or cells.




How to override style:
ThemeProvider is used to overwrite the style of the MUIDataTable.

step 1: 
import ThemeProvider

import { createTheme, ThemeProvider } from '@mui/material/styles';

step 2:
Within the class, you need to get the MuiTheme

class ViewAssessmenTasks extends Component {
    getMuiTheme = () => createTheme({
        components: {
            MUIDataTableBodyCell: {
                styleOverrides: {
                    root: {
                        backgroundColor: "#"    //this targets the entire background

                        '&:nth-child(3)': {   // the number represents the specific column number that it targets
                            backgroundColor: ""
                        }
                    }
                    


step 3:
You need to surrond the MUIDataTable component with the theme provider component

return(
            <React.Fragment>
                <ThemeProvider theme={this.getMuiTheme()}>
                    <MUIDataTable
                    data={}
                    columns={}
                    options={}
                />
                </ThemeProvider>
            </React.Fragment>
)