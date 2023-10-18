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
    
     return (
          <>
          
           <p> These are the AssessmentStatus Dropdowns </p>
          </>
        )
    }
}
