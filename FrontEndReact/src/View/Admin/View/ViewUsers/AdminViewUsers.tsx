import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewUsers from './ViewUsers';
import AdminAddUser from '../../Add/AddUsers/AdminAddUser';
import ErrorMessage from '../../../Error/ErrorMessage';
import { genericResourceGET, parseRoleNames } from '../../../../utility';
import { Box } from '@mui/material';
import Loading from '../../../Loading/Loading';
import SuccessMessage from '../../../Success/SuccessMessage';

/**
 * Creates an instance of the AdminViewUsers component.
 * 
 * @constructor
 * @param {Object} props - The properties passed to the component.
 * @property {Object} props.navbar - The navbar object containing state and methods for navigation.
 * 
 * @property {string|null} state.errorMessage - The error message to display if an error occurs during data fetching.
 * @property {boolean} state.isLoaded - Indicates whether the data has been loaded.
 * @property {Array|null} state.users - The list of users in the course or system.
 * @property {Array|null} state.roles - The list of roles available in the system.
 * @property {number} state.prevUsersLength - The previous length of the users array for comparison.
 * @property {string|null} state.successMessage - The success message to display after successful operations.
 * 
 * Conditional Rendering:
 * - if navbar.state.user or navbar.state.addUser is set, renders AdminAddUser component.
 * - else, renders ViewUsers component with fetched users and roles.
 */


interface AdminViewUsersState {
    errorMessage: any;
    isLoaded: boolean;
    users: any;
    roles: any;
    prevUsersLength: number;
    successMessage: any;
}

class AdminViewUsers extends Component<any, AdminViewUsersState> {
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
    /**
     * @method fetchData - Fetches users and roles data from the server.
     * 
     * == USER DATA FETCHING ==
     * API Endpoint: /user
     * HTTP Method: GET
     * 
     * Parameters => Conditional
     * SUPER ADMIN:
     * @param {boolean} isAdmin=True - Fetches all admin users across the system.
     *      - Data fetched: All users with admin privileges.
     * 
     * ADMIN/INSTRUCTOR:
     * @param {string} course_id - The ID of the course to fetch users for.
     *      - Data fetched: All users enrolled in the specified course.
     * 
     * == ROLE DATA FETCHING ==
     * API Endpoint: /role
     * HTTP Method: GET
     * 
     * Parameters:
     * None
     * 
     * Response:
     * - List of roles available in the system.
     * 
     * TODO: Optimizations
     * - Optimize data fetching to reduce redundant calls.
     * - the roles data could be cached if it doesn't change often.
     * 
     */
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
    /**
     * @method componentDidMount - Lifecycle method called when the component is mounted.
     * Initiates data fetching for users and roles.
     */

    componentDidMount() {
        this.fetchData();
    }

    /**
     * @method componentDidUpdate - Lifecycle method called when the component is updated.
     * Compares the current users length with the previous length.
     * If there is a change, it triggers data fetching to refresh the user list.
     * 
     * Potential Issue:
     * - This could lead to an infinite loop if not handled carefully.
     *      - length changes > fetchData > setState > componentDidUpdate > length changes...
     */
    componentDidUpdate(){
      if (this.state.users && this.state.users.length !== this.state.prevUsersLength) {
        this.setState({ prevUsersLength: this.state.users.length });
        this.fetchData();
      }
    }

    /**
    * @method setErrorMessage - Sets an error message in the component state.
    * @param {string} errorMessage - The error message to set.
    */
    setErrorMessage = (errorMessage: any) => {
      this.setState({errorMessage: errorMessage});
      setTimeout(() => {
          this.setState({errorMessage: null,});
      }, 3000);
    }
    
    /**
    * @method setSuccessMessage - Sets a success message in the component state.
    * @param {string} successMessage - The success message to set.
    */
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
