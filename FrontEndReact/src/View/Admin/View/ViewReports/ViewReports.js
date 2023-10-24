import React, { Component } from 'react';
import MUIDataTable from 'mui-datatables';
import {BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar} from 'recharts';

// THE LINK FOR THIS LIBRARY 
// https://www.npmjs.com/package/mui-datatables#available-plug-ins

export default class ViewReports extends Component {
  render() {
    var courses = this.props.courses;
    console.log(courses); 

    var ratings_data = {
      ratings: [
        {
          "rating" : 1,
          "number" : 34
        },
        {
          "rating" : 2,
          "number" : 27
        },
        {
          "rating" : 3,
          "number" : 58
        },
        {
          "rating" : 4,
          "number" : 20
        },
        {
          "rating" : 5,
          "number" : 37
        },
      ]
    }
  var characteristic_data = {
    characteristics: [
      {
        "characteristic" : "Identified the general types of data or information needed to address the question.",
        "number" : 16
      },
      {
        "characteristic" : "Identified any situational factors that may be important for addressing the question or situation.",
        "number" : 19
      },{
        "characteristic" : "Identified the question that needed to be answered or the situation that needed to be addressed.",
        "number" : 12
      },
    ]
  }
      

return (
      <>
        {/* Bar chart where bars are vertical */}
        <h1>There are currently {courses.length} courses in the POGIL DB</h1>
        <BarChart width={500} height={200} data={ratings_data["ratings"]} barCategoryGap={0.5}>
            <XAxis dataKey="rating" />
            <YAxis />
            <Bar dataKey= "number" fill = "blue"/>
        </BarChart>

        {/* Bar chart where bars are horizontal */}
        <BarChart width={1000} height={200} layout='vertical'  data={courses}>
            <XAxis type='number' domain={[0, 'dataMax']}/>
            <YAxis type='category' dataKey="course_number"/>
            <Bar dataKey="course_id" fill="green"/>
        </BarChart>

        <BarChart width={500} height={200} layout='vertical'  data={characteristic_data["characteristics"]}>
            <XAxis type='number' domain={[0, '25']}/>
            <YAxis type='category' dataKey="characteristic"/>
            <Bar dataKey="number" fill="green"/>
        </BarChart>


        {/* <MUIDataTable
          data={[[courses]]}
          columns={["Number of Courses"]}
        /> */}
      </>
    )
  }
}