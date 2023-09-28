import React, { Component } from 'react';
import MUIDataTable from 'mui-datatables';
// import {BarChart}  from '@mui/x-charts/BarChart';

// THE LINK FOR THIS LIBRARY 
// https://www.npmjs.com/package/mui-datatables#available-plug-ins

export default class ViewReports extends Component {
  render() {
    var courses = this.props.courses;

    const options = {
      filterType: 'checkbox',
      justifyContent: 'center'
    };

    return (
      <>
        <h1>There are currently {courses} courses in the POGIL DB</h1>
        {/* <BarChart
          xAxis={[{data: ['Courses'] }]}
          series={[ { data: [courses] }]}
          width={500}
          height={300}
        /> */}
        <MUIDataTable
          data={[[courses]]}
          columns={["Number of Courses"]}
          options={options}
        />
      </>
    )
  }
}