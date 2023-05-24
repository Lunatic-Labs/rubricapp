import React, { Component } from "react"
import 'bootstrap/dist/css/bootstrap.css';
import MUIDataTable from "mui-datatables";
// import EditUserModal from "./EditUserModal";

// THE LINK FOR THIS LIBRARY 
// https://www.npmjs.com/package/mui-datatables#available-plug-ins

export default class ViewTeams extends Component{
  constructor(props) {
    super(props);
    this.state = {
      roles: null
    }
    this.getRoleName = (role_id) => {
      var role_name = "";
      if(this.state.roles!==null && role_id!==-1) {
        role_name = this.state.roles[0][role_id-1]["role_name"];
      }
      return role_name;
    }
  }
  componentDidMount() {
    fetch("http://127.0.0.1:5000/api/role")
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({roles: result["content"]["roles"]});
      }
    )
  }
  render() {
    var users = this.props.users;
    const columns = [
      // The name is the accessor for the json object. 
      {
        name: "first_name",
        label: "First Name",
        options: {
          filter: true,
        }
      },   
      {
        name: "last_name",
        label: "Last Name",
        options: {
          filter: true,
        }
      },  
      {
        name: "role_id",
        label: "Role",
        options: {
          filter: true,
          customBodyRender: (role_id) => {
            var role_name = this.getRoleName(role_id);
            return (
              <p className="role_p pt-3" variant="contained">{ role_name }</p>
            )
          }
        }
      }, 
      {
        name: "lms_id",
        label: "LMS ID",
        options: {
          filter: true,
        }
      }, 
      {
        name: "owner_id",
        label: "Team Number",
        options: {
          filter: true,
          customBodyRender: (value) => {
            return (
                <select name="cars" id="cars">
                <option value="volvo">1</option>
                <option value="saab">2</option>
                <option value="mercedes">3</option>
                <option value="audi">4</option>
              </select>
            )
          },
        }
      }
    ]
    
    const options = {
      onRowsDelete: false,
      download: false,
      print: false,
      selectableRows: "none",
      selectableRowsHeader: false,
      // There are different options for the responsiveness, I just chose this one. 
      // responsive: "standard"
      // responsive: "simple"
      responsive: "vertical"
    };
    return (
      <>
        <MUIDataTable data={users[0]} columns={columns} options={options}/>
      </>
    )
  }
}