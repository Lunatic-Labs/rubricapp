import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "../../../../SBStyles.css";
import { Box, Typography, Alert, IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ReplyIcon from "@mui/icons-material/Reply";
import CustomButton from "../../../Student/View/Components/CustomButton";
import SendMessageModal from '../../../Components/SendMessageModal';
import CustomDataTable from "../../../Components/CustomDataTable";
import { genericResourcePOST, genericResourceGET } from '../../../../utility';
import { apiUrl } from '../../../../App';
import Cookies from 'universal-cookie';

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
  sendError: string;
  admin_notifications: any[];
  selectedRows: number[];
  editingNotificationId: number | null;
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
      sendError: '',
      admin_notifications: [],
      selectedRows: [],
      editingNotificationId: null,

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
  
/**
 * @method handleChange - Handles changes to the email subject and message input fields.
 * @param {Event} e - The event object from the input field change.
 * Updates the corresponding state properties and validation error messages.
 * 
 */

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
  /**
   * @method handleDialog - Toggles the visibility of the send message dialog.
   * Opens or closes the dialog based on its current state.
   * 
   */
  handleDialog = () => {
    this.setState({
        showDialog: this.state.showDialog === false ? true : false,
        sendSuccess: false,
        sendError: '',
        editingNotificationId: this.state.showDialog === false ? this.state.editingNotificationId : null,
    })
  }
  /**
   * @method handleSendNotification - Handles the sending of a notification.
   * Validates the email subject and message before sending.
   * Updates the state with validation error messages if fields are empty.
  
   */
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

    if (this.state.editingNotificationId) {
      // Sending an update to an existing notification thread
      const cookies = new Cookies();
      const accessToken = cookies.get('access_token');
      const user = cookies.get('user');
      const url = `${apiUrl}/admin_notifications/${this.state.editingNotificationId}?user_id=${user.user_id}`;

      fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + accessToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subject: emailSubject, message: emailMessage }),
      })
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          this.setState({
            showDialog: false,
            emailSubject: '',
            emailMessage: '',
            editingNotificationId: null,
            sendSuccess: true,
            sendError: '',
          });
          this.fetchNotifications();
        } else {
          this.setState({
            sendError: 'Failed to send update. Please try again.',
          });
        }
      })
      .catch(() => {
        this.setState({
          sendError: 'Failed to send update. Please try again.',
        });
      });
    } else {
      // Sending a new notification
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
            sendSuccess: true,
            sendError: '',
          });
          this.fetchNotifications();
        } else {
          this.setState({
            sendError: 'Failed to send notification. Please try again.',
          });
        }
      });
    }

  };
  /**
   * @method handleEditNotification - Opens the send message dialog pre-filled for sending an update.
   * @param {number} notificationId - The ID of the original notification to update.
   * @param {string} subject - The subject of the original notification.
   */
  handleEditNotification = (notificationId: number, subject: string) => {
    this.setState({
      editingNotificationId: notificationId,
      emailSubject: 'UPDATE: ' + subject,
      emailMessage: '',
      showDialog: true,
      sendSuccess: false,
      sendError: '',
      errors: { emailSubject: '', emailMessage: '' },
    });
  };
  /**
   * @method handleDeleteSelected - Deletes the selected notifications after confirmation.
   */
  handleDeleteSelected = (selectedRows: number[]) => {
    if (selectedRows.length === 0) return;
    const confirmed = window.confirm(`Delete ${selectedRows.length} selected notification${selectedRows.length > 1 ? 's' : ''}?`);
    if (!confirmed) return;

    const cookies = new Cookies();
    const accessToken = cookies.get('access_token');
    const user = cookies.get('user');
    const url = `${apiUrl}/admin_notifications?user_id=${user.user_id}`;

    fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ notification_ids: selectedRows }),
    })
    .then(res => res.json())
    .then(result => {
      if (result.success) {
        this.setState({ selectedRows: [] });
        this.fetchNotifications();
      } else {
        this.setState({ sendError: 'Failed to delete notifications.' });
      }
    })
    .catch(() => {
      this.setState({ sendError: 'Failed to delete notifications.' });
    });
  };
  /**
   * @returns {JSX.Element} The rendered ViewNotification component.
   */
  render() {
    var navbar = this.props.navbar;

    var state = navbar.state;

    var notificationSent = state.notificationSent;

   return (
      <Box sx={{display:"flex", flexDirection:"column", gap: "20px", marginTop:"20px"}}>
        <Box className="subcontent-spacing">
          <Typography sx={{fontWeight:'700'}} variant="h5" aria-label="viewNotificationsTitle"> View Notifications</Typography>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            {/**
             * SendMessageModal Component - Modal dialog for sending messages.
             */
            }
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
                Message sent to all admins successfully.
              </Alert>
            )}
            {this.state.sendError && (
              <Alert severity="error" sx={{ mb: 1 }}>
                {this.state.sendError}
              </Alert>
            )}
            {/**
             * Send Message Button - Button to open the send message dialog.
             */}
            <CustomButton
              label="Send Message"
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
                name: "thread_id",
                label: "Thread ID",
                options: {
                  display: "excluded",
                  filter: false,
                }
              },
              {
                name: "subject",
                label: "Subject",
                options: {
                  setCellHeaderProps: () => ({ width: "25%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }),
                  setCellProps: () => ({ width: "25%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }),
                  customBodyRender: (value: string, tableMeta: any) => {
                    if (!value) return '';
                    const threadId = tableMeta.rowData?.[1];
                    const isUpdate = threadId !== null && threadId !== undefined;
                    return (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: "100%", paddingLeft: isUpdate ? "24px" : undefined }} title={value}>
                        {isUpdate && <ReplyIcon sx={{ fontSize: 16, color: "text.secondary", flexShrink: 0 }} />}
                        {value}
                      </div>
                    );
                  }
                }
              },
              {
                name: "message",
                label: "Message",
                options: {
                  setCellHeaderProps: () => ({ width: "40%" }),
                  setCellProps: () => ({ width: "40%" }),
                  customBodyRender: (value: string, tableMeta: any) => {
                    if (!value) return '';
                    const threadId = tableMeta.rowData?.[1];
                    const isUpdate = threadId !== null && threadId !== undefined;
                    return (
                      <div style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis", wordBreak: "break-word", width: "100%", paddingLeft: isUpdate ? "24px" : undefined }} title={value}>
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
                  setCellHeaderProps: () => ({ width: "15%" }),
                  setCellProps: () => ({ width: "15%" }),
                  customBodyRender: (value: string) => {
                    if (!value) return '';
                    return new Date(value).toLocaleString();
                  }
                }
              },
              {
                name: "actions",
                label: "Actions",
                options: {
                  setCellHeaderProps: () => ({ width: "10%", align: "center" as const }),
                  setCellProps: () => ({ width: "10%", align: "center" as const }),
                  customBodyRender: (value: any, tableMeta: any) => {
                    const notificationId = tableMeta.rowData[0];
                    const threadId = tableMeta.rowData[1];
                    const subject = tableMeta.rowData[2];
                    const isOriginal = threadId === null || threadId === undefined;
                    return (
                      <Box sx={{ display: "flex", gap: "4px", justifyContent: "center" }}>
                        {isOriginal && (
                          <Tooltip title="Send Update">
                            <IconButton
                              onClick={() => this.handleEditNotification(notificationId, subject)}
                              aria-label="SendUpdate"
                            >
                              <EditIcon sx={{ color: "black" }} />
                            </IconButton>
                          </Tooltip>
                        )}
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
