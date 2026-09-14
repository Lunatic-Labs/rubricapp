import React, { Component } from "react";
import { Alert, Box, FormControlLabel, Switch, Typography } from "@mui/material";
import CustomDataTable from "../../../Components/CustomDataTable";
import Loading from "../../../Loading/Loading";
import { genericResourceGET } from "../../../../utility";

interface AdminLoginActivityState {
  admin_login_activity: any[];
  errorMessage: string | null;
  isLoaded: boolean;
  showUtc: boolean;
}

class AdminLoginActivity extends Component<{}, AdminLoginActivityState> {
  state: AdminLoginActivityState = {
    admin_login_activity: [],
    errorMessage: null,
    isLoaded: false,
    showUtc: false,
  };

  componentDidMount() {
    genericResourceGET("/admin_login_activity", "admin_login_activity", this);
  }

  formatLastLogin = (lastLoginAt: string | null) => {
    if (!lastLoginAt) {
      return "Never";
    }

    const hasTimezone = lastLoginAt.endsWith("Z") || /[+-]\d{2}:\d{2}$/.test(lastLoginAt);
    const timestamp = new Date(hasTimezone ? lastLoginAt : `${lastLoginAt}Z`);

    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone: this.state.showUtc ? "UTC" : undefined,
      timeZoneName: "short",
    }).format(timestamp);
  };

  render() {
    if (this.state.errorMessage) {
      return <Alert severity="error">{this.state.errorMessage}</Alert>;
    }

    if (!this.state.isLoaded) {
      return <Loading />;
    }

    const columns = [
      { name: "first_name", label: "First Name", options: { filter: true } },
      { name: "last_name", label: "Last Name", options: { filter: true } },
      { name: "email", label: "Email", options: { filter: true } },
      {
        name: "last_login_at",
        label: "Last Login",
        options: {
          filter: false,
          customBodyRender: (lastLoginAt: string | null) => this.formatLastLogin(lastLoginAt),
        },
      },
    ];

    return (
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography aria-label="adminLoginActivityTitle" sx={{ fontWeight: "700" }} variant="h5">
            Admin Login Activity
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={this.state.showUtc}
                onChange={(event) => this.setState({ showUtc: event.target.checked })}
                inputProps={{ "aria-label": "Show login times in UTC" }}
              />
            }
            label={this.state.showUtc ? "UTC" : "Local time"}
          />
        </Box>
        <CustomDataTable
          data={this.state.admin_login_activity}
          columns={columns}
          options={{ responsive: "standard", selectableRows: "none" }}
        />
      </Box>
    );
  }
}

export default AdminLoginActivity;