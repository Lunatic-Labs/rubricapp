import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import MUIDataTable from 'mui-datatables';
import { createTheme, ThemeProvider } from '@mui/material/styles';


class ViewAssessmenTasks extends Component {
    getMuiTheme = () => createTheme({
        components: {
          MUIDataTableBodyCell: {
            styleOverrides:{
              root: {
                  backgroundColor: "#",
                  padding: '0px',
                  textalign: "center",
                  
                  '&:nth-child(5)': {
                    backgroundColor: "",
                    color: "blue",
                    color:"justify-content-center",
                    height:"10px !important"}
                
                  },
              at_name:{
                backgroundColor: "#2d367a",
              }
            }
          }
        }
      })
    
    
    render() {
        const columns = [
            {
                name: "at_name",
                className: "at_name",
                label: "Task Name",
                options: {
                    filter: true,
                }
            },
            {
                name: "due_date",
                label: "Due Date",
                options: {
                    filter: true,
                    customBodyRender: (due_date) => {
                        var date = new Date(due_date);
                        var month = date.getMonth() - 1;
                        var day = date.getDate();
                        var hour = date.getHours();
                        var minute = date.getMinutes();
                        const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                        return(
                            <p
                                className='mt-3'
                                variant='contained'
                            >
                                {`${monthNames[month]} ${(day)} at ${hour%12}:${minute<10?("0"+minute):minute}${hour<12?"am":"pm"}`}
                            </p>
                        )
                    }
                }
            },
            {
                name: "role_id",
                label: "Completed By",
                options: {
                    filter: true,
                    customBodyRender: (role_id) => {
                        return (
                            <p className='' variant='contained'>{this.props.role_names ? this.props.role_names[role_id]:""}</p>
                        )
                    }
                }
            },
            {
                name: "rubric_id",
                label: "Rubric Used",
                options: {
                    filter: true,
                    customBodyRender: (rubric_id) => {
                        return (
                            <p className='' variant="contained">{this.props.rubric_names ? this.props.rubric_names[rubric_id]:""}</p>
                        )
                    }
                }
            },
            {
                name: "suggestions",
                
                label: "Show Improvements?",
                options: {
                    filter: true,
                    customBodyRender: (value) => {
                        return(
                            <div  className="justify-content-center">{value===null ? "N/A" : (value ? "Yes" : "No")}</div>
                        )
                    }
                }
            },
            {
                name: "ratings",
                label: "Show Ratings?",
                options: {
                    filter: true,
                    customBodyRender: (value) => {
                        return(
                            
                            <p className="">{value===null ? "N/A" : (value ? "Yes" : "No")}</p>
                        )
                    }
                }
            },
            {
                name: "at_id",
                label: "EDIT",
                options: {
                    filter: true,
                    sort: false,
                    customBodyRender: (value) => {
                        return (
                            <button
                                id={value}
                                className='editTaskButton btn btn-primary'
                                onClick={() => {
                                    this.props.setAddAssessmentTaskTabWithAssessmentTask(
                                        this.props.assessment_tasks,
                                        value,
                                        this.props.chosenCourse,
                                        this.props.role_names,
                                        this.props.rubric_names
                                    )
                                }}
                            >
                                Edit
                            </button>
                        )
                    },    
                }
            },
            {
                name: "at_id",
                label: "VIEW",
                options: {
                    filter: false,
                    sort: false,
                    customBodyRender: (at_id) => {
                        return(
                            <button
                                className='btn btn-primary'
                                variant='contained'
                                onClick={() => {
                                    this.props.setCompleteAssessmentTaskTabWithID(this.props.assessment_tasks, at_id);
                                    // this.props.setNewTab("ViewComplete");
                                }}
                            >
                                View
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
            responsive: "standard",
            tableBodyMaxHeight: "21rem"
        };
        return(
            <React.Fragment>
                <ThemeProvider theme={this.getMuiTheme()}>
                    <MUIDataTable data={this.props.assessment_tasks ? this.props.assessment_tasks : []} columns={columns} options={options}/>
                </ThemeProvider>
            </React.Fragment>
        )
    }
}

export default ViewAssessmenTasks;