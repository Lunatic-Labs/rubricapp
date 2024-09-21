import React, { Component } from 'react';
import { Box } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';



class StatusIndicator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      status: this.props.status
    };

    this.getStatusIcon = () => {
      var status = this.state.status;
      switch (status) {
        case null:
          return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" style={{ color: "gray", marginLeft: "4px" }}>
              <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
          );
        case false:
          return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" style={{ color: "orange", marginLeft: "4px" }}>
              <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="2" fill="none"/>
              <path d="M 8 3 a 5 5 0 0 0 0 10 Z" fill="currentColor"/>
            </svg>
          );
        case true:
          return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" style={{ color: "green", marginLeft: "4px" }}>
              <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="2" fill="none"/>
              <circle cx="8" cy="8" r="5" fill="currentColor"/>
            </svg>
          );
        default:
          return null;
      }
    };
  }

  componentDidUpdate() {
    if(this.props.status !== this.state.status) {
      this.setState({
        status: this.props.status
      });
    }
  }

  render() {
    return(
      <Box style={{ position: 'relative', display: 'inline-block'}}>
        {this.getStatusIcon()}
      </Box>
    );
  }
};

export default StatusIndicator;