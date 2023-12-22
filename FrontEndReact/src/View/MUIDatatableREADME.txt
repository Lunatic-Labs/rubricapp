For most of the views, we are using a react component called MUIDataTable. 
This react component is very helpful for many applications
as it can create a very organized data table with sorting functionality. 
However, there is alot of limitations with the react component. This text
file documents important information about the react component.

Explanation:

The contruction of the MUIDataTable requires information about each column.
The following is an example of what the MUIDataTable expects.
const columns = [
  {
    name: "first_name",     //  the name of the field
    label: "First Name",   //   this is what will be display as the column label
    options: {
      filter: true,
      // sortable: true
      // by default the label of the column is shown in all caps because
      //  the MUIDataTable component renders a custom element that is clickable
      // If sortable is set to false, then the label of the column renders
      //  the exact string stores as the label
    }
  }
]

In order to add an additional column, simply add a comma after the previous json object
  and add the second column
  {
    .....
    .....
    ..... {
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
Within the class, you need to get the MuiTheme:

class ViewAssessmenTasks extends Component {
    getMuiTheme = () => createTheme({
        components: {
            MUIDataTableBodyCell: {
                styleOverrides: {
                    root: {
                        backgroundColor: "#",    //this targets the entire background
                        '&:nth-child(3)': {   // the number represents the specific column number that it targets
                            backgroundColor: ""
                        }
                    }
                }
            }
        }
    })
}

step 3:
You need to surround the MUIDataTable component with the theme provider component

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