import React, { Component } from 'react';
import MUIDataTable from 'mui-datatables';
import { API_URL } from '../../../../App';

// THE LINK FOR THIS LIBRARY 
// https://www.npmjs.com/package/mui-datatables#available-plug-ins

export default class ViewReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reportList: null
    }
  }
  componentDidMount () {
    fetch(API_URL + '/completed_assessment')
    .then(res => res.json())
    .then(
      (result) => {
        if(result["success"]) {
          this.setState({
            reportList: result['content']['completed_assessments'][0]
          });
        } else {
          console.log("ERROR!");
        }
      },
      (error) => {
        console.log(error);
      }
    )
  }
  render() {
    const columns = [
      {
        name: "first_name",
        label: "Student Name",
        options: {
          filter: true,
        }
      },  
      {
        name: "feedback_time_lag",
        label: "Feedback Time Lag",
        options: {
          filter: true,
        }
      },
      {
        name: "Identifying the Goal",
        label: "Identifying the Goal",
        options: {
          filter: true,
          customBodyRender: (
            (identifying_the_goal) => {
              return(
                <p>{identifying_the_goal["rating"]}</p>
              )
            }
          )
        }
      },  
      {
        name: "Evaluating",
        label: "Evaluating",
        options: {
          filter: true,
          }
      },  
      {
        name: "Analyzing",
        label: "Analyzing",
        options : {
          filter: true,
        }
      },
      {
        name: "Synthesizing",
        label: "Synthesizing",
        options: {
          filter: true,
        }
      },
      {
        name: "Forming Arguments (Structure)",
        label: "Forming Arguments (Structure)",
        options: {
          filter: true,
        }
      },
      {
        name: "Forming Arguments (Validity)",
        label: "Forming Arguments (Validity)",
        options: {
          filter: true,
        }
      }
    ]
    const options= {
      onRowsDelete: false,
      download: false,
      print: false,
      selectableRows: "none",
      selectableRowsHeader: false,
      responsive: "standard",
      tableBodyMaxHeight: "70%",
    };
    return (
      <>
       <MUIDataTable data={this.state.reportList ? this.state.reportList : []} columns={columns} options={options}/>
      </>
    )
  }
}
