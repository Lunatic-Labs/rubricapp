import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "../../../../SBStyles.css";
import { Box, Typography } from "@mui/material";
import CustomButton from "../../../Student/View/Components/CustomButton.js";
import SendMessageModal from '../../../Components/SendMessageModal.js';
import CustomDataTable from "../../../Components/CustomDataTable.js";

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

      errors: {
        emailSubject: '',
        emailMessage: '',
      }
    };
  }
  
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
          <Box>
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
        <Box className="table-spacing">
          <CustomDataTable
          />
        </Box>
      </Box>
    );
  }
}

export default ViewNotification;
