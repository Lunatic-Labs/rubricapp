import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "../../../../SBStyles.css";
import { Box, Typography } from "@mui/material";
import CustomButton from "../../../Student/View/Components/CustomButton";
import SendMessageModal from '../../../Components/SendMessageModal';
import CustomDataTable from "../../../Components/CustomDataTable";

class ViewNotification extends Component {
  props: any;
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

  handleChange = (e: any) => {
    const { id, value } = e.target;

    this.setState({
        [id]: value,
        errors: {
            ...this.state.errors,
            [id]: value.trim() === '' ? `${id.charAt(0).toUpperCase() + id.slice(1)} cannot be empty` : '',
        },
    });
  };

  handleDialog = () => {
    this.setState({
        showDialog: this.state.showDialog === false ? true : false,
    })
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
              emailMessage: 'Message cannot be empty',
          },
      });

      return;
    }


    if (emailSubject.trim() === '') {
      this.setState({
          errors: {
              emailSubject: 'Subject cannot be empty',
          },
      });

      return;
    }

  };

  render() {
    var navbar = this.props.navbar;

    var state = navbar.state;

    var notificationSent = state.notificationSent;

   return (
      <Box sx={{display:"flex", flexDirection:"column", gap: "20px", marginTop:"20px"}}>
        <Box className="subcontent-spacing">
          <Typography sx={{fontWeight:'700'}} variant="h5" aria-label="viewNotificationsTitle"> View Notifications</Typography>
          <Box>
            <SendMessageModal
              show={this.state.showDialog}
              handleDialog={this.handleDialog}
              sendNotification={this.handleSendNotification}
              handleChange={this.handleChange}
              emailSubject={this.state.emailSubject}
              emailMessage={this.state.emailMessage}
              error={this.state.errors}
            />

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
