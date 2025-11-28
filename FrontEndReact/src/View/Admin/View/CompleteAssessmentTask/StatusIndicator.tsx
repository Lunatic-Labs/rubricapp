import React, { Component } from 'react';
import { Box } from '@mui/material';

export const StatusIndicatorState = Object.freeze({
  NOT_STARTED: "NOT_STARTED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED"
});

interface StatusIndicatorState {
  status: string;
}

class StatusIndicator extends Component<any, StatusIndicatorState> {
  getStatusIcon: any;
  constructor(props: any) {
    super(props);

    this.state = {
      status: this.props.status
    };

    this.getStatusIcon = () => {
      var status = this.state.status;
      switch (status) {
        case StatusIndicatorState.NOT_STARTED:
          return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" style={{ color: "gray", marginLeft: "4px" }}>
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          );
        case StatusIndicatorState.IN_PROGRESS:
          return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" style={{ color: "orange", marginLeft: "4px" }}>
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M 8 3 a 5 5 0 0 0 0 10 Z" fill="currentColor"/>
            </svg>
          );
        case StatusIndicatorState.COMPLETED:
          return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" style={{ color: "green", marginLeft: "4px" }}>
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" fill="none"/>
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