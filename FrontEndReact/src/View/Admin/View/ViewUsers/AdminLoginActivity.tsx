import React, { Component } from "react";
import { Alert, Box, Typography } from "@mui/material";
import CustomDataTable from "../../../Components/CustomDataTable";
import Loading from "../../../Loading/Loading";
import { genericResourceGET } from "../../../../utility";

interface AdminLoginActivityState {
  admin_login_activity: any[];
  errorMessage: string | null;
  isLoaded: boolean;
}

class AdminLoginActivity extends Component<{}, AdminLoginActivityState> {
  state: AdminLoginActivityState = {
    admin_login_activity: [],
    errorMessage: null,
    isLoaded: false,
  };

  componentDidMount() {
    genericResourceGET("/admin_login_activity", "admin_login_activity", this);
  }

  formatLastLogin = (lastLoginAt: string | null) => {
    if (!lastLoginAt) {
      return "Never";
    }

    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(lastLoginAt));
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
        <Typography aria-label="adminLoginActivityTitle" sx={{ fontWeight: "700", mb: 2 }} variant="h5">
          Admin Login Activity
        </Typography>
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