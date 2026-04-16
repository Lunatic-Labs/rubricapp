import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "../../../../SBStyles.css";
import { Box, Typography, Alert, IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "../../../Student/View/Components/CustomButton";
import SendMessageModal from '../../../Components/SendMessageModal';
import CustomDataTable from "../../../Components/CustomDataTable";
import { genericResourcePOST, genericResourceGET, genericResourceDELETE } from '../../../../utility';

/**
 * Creates an instance of the ViewNotification component.
 * Displays notifications and allows sending messages.
 * 
 * @constructor
 * @param {Object} props - The properties passed to the component.
 * @property {Object} props.navbar - The navbar object containing state and methods for navigation.
 * 
 * @property {string|null} state.errorMessage - The error message to display if an error occurs during data fetching.
 * @property {boolean|null} state.isLoaded - Indicates whether the data has been loaded.
 * @property {boolean} state.showDialog - Controls the visibility of the send message dialog.
 * @property {string} state.emailSubject - The subject of the email to be sent.
 * @property {string} state.emailMessage - The message body of the email to be sent.
 * @property {boolean} state.notificationSent - Indicates whether a notification has been sent.
 * @property {Object} state.errors - Contains validation error messages for the email subject and message.
 * @property {string} state.errors.emailSubject - Validation error message for the email subject.
 * @property {string} state.errors.emailMessage - Validation error message for the email message.
 * 
 * TODO:
 * Trace handleSendNotification function to actual sending logic.
 * Use of componentDidMount if needed for fetching existing notifications.
 * 
 */

interface ViewNotificationState {
  errorMessage: any;
  isLoaded: any;
  showDialog: boolean;
  emailSubject: string;
  emailMessage: string;
  notificationSent: boolean;
  sendSuccess: boolean;
  successMessage: string;
  sendError: string;
  admin_notifications: any[];
  selectedRows: number[];
  errors: {
    emailSubject: string;
    emailMessage: string;
  };
}

class ViewNotification extends Component<any, ViewNotificationState> {
  constructor(props: any) {
    super(props);

    this.state = {
      errorMessage: null,
      isLoaded: null,
      showDialog: false,
      emailSubject: '',
      emailMessage: '',
      notificationSent: false,
      sendSuccess: false,
      successMessage: '',
      sendError: '',
      admin_notifications: [],
      selectedRows: [],
      errors: {
        emailSubject: '',
        emailMessage: '',
      }
    };
  }

  componentDidMount() {
    genericResourceGET('/admin_notifications', 'admin_notifications', this);
  }
  
/**
 * @method fetchNotifications - Fetches the admin notifications from the API.
 * Used to refresh the table after sending a new notification.
 */
  fetchNotifications = () => {
    genericResourceGET('/admin_notifications', 'admin_notifications', this);
  };

  handleChange = (e: any) => {
    const { id, value } = e.target;
    this.setState({
        [id]: value,
        errors: {
            ...this.state.errors,
            [id]: value.trim() === '' ? `${id.charAt(0).toUpperCase() + id.slice(1)} cannot be empty` : '',
        },
    } as any);
  };

  handleDialog = () => {
    if (this.state.showDialog === false) {
      this.setState({
        showDialog: true,
        sendSuccess: false,
        sendError: '',
        emailSubject: '',
        emailMessage: '',
        errors: { emailSubject: '', emailMessage: '' },
      });
    } else {
      this.setState({
        showDialog: false,
        sendSuccess: false,
        sendError: '',
      });
    }
  }

  handleSendNotification = () => {
    var emailSubject = this.state.emailSubject;
    var emailMessage = this.state.emailMessage;

    if (emailSubject.trim() === '' && emailMessage.trim() === '') {
      this.setState({
          errors: {
              emailSubject: 'Subject cannot be empty',
              emailMessage: 'Message cannot be empty',
          },
      });
      return;
    }

    if (emailMessage.trim() === '') {
      this.setState({
          errors: {
              emailSubject: this.state.errors.emailSubject,
              emailMessage: 'Message cannot be empty',
          },
      } as any);
      return;
    }

    if (emailSubject.trim() === '') {
      this.setState({
          errors: {
              emailSubject: 'Subject cannot be empty',
              emailMessage: this.state.errors.emailMessage,
          },
      } as any);
      return;
    }

    genericResourcePOST(
      '/send_admin_notification',
      this,
      JSON.stringify({ subject: emailSubject, message: emailMessage })
    ).then((result) => {
      if (result !== undefined && result.errorMessage === null) {
        this.setState({
          showDialog: false,
          emailSubject: '',
          emailMessage: '',
        });
        setTimeout(() => {
          this.setState({
            sendSuccess: true,
            successMessage: 'Message sent to all admins successfully.',
            sendError: '',
          });
        }, 0);
        this.fetchNotifications();
      } else {
        this.setState({
          sendError: 'Failed to send notification. Please try again.',
        });
      }
    });
  };

  handleDeleteSelected = (selectedRows: number[]) => {
    if (selectedRows.length === 0) return;
    const confirmed = window.confirm(`Delete ${selectedRows.length === 1 ? 'this notification' : selectedRows.length + ' selected notifications'}?`);
    if (!confirmed) return;

    genericResourceDELETE('/admin_notifications', this, {
      body: JSON.stringify({ notification_ids: selectedRows }),
    }).then(() => {
      this.setState({
        selectedRows: [],
        sendSuccess: false,
      });
      setTimeout(() => {
        this.setState({
          sendSuccess: true,
          successMessage: selectedRows.length === 1
            ? 'Notification deleted successfully.'
            : `${selectedRows.length} notifications deleted successfully.`,
          sendError: '',
        });
      }, 0);
      this.fetchNotifications();
    }).catch(() => {
      this.setState({ sendError: 'Failed to delete notifications.' });
    });
  };

  render() {
    var navbar = this.props.navbar;
    var state = navbar.state;
    var notificationSent = state.notificationSent;

   return (
      <Box sx={{display:"flex", flexDirection:"column", gap: "20px", marginTop:"20px"}}>
        <Box className="subcontent-spacing">
          <Typography sx={{fontWeight:'700'}} variant="h5" aria-label="viewNotificationsTitle"> View Notifications</Typography>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <SendMessageModal
              show={this.state.showDialog}
              handleDialog={this.handleDialog}
              sendNotification={this.handleSendNotification}
              handleChange={this.handleChange}
              emailSubject={this.state.emailSubject}
              emailMessage={this.state.emailMessage}
              error={this.state.errors}
            />
            {this.state.sendSuccess && (
              <Alert severity="success" sx={{ mb: 1 }}>
                {this.state.successMessage}
              </Alert>
            )}
            {this.state.sendError && (
              <Alert severity="error" sx={{ mb: 1 }}>
                {this.state.sendError}
              </Alert>
            )}
            <CustomButton
              label="Send New Message"
              onClick={this.handleDialog}
              isOutlined={false}
              disabled={notificationSent}
              aria-label="SendMessageButton"
            />
          </Box>
        </Box>
        <Box className="table-spacing narrow-select-table">
          <CustomDataTable
            data={this.state.admin_notifications}
            columns={[
              {
                name: "admin_notification_id",
                label: "ID",
                options: {
                  display: "excluded",
                  filter: false,
                }
              },
              {
                name: "subject",
                label: "Subject",
                options: {
                  setCellHeaderProps: () => ({ width: "29%" }),
                  setCellProps: () => ({ width: "29%" }),
                }
              },
              {
                name: "message",
                label: "Message",
                options: {
                  setCellHeaderProps: () => ({ width: "44%" }),
                  setCellProps: () => ({ width: "44%" }),
                  customBodyRender: (value: string) => {
                    if (!value) return '';
                    return (
                      <div style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis", wordBreak: "break-word" }} title={value}>
                        {value}
                      </div>
                    );
                  }
                }
              },
              {
                name: "sent_at",
                label: "Sent At",
                options: {
                  setCellHeaderProps: () => ({ width: "20%" }),
                  setCellProps: () => ({ width: "20%" }),
                  customBodyRender: (value: string) => {
                    if (!value) return '';
                    return new Date(value).toLocaleString();
                  }
                }
              },
              {
                name: "delete",
                label: "Delete",
                options: {
                  setCellHeaderProps: () => ({ width: "5%", align: "center" as const }),
                  setCellProps: () => ({ width: "5%", align: "center" as const }),
                  customBodyRender: (value: any, tableMeta: any) => {
                    const rowIndex = tableMeta.rowIndex;
                    const notification = this.state.admin_notifications[rowIndex];
                    if (!notification) return null;
                    const notificationId = notification.admin_notification_id;
                    return (
                      <Box sx={{ display: "flex", gap: "4px", justifyContent: "center" }}>
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => this.handleDeleteSelected([notificationId])}
                            aria-label="DeleteNotification"
                          >
                            <DeleteIcon sx={{ color: "black" }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    );
                  }
                }
              },
            ]}
            options={{
              responsive: "vertical",
              tableBodyMaxHeight: "400px",
              download: false,
              print: false,
              filter: false,
              selectableRows: "multiple",
              selectableRowsHeader: true,
              viewColumns: false,
              rowsPerPageOptions: [10, 25, 50],
              onRowSelectionChange: (currentRowsSelected: any, allRowsSelected: any, rowsSelected: any) => {
                const selectedIds = allRowsSelected.map((row: any) => this.state.admin_notifications[row.dataIndex]?.admin_notification_id).filter((id: any) => id !== undefined);
                this.setState({ selectedRows: selectedIds });
              },
              customToolbarSelect: (selectedRows: any, displayData: any, setSelectedRows: any) => (
                <Box sx={{ display: "flex", alignItems: "center", gap: "8px", padding: "0 16px" }}>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {selectedRows.data.length} selected
                  </Typography>
                  <Tooltip title="Delete Selected">
                    <IconButton
                      onClick={() => {
                        const ids = selectedRows.data.map((row: any) => this.state.admin_notifications[row.dataIndex]?.admin_notification_id).filter((id: any) => id !== undefined);
                        this.handleDeleteSelected(ids);
                        setSelectedRows([]);
                      }}
                    >
                      <DeleteIcon sx={{ color: "black" }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              ),
            }}
          />
        </Box>
      </Box>
    );
  }
}

export default ViewNotification;
