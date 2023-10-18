import React, { Component } from 'react';
import MUIDataTable from 'mui-datatables';

// THE LINK FOR THIS LIBRARY 
// https://www.npmjs.com/package/mui-datatables#available-plug-ins

export default class ViewReport extends Component {
  render() {
    var allRatings = [];
    var rating = {};
    this.props.ratings.map((currentRating) => {
      rating["student_name"] = currentRating["first_name"] + " " + currentRating["last_name"];
      Object.keys(currentRating["rating_observable_characteristics_suggestions_data"]).map((category) => {
        return rating[category] = currentRating["rating_observable_characteristics_suggestions_data"][category]["rating"];
      });
      return allRatings.push(rating);
    });
    const columns = [
      {
        name: "student_name",
        label: "Student Name",
        options: {
          filter: true,
        }
      },  
      // {
      //   name: "feedback_time_lag",
      //   label: "Feedback Time Lag",
      //   options: {
      //     filter: true,
      //   }
      // },
      {
        name: "Identifying the Goal",
        label: "Identifying the Goal",
        options: {
          filter: true,
        }
      },  
      {
        name: "Evaluating",
        label: "Evaluating",
        options: {
          filter: true,
          customBodyRender: (
            (evaluating) => {
              return(
                <p>{evaluating["rating"]}</p>
              )
            }
          )
        }
      },  
      {
        name: "Analyzing",
        label: "Analyzing",
        options : {
          filter: true,
          customBodyRender: (
            (analyzing) => {
              return(
                <p>{analyzing["rating"]}</p>
              )
            }
          )
        }
      },  
      {
        name: "Synthesizing",
        label: "Synthesizing",
        options: {
          filter: true,
          customBodyRender: (
            (synthesizing) => {
              return(
                <p>{synthesizing["rating"]}</p>
              )
            }
          )
        }
      }, 
      {
        name: "Forming Arguments (Structure)",
        label: "Forming Arguments (Structure)",
        options: {
          filter: true,
          customBodyRender: (
            (forming_arguments_structure) => {
              return(
                <p>{forming_arguments_structure["forming_arguments_structure"]}</p>
              )
            }
          )
        }
      },  
      {
        name: "Forming Arguments (Validity)",
        label: "Forming Arguments (Validity)",
        options: {
          filter: true,
          align: "center"
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
       <MUIDataTable data={allRatings} columns={columns} options={options}/>
      </>
    )
  }
}
