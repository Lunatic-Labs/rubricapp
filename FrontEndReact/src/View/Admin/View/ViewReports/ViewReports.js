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
          "number" : 8
        },
        {
          "rating" : 2,
          "number" : 14
        },
        {
          "rating" : 3,
          "number" : 35
        },
        {
          "rating" : 4,
          "number" : 14
        },
        {
          "rating" : 5,
          "number" : 8
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
    var improvement_data = {
      improvements: [
        {
          "improvement" : "Write down the information you think is needed to address the situation",
          "number" : 18
        },
        {
          "improvement" : "List the factors (if any) that may limit the feasability of some possible conclusions",
          "number" : 16
        },
        {
          "improvement" : "Highlight or clearly state the question to be addressed or type of conclusion that must be reached",
          "number" : 19
        },
        {
          "improvement" : "Review the instructions or general goal of the task",
          "number" : 12
        },

      ]
    }
  
      

return (
      <>
        {/* Bar chart where bars are vertical */}
        <h1>There are currently {courses.length} courses in the POGIL DB</h1>
        <BarChart width={400} height={250} data={ratings_data["ratings"]} barCategoryGap={0.5}>
            <XAxis dataKey="rating" />
            <YAxis />
            <Bar dataKey= "number" fill = "#2e8bef"/>
        </BarChart>

        {/* Bar chart where bars are horizontal */}
        <BarChart width={800} height={250} layout='vertical'  data={improvement_data["improvements"]}>
            <XAxis type='number' domain={[0, 25]}/>
            <YAxis width={350} type='category' dataKey="improvement"/>
            <Bar dataKey="number" fill="#2e8bef"/>
            <CartesianGrid horizontal= {false} />
        </BarChart>

        <BarChart width={800} height={200} layout='vertical'  data={characteristic_data["characteristics"]}>
            <XAxis type='number' domain={[0, 25]}/>
            <YAxis width={350} type='category' dataKey="characteristic"/>
            <Bar dataKey="number" fill="#2e8bef"/>
            <CartesianGrid horizontal= {false}/>
        </BarChart>


        {/* <MUIDataTable
          data={[[courses]]}
          columns={["Number of Courses"]}
        /> */}
      </>
    )
  }
}