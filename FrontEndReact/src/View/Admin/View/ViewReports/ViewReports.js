import React, { Component } from 'react';
import MUIDataTable from 'mui-datatables';
import {BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar} from 'recharts';

// THE LINK FOR THIS LIBRARY 
// https://www.npmjs.com/package/mui-datatables#available-plug-ins

export default class ViewReports extends Component {
  render() {
    var courses = this.props.courses;
    console.log(courses); 

    return (
      <>
        {/* Bar chart where bars are vertical */}
        <h1>There are currently {courses.length} courses in the POGIL DB</h1>
        <BarChart width={1000} height={200} data={courses}>
            <Bar dataKey="course_id" fill="green" />
            <XAxis dataKey="course_name" />
            <YAxis />
        </BarChart>

        {/* Bar chart where bars are horizontal */}
        <BarChart width={1000} height={200} layout='vertical'  data={courses}>
            <XAxis type='number' domain={[0, 'dataMax']}/>
            <YAxis type='category' dataKey="course_number"/>
            <Bar dataKey="course_id" fill="green"/>
        </BarChart>

        {/* <MUIDataTable
          data={[[courses]]}
          columns={["Number of Courses"]}
        /> */}
      </>
    )
  }
}