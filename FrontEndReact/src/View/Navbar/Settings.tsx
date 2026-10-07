import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Box, Typography, Switch, FormControlLabel } from "@mui/material";
import Cookies from "universal-cookie";
import { genericResourcePUT } from "../../utility";

// 'mode' refers to the darkmode classlist in the SBStyles.css, by adding 'mode' to the
// document body, the darkmode css will be applied.

// currently settings has only one option and that is to toggle darkmode, more options
// will be added later as the app grows.

interface SettingsState {
  darkMode: boolean;
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
    // AppState now owns fetching/holding the user's dark mode preference
    // (see SKIL-800) and passes it down as props.navbar.state.darkMode,
    // which the constructor above already seeded this.state.darkMode from —
    // no independent fetch needed here anymore.
    if (this.state.darkMode) {
      document.body.classList.add("mode");
    } else {
      document.body.classList.remove("mode");
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
          // Keep AppState's copy of darkMode in sync since it's now the
          // shared source of truth other components read from (SKIL-800).
          if (this.props.navbar?.setState) {
            this.props.navbar.setState({ darkMode: newDarkMode });
          }
        } else {
          // Network failures now resolve through this same branch (instead of
          // rejecting) with an errorMessage set, so this covers both server
          // and network errors — revert the optimistic update.
          console.error("Error updating dark mode:", result?.errorMessage);
          this.setState({ darkMode: !newDarkMode });
          if (!newDarkMode) {
            document.body.classList.add("mode");
          } else {
            document.body.classList.remove("mode");
          }
        }
      });
      // No .catch() needed: genericResourcePUT resolves (never rejects) on
      // both network and server failures — see utility.ts.
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
