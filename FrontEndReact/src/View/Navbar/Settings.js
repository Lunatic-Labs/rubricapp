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
            darkMode: false
        };
    }

    componentDidMount() {
        //var navbar = this.props.navbar;
        //var state = navbar.state;

        const cookies = new Cookies();
        const user = cookies.get('user');

        if (user !== null) {

            let promise;
            let userData;

            promise = genericResourceGET(
                `/user`,
                "users",
                this
            );
            promise.then(result => {
                if (result !== undefined && result["users"] !== null) {
                    userData = result["users"];
                    
                    this.setState({
                        isLoaded: true,
                        user: userData["user_id"],
                        darkMode: userData["user_dark_mode"]
                    }, () => {
                        // This callback runs AFTER state is updated
                        if (this.state.darkMode) {
                            document.body.classList.add('mode');
                        } else {
                            document.body.classList.remove('mode');
                        }
                    });

                    
                }
            }).catch(error => {
                console.error("Error fetching user data:", error);
                // Fallback to user object
                this.setState({
                    isLoaded: false,
                    user: user,
                    darkMode: user["user_dark_mode"] || false,
                }, () => {
                    // Apply dark mode in callback here too
                    if (this.state.darkMode) {
                        document.body.classList.add('mode');
                    } else {
                        document.body.classList.remove('mode');
                    }
                });

                //if (user["user_dark_mode"]) {
                //    document.body.classList.add('mode');
                //}
            });
        }
    }

    handleChange = () => {
        const newDarkMode = !(this.state.darkMode);
        const user_id = this.state["user"];
        
        let promise;
        var body = JSON.stringify({
            "user_id": user_id,
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

        promise = genericResourcePUT(
            `/user`,
            this, 
            body
        );

        promise.then(result => {
            if (result !== undefined && result.errorMessage === null) {
                // Update navbar state if needed
                this.state.darkMode = newDarkMode;
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

    render() {
        const { isLoaded, user, darkMode } = this.state;

        if (!isLoaded || !user ) {
            return(
                <Loading />
            );
        }

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