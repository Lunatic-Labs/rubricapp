import React, { Component } from 'react';
import MUIDataTable from 'mui-datatables';

export default class ViewTAEval extends React.PureComponent {
  // constructor(props) {
  //   super(props);
  //   // STEP 1: create a container <div>
  //   this.containerEl = document.createElement('div');
  //   this.externalWindow = null;
  // }
  
  // render() {
  //   // STEP 2: append props.children to the container <div> that isn't mounted anywhere yet
  //   return ReactDOM.createPortal(this.props.children, this.containerEl);
  // }

  // componentDidMount() {
  //   // STEP 3: open a new browser window and store a reference to it
  //   this.externalWindow = window.open('', '', 'width=600,height=400,left=200,top=200');

  //   // STEP 4: append the container <div> (that has props.children appended to it) to the body of the new window
  //   this.externalWindow.document.body.appendChild(this.containerEl);
  // }

  // componentWillUnmount() {
  //   // STEP 5: This will fire when this.state.showWindowPortal in the parent component becomes false
  //   // So we tidy up by closing the window
  //   this.externalWindow.close();
  // }
}

// export default class ViewTAEval extends Component {
//   constructor(props) {
//     super(props);
//   }
//   componentDidMount() {
//     window.open('','_blank','height=400,width=1000');
//   }

//   render() {
    
//     var courses = this.props.courses;
//     const columns = [
//       {
//         name: "course_name",
//         label: "Course Name",
//         options: {
//           filter: true,
//         }
//       },   
//       {
//         name: "course_number",
//         label: "Course Number",
//         options: {
//           filter: true,
//         }
//       },  
//       {
//         name: "term",
//         label: "Term",
//         options: {
//           filter: true,
//         }
//       },  
//       {
//         name: "year",
//         label: "Year",
//         options: {
//           filter: true,
//           }
//       }, 
//       // The admin_id is the user that is logged in, hence we do not need to show to the logged in user!
//       // {
//       //   name: "admin_id",
//       //   label: "Admin ID",
//       //   options: {
//       //     filter: true,
//       //     }
//       // }, 
//     //   {
//     //     name: "use_tas",
//     //     label: "Use Tas",
//     //     options : {
//     //       filter: true,
//     //       customBodyRender: (value) => {
//     //         return(
//     //           <p className="pt-3" variant="contained">{ value===null ? "N/A" : (value ? "Yes" : "No") }</p>
//     //         )
//     //       }
//     //     }
//     //   },
//     //   {
//     //     name: "use_fixed_teams",
//     //     label: "Fixed Teams",
//     //     options: {
//     //       filter: true,
//     //       customBodyRender: (value) => {
//     //         return(
//     //           <p className='pt-3' variant="contained">{value===null ? "N/A": (value ? "Yes":"No")}</p>
//     //         )
//     //       }
//     //     }
//     //   },
//     //   {
//     //     name: "course_id",
//     //     label: "EDIT",
//     //     options: {
//     //       filter: true,
//     //       sort: false,
//     //       customBodyRender: (value) => {
//     //         return (
//     //           <button
//     //             id={value}
//     //             className="editCourseButton btn btn-primary"
//     //             onClick={
//     //               () => {
//     //                 this.props.setAddCourseTabWithCourse(courses[0], value, "AddCourse")
//     //                 //console.log(courses[0])
//     //               }
//     //             }>
//     //               Edit
//     //             </button>
//     //         )
//     //       },    
//     //     }
//     //   },
//     //   {
//     //     name: "course_id",
//     //     label: "VIEW",
//     //     options: {
//     //       filter: true,
//     //       sort: false,
//     //       customBodyRender: (value) => {
//     //         return (
//     //             //We need to make this button to take us to the Admin Dashboard for a specific course. The tables should only display the teams and assesment tasks associated to that course
//     //             <button
//     //               id={value}
//     //               className="editCourseButton btn btn-primary"
//     //               onClick={() => {
//     //                 // this.props.setAddCourseTabWithCourse(courses[0], value, "AdminDashboard")
//     //                 this.props.setAddCourseTabWithCourse(courses[0], value, "Users")
//     //               }}>
//     //               View
//     //             </button>
//     //         )
//     //       },    
//     //     }
//     //   }
//     ]
//     const options = {
//       onRowsDelete: false,
//       download: false,
//       print: false,
//       selectableRows: "none",
//       selectableRowsHeader: false,
//       responsive: "standard",
//       tableBodyMaxHeight: "70%"
//     };
//     return (
//       <>
//         <MUIDataTable data={[]} columns={columns} options={options}/>
//       </>
//     )
//   }
// }