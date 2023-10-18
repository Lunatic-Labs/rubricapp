import React, { Component } from 'react';
import MUIDataTable from 'mui-datatables';
import { API_URL } from '../../../../App';

// THE LINK FOR THIS LIBRARY 
// https://www.npmjs.com/package/mui-datatables#available-plug-ins

export default class AssessmentStatus extends Component {
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
              console.log(
                result['content']['completed_assessments'][0]
              );
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
        //var reports = this.props.reports;
        const ta_name= [
            {
                name: "ta",
                label: "TA Name",
                options: {
                    filter: true,
                }
            },
        ]
        const columns = [
          {
            name: "ta_name",
            label: "TA Name",
            options: {
              filter: true,
            }
          },  
          {
            name: "ta_evaluation #1",
            label: "TA Evaluation #1",
            options: {
              filter: true,
            }
          },
          {
            name: "ta_evaluation #2",
            label: "TA Evaluation #2",
            options: {
              filter: true,
            }
          },  
          {
            name: "ta_evaluation #3",
            label: "TA Evaluation #3",
            options: {
              filter: true,
            }
          },  
          {
            name: "ta_evaluation #4",
            label: "TA Evaluation #4",
            options: {
              filter: true,
            }
          },
          {
            name: "ta_evaluation #5",
            label: "TA Evaluation #5",
            options: {
            filter: true,
            }
          },
          {
            name: " ",
            label: " ",
            options: {
              filter: true,
            }
          },
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
           <MUIDataTable data={ta_name} columns={columns} options={options}/>
          </>
        )
    }
}
