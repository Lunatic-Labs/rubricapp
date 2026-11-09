import React, { Component } from "react";
import "../../../../SBStyles.css";
import { Box, Typography } from "@mui/material";
import CustomDataTable from "../../../Components/CustomDataTable";
import { genericResourceGET } from '../../../../utility';
import { GridColDef } from '@mui/x-data-grid';

/**
 * Read-only view of notifications sent to admins (subject/message/sent at).
 * Mirrors the SuperAdmin's "View Notifications" page, minus the send/delete
 * actions that stay SuperAdmin-only -- this is where any admin can go read
 * what a notification actually said, including from a push notification's
 * notificationclick handler (see public/push-sw.js).
 *
 * @constructor
 * @param {Object} props - The properties passed to the component.
 * @property {Object} props.navbar - The navbar object containing state and methods for navigation.
 */
interface MyNotificationsProps {
    navbar: any;
}

interface MyNotificationsState {
  errorMessage: string | null;
  isLoaded: boolean | null;
  admin_notifications: any[];
}

class MyNotifications extends Component<MyNotificationsProps, MyNotificationsState> {
  constructor(props: MyNotificationsProps) {
    super(props);

    this.state = {
      errorMessage: null,
      isLoaded: null,
      admin_notifications: [],
    };
  }

  componentDidMount() {
    genericResourceGET('/my_admin_notifications', 'admin_notifications', this);
  }

  render() {
    return (
      <Box sx={{display:"flex", flexDirection:"column", gap: "20px", marginTop:"20px"}}>
        <Box className="subcontent-spacing">
          <Typography sx={{fontWeight:'700'}} variant="h5" data-testid="my-notifications-title"> My Notifications</Typography>
        </Box>
        {this.state.errorMessage &&
          <Typography sx={{ color: 'var(--error-color)' }}>{this.state.errorMessage}</Typography>
        }
        <Box className="table-spacing narrow-select-table">
          <CustomDataTable
            data={this.state.admin_notifications}
            getRowId={(row) => row.admin_notification_id}
            height="400px"
            toolbarVisible={true}
            columns={[
              {
                field: "subject",
                headerName: "Subject",
                minWidth: 220,
                flex: 1,
              },
              {
                field: "message",
                headerName: "Message",
                minWidth: 340,
                flex: 1,
                renderCell: (params) => {
                  if (!params.value) return '';
                  return (
                    <div style={{ wordBreak: "break-word", whiteSpace: "pre-wrap", padding: "8px 0" }}>
                      {params.value}
                    </div>
                  );
                }
              },
              {
                field: "sent_at",
                headerName: "Sent At",
                minWidth: 160,
                flex: 1,
                renderCell: (params) => {
                  if (!params.value) return '';
                  return <>{new Date(params.value).toLocaleString()}</>;
                }
              },
            ] as GridColDef[]}
            options={{
              pageSizeOptions: [10, 25, 50],
            }}
          />
        </Box>
      </Box>
    );
  }
}

export default MyNotifications;
