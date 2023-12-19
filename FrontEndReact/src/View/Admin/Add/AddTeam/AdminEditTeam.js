import React, { Component } from 'react';
import Button from '@mui/material/Button';
import 'bootstrap/dist/css/bootstrap.css';
import MUIDataTable from "mui-datatables";

// TODO: Currently not used, however needs to be updated with navbar reference if later used!
class AdminEditTeam extends Component {
  constructor(props) {
    super(props);
    this.saveTeam = this.saveTeam.bind(this);
    this.state = {
      error: null,
      errorMessage: null,
      isLoaded: false,
      users: [],
      usersEdit: [],
      userActions: []
    };
  }

  saveTeam = () => {
    var navbar = this.props.navbar;
    var state = navbar.state;
    var team = state.team;
    var team_id = team.team_id;
    var usersEdit = this.state.usersEdit;

    fetch('http://127.0.0.1:5000/api/team_user', {
      method: "PUT",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          "team_id": team_id,
          "userEdits": usersEdit
      })
    })
    .then(res => res.json())
    .then(result => {
      if (result["success"] === false) {
        this.setState({
          isLoaded: true,
          errorMessage: result["message"]
        });
      } else {
        this.setState({
          isLoaded: true,
          info: result['content']['team_user'][0]
        });
      }
    })
    .catch(error => {
      this.setState({
        isLoaded: true,
        error: error
      });
    });
  };

  userRemove(user_id) {
    this.setState(prevState => {
      const usersEdit = prevState.usersEdit.filter(user => user !== user_id);
      return { usersEdit };
    });
  }

  userAdd(user_id) {
    this.setState(prevState => {
      const usersEdit = [...prevState.usersEdit, user_id];
      return { usersEdit };
    });
  }

  componentDidMount() {
    var navbar = this.props.navbar;
    var state = navbar.state;
    var chosenCourse = state.chosenCourse;
    fetch(`http://127.0.0.1:5000/api/user?course_id=${chosenCourse["course_id"]}`)
      .then(res => res.json())
      .then(result => {
        if (result["success"] === false) {
          this.setState({
            isLoaded: true,
            errorMessage: result["message"]
          });
        } else {
          this.setState({
            isLoaded: true,
            users: result['content']['users'][0]
          });
        }
      })
      .catch(error => {
        this.setState({
          isLoaded: true,
          error: error
        });
      });
    var team = state.team;
    fetch(`http://127.0.0.1:5000/api/user?team_id=${team["team_id"]}`)
      .then(res => res.json())
      .then(result => {
        if (result.success === false) {
          this.setState({
            errorMessage: result.message
          });
        } else {
            const usersEdit = result.content.users[0].map(user => user.user_id);
          this.setState({
            usersEdit: usersEdit
          });
        }
      })
      .catch(error => {
        this.setState({
          error: error
        });
      });
  }

  render() {
    const columns = [
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
        name: "email",
        label: "Email",
        options: {
          filter: true,
        }
      },
      {
        name: "user_id",
        label: "Add/Remove",
        options: {
          filter: true,
          sort: false,
          customBodyRender: (value, tableMeta, updateValue) => {
            const user_id = value;
            const isInTeam = this.state.usersEdit.includes(user_id);

            return (
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (isInTeam) {
                    this.userRemove(user_id);
                  } else {
                    this.userAdd(user_id);
                  }
                }}
              >
                {isInTeam ? "Remove" : "Add"}
              </button>
            );
          }
        }
      }
    ];

    const options = {
      onRowsDelete: false,
      download: false,
      print: false,
      selectableRows: "none",
      selectableRowsHeader: false,
      responsive: "vertical",
      tableBodyMaxHeight: "500px"
    };
    return (
        <>
        <div className='container'>
            <h1
                className='mt-5'
            >
                Edit Team
            </h1>
        </div>
        <MUIDataTable
            data={this.state.users ? this.state.users : []}
            columns={columns}
            options={options}
        />
        <Button
          id="saveTeam"
          style={{
              backgroundColor: "#2E8BEF",
              color: "white",
              margin: "10px 5px 5px 0"
          }}
          onClick={this.saveTeam}
        >
          Save Team
        </Button>
        </>
    )
  }
}


export default AdminEditTeam;