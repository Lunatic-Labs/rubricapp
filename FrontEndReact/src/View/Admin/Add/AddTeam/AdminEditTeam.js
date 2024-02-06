import React, { Component } from 'react';
import Button from '@mui/material/Button';
import 'bootstrap/dist/css/bootstrap.css';
import CustomDataTable from '../../../Components/CustomDataTable';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {
  genericResourceGET,
  genericResourcePOST,
  genericResourcePUT
} from '../../../../utility.js';
import { IconButton, Typography } from '@mui/material';

class AdminEditTeam extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    var editTrue = this.props.addTeamAction === "Add" ?   <AddCircleOutlineIcon sx={{color:"black"}}/> : <RemoveCircleOutlineIcon sx={{color:"black"}}/>;
    var editFalse = this.props.addTeamAction !== "Add" ?  <AddCircleOutlineIcon sx={{color:"black"}}/>:  <RemoveCircleOutlineIcon sx={{color:"black"}}/>;

    const columns = [
      {
        name: "first_name",
        label: "First Name",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"300px"}},
          setCellProps: () => { return { width:"300px"} },
        }
      },
      {
        name: "last_name",
        label: "Last Name",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"300px"}},
          setCellProps: () => { return { width:"300px"} },
        }
      },
      {
        name: "email",
        label: "Email",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"300px"}},
          setCellProps: () => { return { width:"300px"} },
        }
      },
      {
        name: "user_id",
        label: "Add/Remove",
        options: {
          filter: true,
          sort: false,
          setCellHeaderProps: () => { return { align:"center", width:"130px", className:"button-column-alignment"}},
          setCellProps: () => { return { align:"center", width:"130px", className:"button-column-alignment"} },
          customBodyRender: (user_id) => {
            return (
              <IconButton
                onClick={() => {
                  this.saveUser(user_id);
                }}
              >
                  {this.state.userEdits[user_id] === undefined ? editTrue: editFalse}
              </IconButton>
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

        <CustomDataTable
          data={this.state.users ? this.state.users : []}
          columns={columns}
          options={options}
        />
      </div>
    )
  }
}

export default AdminEditTeam;