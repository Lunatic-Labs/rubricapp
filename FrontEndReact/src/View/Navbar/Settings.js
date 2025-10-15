import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Box, Typography, Button } from '@mui/material';
import Cookies from 'universal-cookie';
import { genericResourcePUT, genericResourceGET } from '../../utility.js';
import Loading from "../Loading/Loading.js";

// all 'mode' related things are for testing and should be removed afterwards.
class Settings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoaded: null,
            errorMessage: null,
            user: null,
            darkMode: false                 // add isLoaded
        };

        //console.log(props);

        //this.swithcDarkMode = () => {
        //    var navbar = this.props.navbar;

        //    genericResourcePUT(
        //        `/user?uid=${navbar.state.user["user_id"]}&user_dark_mode=${navbar.state.setDarkMode["user_dark_mode"]}`,
        //        this,
        //        {
        //            userId: navbar.state.user["user_id"],
        //            userDarkModePreferance: navbar.state.setDarkMode["user_dark_mode"]
        //        });
        //}
    }

    componentDidMount() {
        const cookies = new Cookies();
        const user = cookies.get('user'); //used to be cookieUser

        //var navbar = this.props.navbar;
        //var state = navbar.state;
        //var user = state.user;

        //console.log(user);
        //console.log(user.user_id);
        //console.log("printed!");

        //if (user === null && cookieUser) {
        //    user = cookieUser["user_id"];
        //}

        if (user !== null) {

            let promise;
            let userData;

            promise = genericResourceGET(
                `/user`,
                "users",
                this
            );
            promise.then(result => {
                //console.log(result, result["users"], result["users"][0]);
                if (result !== undefined && result["users"] !== null) {
                    console.log(result);
                    userData = result["users"];
                    console.log(userData);
                    
                    this.setState({
                        isLoaded: true,
                        user: userData["user_id"] || 1,
                        darkMode: userData["user_dark_mode"] || true
                    });



                    if (this.state.darkMode) {
                        document.body.classList.add('mode');
                    } else {
                        document.body.classList.remove('mode');
                    }
                }
            }).catch(error => {
                console.error("Error fetching user data:", error);
                // Fallback to user object
                this.setState({
                    isLoaded: false,
                    user: user,
                    darkMode: user["user_dark_mode"] || false,
                });

                if (user["user_dark_mode"]) {
                    document.body.classList.add('mode');
                }
            });

            //this.setState({
            //    user: user,
            //    darkMode: user["user_dark_mode"] || false,
            //});

            //if (user["user_dark_mode"]) {
            //    document.body.classList.add('mode');
            //}

        }
        console.log(this.state);
    }

    handleChange = () => {
        const newDarkMode = !this.state.darkMode;
        var navbar = this.props.navbar;
        let promise;
        var body = JSON.stringify({
            "user_id": navbar.state.user["user_id"],
            "user_dark_mode": newDarkMode
        });

        // Update state
        this.setState({
            darkMode: newDarkMode
        });

        // Toggle dark mode class on body
        if (newDarkMode) {
            document.body.classList.add('mode');
        } else {
            document.body.classList.remove('mode');
        }

        // Update in database
        promise = genericResourcePUT(
            `/user`,
            this, body
        );
        promise.then(result => {
            console.log(result);
            if (result !== undefined && result.errorMessage === null) {
                // Update navbar state if needed
                if (navbar.state.user) {
                    navbar.state.user["user_dark_mode"] = newDarkMode;
                }
            }
        }).catch(error => {
            console.error("Error updating dark mode:", error);
            // Revert on error
            this.setState({ darkMode: !newDarkMode });
            if (!newDarkMode) {
                document.body.classList.add('mode');
            } else {
                document.body.classList.remove('mode');
            }
        });
    }


    // add a field to the user table to store weather or not 'dark mode' is enabled.
    render() {
        const { isLoaded, errorMessage, user, darkMode } = this.state;

        if (!isLoaded || !user ) {
            return(
                <Loading />
            );
        }

        console.log("Settings render - user:", user);
        console.log("Settings render - darkMode:", darkMode);

        return (
            <>
                <Box className="content-spacing">
                    <Typography sx={{fontWeight:'700'}} variant="h5" aria-label="Settings">
                        Settings
                    </Typography>
                </Box>
                {user && (
                    <Box className="card-spacing">
                        <Box className="form-position">
                            <Box className="card-style">
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
                                    <Typography variant="h6" sx={{ fontWeight: '600' }}>
                                        Appearance
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <Typography>
                                            Dark Mode: {darkMode ? 'On' : 'Off'}
                                        </Typography>
                                        <Button
                                            onClick={this.handleChange}
                                            className="primary-color"
                                            variant="contained"
                                            aria-label="toggleDarkModeButton"
                                        >
                                            Toggle Dark Mode
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                )}
            </>
        );
    }
}

export default Settings;