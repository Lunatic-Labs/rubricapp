import React, { Component } from 'react';
import Button from '@mui/material/Button';
import 'bootstrap/dist/css/bootstrap.css';
import MUIDataTable from "mui-datatables";
import {
  genericResourceGET,
  genericResourcePOST,
  genericResourcePUT
} from '../../../../utility';
import { Typography } from '@mui/material';

class AdminEditTeam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      errorMessage: null,
      isLoaded: false,
      users: [],
      userEdits: {}
    };

    this.saveUser = (user_id) => {
      var userEdits = this.state.userEdits;

      for(var user = 0; user < this.state.users.length; user++) {
        if(this.state.users[user]["user_id"] === user_id) {
          if(userEdits[user_id] === undefined) {
            userEdits[user_id] = this.state.users[user];
          } else {
            delete userEdits[user_id];
          }
        }
      }

      this.setState({
        userEdits: userEdits
      });
    }

    this.sendUsers = () => {
      var users = [];
      Object.keys(this.state.userEdits).map((user_id) => {
        users = [...users, user_id - "0"];
        return user_id;
      });

      var navbar = this.props.navbar;
      var state = navbar.state;
      var team = state.team;
      var url = `/user?team_id=${team["team_id"]}&user_ids=${users}`;

      if(this.props.addTeamAction==="Add") {
        genericResourcePOST(url, this, users);
      } else {
        genericResourcePUT(url, this, users);
      }

      setTimeout(() => {
        navbar.setNewTab("TeamMembers");
      }, 1000);
    }
  }

  componentDidMount() {
    var navbar = this.props.navbar;
    var state = navbar.state;
    var team = state.team;

    genericResourceGET(
      `/user?team_id=${team["team_id"]}` + (this.props.addTeamAction==="Add" ? "": `&assign=${true}`),
      'users', this
    );
  }

  render() {
    var editTrue = this.props.addTeamAction === "Add" ? "Add": "Remove";
    var editFalse = this.props.addTeamAction !== "Add" ? "Add": "Remove";

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
          customBodyRender: (user_id) => {
            return (
              <button
                className="btn btn-primary"
                onClick={() => {
                  this.saveUser(user_id);
                }}
              >
                {this.state.userEdits[user_id] === undefined ?
                editTrue:
                editFalse
                }
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
      <div className='container'>
        <div className='d-flex justify-content-between align-items-center'>
          <Typography sx={{fontWeight:'700'}} variant="h5"> 
            {this.props.addTeamAction} Members
          </Typography>

          <Button
            id="saveTeam"
            className='mt-3 mb-3'
            style={{
              backgroundColor: "#2E8BEF",
              color: "white"
            }}
            onClick={() => {
              this.sendUsers();
            }}
          >
            Save Team
          </Button>
        </div>

        <MUIDataTable
          data={this.state.users ? this.state.users : []}
          columns={columns}
          options={options}
        />
      </div>
    )
  }
}

export default AdminEditTeam;