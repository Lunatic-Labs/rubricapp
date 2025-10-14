import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Box, Typography, Switch, FormControlLabel } from '@mui/material';
import Cookies from 'universal-cookie';

// all 'mode' related things are for testing and should be removed afterwards.

const genericResourcePUT = (url, context, data) => {
  return fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(response => response.json());
};

class Settings extends Component {
    constructor(props) {
        super(props)

        this.state = {
            user: null,
            errorMessage: null,
            darkMode: false
        };

        this.swithcDarkMode = () => {
            var navbar = this.props.navbar;

            genericResourcePUT(
                `/user?uid=${navbar.state.user["user_id"]}&user_dark_mode=${navbar.state.setDarkMode["user_dark_mode"]}`,
                this,
                {
                    userId: navbar.state.user["user_id"],
                    userDarkModePreferance: navbar.state.setDarkMode["user_dark_mode"]
                });
        }
    }

    componentDidMount() {
        var navbar = this.props.navbar;
        var state = navbar.state;
        var user = state.user;

        if (user !== null) {
            this.setState({
                user: user,
                darkMode: user["user_dark_mode"] || false,
            });

            if (user["user_dark_mode"]) {
                document.body.classList.add('mode');
            }
        }
    }

    switchDarkMode = (event) => {
        const newDarkMode = event.target.checked;
        var navbar = this.props.navbar;

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
        genericResourcePUT(
            `/user?uid=${navbar.state.user["user_id"]}`,
            this,
            {
                userId: navbar.state.user["user_id"],
                user_dark_mode: newDarkMode
            }
        ).then(result => {
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
    const { user, darkMode } = this.state;
    
    return (
      <>
        <Box className="content-spacing">
          <Typography sx={{ fontWeight: '700' }} variant="h5" aria-label="Settings">
            Settings
          </Typography>
        </Box>
        {this.state.user && (
          <Box>
            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={darkMode}
                    onChange={this.switchDarkMode}
                  />
                }
                label="Dark Mode"
              />
            </Box>
          </Box>
        )}
      </>
    );
  }
}

export default Settings;