import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewUsers from './ViewUsers';
import AdminAddUser from '../../Add/AddUsers/AdminAddUser';
import ErrorMessage from '../../../Error/ErrorMessage';
import { genericResourceGET, parseRoleNames } from '../../../../utility';
import { Box } from '@mui/material';
import Loading from '../../../Loading/Loading';
import SuccessMessage from '../../../Success/SuccessMessage';



class AdminViewUsers extends Component {
    props: any;
    constructor(props: any) {
        super(props);

        this.state = {
            errorMessage: null,
            isLoaded: false,
            users: null,
            roles: null,
            prevUsersLength: 0,
            successMessage: null
        }
    }

    fetchData = () => {
        var navbar = this.props.navbar;

        if(navbar.props.isSuperAdmin) {
            genericResourceGET(
                `/user?isAdmin=True`, "users", this);

        } else {
            genericResourceGET(
                `/user?course_id=${navbar.state.chosenCourse["course_id"]}`, 
                "users", this);
        }

        genericResourceGET(
            "/role?", "roles", this); 
    }

    componentDidMount() {
        this.fetchData();
    }

    componentDidUpdate(){
      if (this.state.users && this.state.users.length !== this.state.prevUsersLength) {
        this.setState({ prevUsersLength: this.state.users.length });
        this.fetchData();
      }
    }

    setErrorMessage = (errorMessage: any) => {
      this.setState({errorMessage: errorMessage});
      setTimeout(() => {
          this.setState({errorMessage: null,});
      }, 3000);
    }

    setSuccessMessage = (successMessage: any) => {
      this.setState({successMessage: successMessage});
      setTimeout(() => {
          this.setState({successMessage: null,});
      }, 3000);
    }
    render() {
        const {
            errorMessage,
            isLoaded,
            users,
            roles,
            successMessage
        } = this.state;

        var navbar = this.props.navbar;
        var state = navbar.state;
        var user = state.user;
        var addUser = state.addUser;

        navbar.adminViewUsers = {};
        navbar.adminViewUsers.users = users ? users : [];
        navbar.adminViewUsers.roleNames = roles ? parseRoleNames(roles) : [];

        if (errorMessage) {
            return(
                <div className='container'>
                    <ErrorMessage
                        fetchedResource={"Users"}
                        errorMessage={errorMessage}
                    />
                </div>
            )

        } else if (!isLoaded || !users || !roles) {
            return(
                <Loading />
            )

        } else if (user===null && addUser===null) {

            return(
                <Box>
                    {successMessage !== null && 
                        <div className='container'>
                          <SuccessMessage 
                            successMessage={successMessage}
                            aria-label="adminViewUsersSuccessMessage"
                          />
                        </div>
                    }
                    <ViewUsers
                        navbar={navbar}
                        onError={this.setErrorMessage}
                        onSuccess={this.setSuccessMessage}
                        refreshData={this.fetchData}
                    />
                </Box>
            )

        } else {
            return(
                <Box>
                    <AdminAddUser
                        navbar={navbar}
                    />
                </Box>
            )
        }
    }
}

export default AdminViewUsers;
