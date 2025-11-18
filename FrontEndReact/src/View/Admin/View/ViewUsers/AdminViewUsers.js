import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import ViewUsers from "./ViewUsers.js";
import AdminAddUser from "../../Add/AddUsers/AdminAddUser.js";
import ErrorMessage from "../../../Error/ErrorMessage.js";
import { genericResourceGET, parseRoleNames } from "../../../../utility.js";
import { Box } from "@mui/material";
import Loading from "../../../Loading/Loading.js";
import SuccessMessage from "../../../Success/SuccessMessage.js";

class AdminViewUsers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errorMessage: null,
      isLoaded: false,
      users: null,
      roles: null,
      prevUsersLength: 0,
      successMessage: null,
    };
  }

  fetchData = () => {
    var navbar = this.props.navbar;

    if (navbar.props.isSuperAdmin) {
      genericResourceGET(`/user?isAdmin=True`, "users", this);
    } else {
      genericResourceGET(
        `/user?course_id=${navbar.state.chosenCourse["course_id"]}`,
        "users",
        this
      );
    }

    genericResourceGET("/role?", "roles", this);
  };

componentDidMount() {
    this.fetchData();
    // Expose fetchData to navbar so it can be called after adding a user
    this.props.navbar.refreshUsersList = this.fetchData;
}

componentWillUnmount() {
    // Clean up the reference
    if (this.props.navbar.refreshUsersList) {
        delete this.props.navbar.refreshUsersList;
    }
}


componentDidUpdate(prevProps, prevState) {
    const navbar = this.props.navbar;
    const prevNavbar = prevProps.navbar;
    
    // Check if we were in add/edit mode before
    const wasAddingOrEditing = 
        prevNavbar.state.addUser === true || 
        (prevNavbar.state.user && typeof prevNavbar.state.user === "object" && prevNavbar.state.user.user_id);
    
    // Check if we're now viewing the roster
    const isNowViewingRoster = 
        navbar.state.addUser !== true && 
        (!navbar.state.user || typeof navbar.state.user !== "object" || !navbar.state.user.user_id);
    
    // Refetch when transitioning back from add/edit form to roster
    if (wasAddingOrEditing && isNowViewingRoster) {
        this.fetchData();
    }
}

fetchData = () => {
    var navbar = this.props.navbar;
    if (navbar.props.isSuperAdmin) {
        // Fixed: added opening parenthesis
        genericResourceGET(`/user?isAdmin=True`, "users", this);
    } else {
        genericResourceGET(
            `/user?course_id=${navbar.state.chosenCourse["course_id"]}`,
            "users",
            this
        );
    }
    genericResourceGET("/role?", "roles", this);
};

  setErrorMessage = (errorMessage) => {
    this.setState({ errorMessage: errorMessage });
    setTimeout(() => {
      this.setState({ errorMessage: null });
    }, 3000);
  };

  setSuccessMessage = (successMessage) => {
    this.setState({ successMessage: successMessage });
    setTimeout(() => {
      this.setState({ successMessage: null });
    }, 3000);
  };
  render() {
    const { errorMessage, isLoaded, users, roles, successMessage } = this.state;

    var navbar = this.props.navbar;
    var state = navbar.state;
    var user = state.user;
    var addUser = state.addUser;

    navbar.adminViewUsers = {};
    navbar.adminViewUsers.users = users ? users : [];
    navbar.adminViewUsers.roleNames = roles ? parseRoleNames(roles) : [];

    if (errorMessage) {
      return (
        <div className="container">
          <ErrorMessage fetchedResource={"Users"} errorMessage={errorMessage} />
        </div>
      );
    } else if (!isLoaded || !users || !roles) {
      return <Loading />;
    } else if (
      (!user || typeof user !== "object" || !user.user_id) &&
      addUser !== true
    ) {
      return (
        <Box>
          {successMessage !== null && (
            <div className="container">
              <SuccessMessage
                successMessage={successMessage}
                aria-label="adminViewUsersSuccessMessage"
              />
            </div>
          )}
          <ViewUsers
            navbar={navbar}
            onError={this.setErrorMessage}
            onSuccess={this.setSuccessMessage}
            refreshData={this.fetchData}
          />
        </Box>
      );
    } else {
      return (
        <Box>
          <AdminAddUser navbar={navbar} />
        </Box>
      );
    }
  }
}

export default AdminViewUsers;
