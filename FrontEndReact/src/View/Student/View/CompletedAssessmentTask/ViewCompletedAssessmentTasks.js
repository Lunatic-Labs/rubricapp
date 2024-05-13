import React, { Component } from "react"
import 'bootstrap/dist/css/bootstrap.css';
import CustomDataTable from "../../../Components/CustomDataTable";
import { IconButton } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getHumanReadableDueDate } from "../../../../utility";



class ViewCompletedAssessmentTasks extends Component {
  render() {
    var navbar = this.props.navbar;

    var completedAssessments = this.props.completedAssessments;

    var assessmentTasks = this.props.assessmentTasks;

    const columns = [
      {
        name: "assessment_task_name",
        label: "Team Name",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"230px" } },
          setCellProps: () => { return { width:"230px" } },
        }
      },
      {
        name: "initial_time",
        label: "Initial Time",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"230px" } },
          setCellProps: () => { return { width:"230px" } },
          customBodyRender: (initial_time) => {
            return(
              <>
                {initial_time ? getHumanReadableDueDate(initial_time) : "N/A"}
              </>
            );
          }
        }
      },
      {
        name: "last_update",
        label: "Last Update",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"160px" } },
          setCellProps: () => { return { width:"160px" } },
          customBodyRender: (last_update) => {
            return(
              <>
                {last_update ? getHumanReadableDueDate(last_update) : "N/A"}
              </>
            );
          }
        }
      },
      {
        name: "assessment_task_id",
        label: "View",
        options: {
          filter: false,
          sort: false,
          setCellHeaderProps: () => { return { align:"center", width:"140px", className:"button-column-alignment" } },
          setCellProps: () => { return { align:"center", width:"140px", className:"button-column-alignment" } },
          customBodyRender: (atId) => {
              return (
                  <div>
                      <IconButton
                          onClick={() => {
                              navbar.setAssessmentTaskInstructions(assessmentTasks, atId);
                          }}
                          aria-label="completedAssessmentTasksViewIconButton"
                      >
                        <VisibilityIcon sx={{color:"black"}} />
                      </IconButton>
          
                  </div>
              )
              
          }
      }
      },
    ];

    const options = {
      onRowsDelete: false,
      download: false,
      print: false,
      viewColumns : false,
      selectableRows: "none",
      selectableRowsHeader: false,
      responsive: "vertical",
      tableBodyMaxHeight: "21rem"
    };

    return (
      <CustomDataTable
        data={completedAssessments ? completedAssessments : []}
        columns={columns}
        options={options}
      />
    )
  }
}

export default ViewCompletedAssessmentTasks;