import React, { Component } from 'react';
import Button from '@mui/material/Button';
import 'bootstrap/dist/css/bootstrap.css';
import MUIDataTable from "mui-datatables";
import { API_URL } from '../../../../App';
import { genericResourcePUT, genericResourceGET } from '../../../../utility';

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
    const { usersEdit, users } = this.state;

    const info = {
        team_id: this.props.team.team_id,
        usersEdit,
        users
    };
    let body = JSON.stringify({
      "team_id": info.team_id,
      "userEdits": usersEdit
  })
    genericResourcePUT('/team_user', this, body);

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
    genericResourceGET(`/user?course_id=${this.props.chosenCourse["course_id"]}`, 'users', this);
    // We need to customly update usersEdit with only the user_ids!
    // const usersEdit = result.content.users[0].map(user => user.user_id);
    // this.setState({
    //   usersEdit: usersEdit
    // });
    genericResourceGET(`/user?team_id=${this.props.team["team_id"]}`, 'users', this);
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
          customBodyRender: (value) => {
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