import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Box, Typography, Switch, FormControlLabel } from '@mui/material';
import Cookies from 'universal-cookie';
import { genericResourcePUT, genericResourceGET } from '../../utility.js';
import Loading from "../Loading/Loading.js";

// 'mode' refers to the darkmode classlist in the SBStyles.css, by adding 'mode' to the
// document body, the darkmode css will be applied.

// currently settings has only one option and that is to toggle darkmode, more options
// will be added later as the app grows.
class Settings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoaded: null,
            errorMessage: null,
            user: null,
            darkMode: false         // darkmode is not nullable, the deafult state is false
        };
    }

    componentDidMount() {
        const cookies = new Cookies();
        const user = cookies.get('user');

        if (user !== null) {

            let promise;            // promise is used because we do not yet have the 'data' from the backend
            let userData;           // promise tells the app that it will recieve data

            // get all the neccessary resources from the backend, the 'user' from the 'users' array.
            promise = genericResourceGET(
                `/user`,
                "users",
                this
            );

            promise.then(result => {
                if (result !== undefined && result["users"] !== null) {
                    userData = result["users"];

                    // user data is now set by the result for 'users' and the state is changed
                    // to match the users preferance (false or true).
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
                    // Apply dark mode in callback
                    if (this.state.darkMode) {
                        document.body.classList.add('mode');
                    } else {
                        document.body.classList.remove('mode');
                    }
                });
            });
        }
    }

    // will handle any changes within the change, currently only used for detecting if user
    // has set darkmode.
    
    // for future refernace handleChange should be changed to handleDarkMode, as not to conflict with
    // any other 'changes' on the page.
    handleChange = () => {
        const newDarkMode = !(this.state.darkMode);     // take the users current prefernace and invert it
        const user_id = this.state["user"];
        
        let promise;            // promise that data will be provided later

        var body = JSON.stringify({
            "user_id": user_id,
            "user_dark_mode": newDarkMode
        });

        // Set the state (the updated darkmode preferance which will be put into the backend later.
        this.setState({
            darkMode: newDarkMode
        });

        // Toggle dark mode class on body (darkmode will now be applied).
        if (newDarkMode) {
            document.body.classList.add('mode');
        } else {
            document.body.classList.remove('mode');
        }

        // Put the new preferance for darkmode into the user backend.
        promise = genericResourcePUT(
            `/user_settings`,
            this, 
            body
        );

        promise.then(result => {
            if (result !== undefined && result.errorMessage === null) {
                // Update the state
                this.state.darkMode = newDarkMode; // warning to not mutate state directly
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
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={darkMode}
                                                    onChange={this.handleChange}
                                                    aria-label="toggle dark mode"
                                                />
                                            }
                                            label="Dark Mode"
                                        />
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