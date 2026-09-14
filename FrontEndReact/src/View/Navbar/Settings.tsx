import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Box, Typography, Switch, FormControlLabel } from "@mui/material";
import Cookies from "universal-cookie";
import { genericResourcePUT, genericResourceGET, User } from "../../utility";
import { logger } from "../../logger";

// 'mode' refers to the darkmode classlist in the SBStyles.css, by adding 'mode' to the
// document body, the darkmode css will be applied.

// currently settings has only one option and that is to toggle darkmode, more options
// will be added later as the app grows.

interface SettingsState {
  darkMode: boolean;
  isLoaded?: boolean;
  user?: any;
}

interface SettingsProps {
  navbar: any;
}

class Settings extends Component<SettingsProps, SettingsState> {
  constructor(props: SettingsProps) {
    super(props);

    this.state = {
      darkMode: props.navbar?.state?.darkMode ?? false,
    };
  }

  componentDidMount() {
    const cookies = new Cookies();
    //const user = cookies.get("user");

    // Check if the "user" cookie exists
    if (cookies.get("user") !== undefined) {
      // Cookie exists - proceed with your logic
      const user = cookies.get("user");
      
      if (user !== null) {
        let promise: Promise<any>; // promise is used because we do not yet have the 'data' from the backend
        let userData: User; // promise tells the app that it will recieve data

        // get all the neccessary resources from the backend, the 'user' from the 'users' array.
        promise = genericResourceGET(`/user`, "users", this);

        promise
          .then((result) => {
            if (result !== undefined && result["users"] !== null) {
              userData = result["users"];

              // user data is now set by the result for 'users' and the state is changed
              // to match the users preferance (false or true).
              this.setState(
                {
                  isLoaded: true,
                  user: userData["user_id"],
                  darkMode: userData["user_dark_mode"],
                },
                () => {
                  // This callback runs AFTER state is updated
                  if (this.state.darkMode) {
                    document.body.classList.add("mode");
                  } else {
                    document.body.classList.remove("mode");
                  }
                }
              );
            }
          })
          .catch((error) => {
            logger.error("Error fetching user data:", error);
            // Fallback to user object
            this.setState(
              {
                isLoaded: false,
                user: user,
                darkMode: user["user_dark_mode"] || false,
              },
              () => {
                // Apply dark mode in callback
                if (this.state.darkMode) {
                  document.body.classList.add("mode");
                } else {
                  document.body.classList.remove("mode");
                }
              }
            );
          });
      }
    } else {
      // Cookie does not exist - handle accordingly (e.g., redirect to login)
      logger.debug("User cookie not found");
    }

    
  }

  // will handle any changes within the change, currently only used for detecting if user
  // has set darkmode.

  // for future refernace handleChange should be changed to handleDarkMode, as not to conflict with
  // any other 'changes' on the page.
  handleChange = (): void => {
    const newDarkMode = !this.state.darkMode; // take the users current prefernace and invert it

    // AppState doesn't keep user_id in shared state so we still read it from the cookie here
    const cookies = new Cookies();
    const cookieUser = cookies.get("user");
    const user_id = cookieUser ? cookieUser["user_id"] : undefined;

    let promise: Promise<any>; // promise that data will be provided later

    var body = JSON.stringify({
      user_id: user_id,
      user_dark_mode: newDarkMode,
    });

    this.setState({
      darkMode: newDarkMode,
    });

    if (newDarkMode) {
      document.body.classList.add("mode");
    } else {
      document.body.classList.remove("mode");
    }

    promise = genericResourcePUT(`/user_settings`, this, body);

    promise
      .then((result) => {
        if (result !== undefined && result.errorMessage === null) {
          this.setState({ darkMode: newDarkMode });
          if (this.props.navbar?.setState) {
            this.props.navbar.setState({ darkMode: newDarkMode });
          }
        }
      })
      .catch((error) => {
        logger.error("Error updating dark mode:", error);
        // Revert on error
        this.setState({ darkMode: !newDarkMode });
        if (!newDarkMode) {
          document.body.classList.add("mode");
        } else {
          document.body.classList.remove("mode");
        }
      });
  };

  render() {
    const { darkMode } = this.state;

    return (
      <>
        <Box className="content-spacing">
          <Typography
            sx={{ fontWeight: "700" }}
            variant="h5"
            aria-label="Settings"
          >
            Settings
          </Typography>
        </Box>
        <Box className="card-spacing">
          <Box className="form-position">
            <Box className="card-style">
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  width: "100%",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "600" }}>
                  Appearance
                </Typography>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
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
      </>
    );
  }
}

export default Settings;
