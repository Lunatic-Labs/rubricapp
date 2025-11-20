// @ts-expect-error TS(2307): Cannot find module 'react' or its corresponding ty... Remove this comment to see the full error message
import React, { Component } from 'react';
// @ts-expect-error TS(2307): Cannot find module '@mui/material' or its correspo... Remove this comment to see the full error message
import { Box } from '@mui/material';

export const StatusIndicatorState = Object.freeze({
  NOT_STARTED: "NOT_STARTED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED"
});

class StatusIndicator extends Component {
  getStatusIcon: any;
  props: any;
  setState: any;
  state: any;
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
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" style={{ color: "gray", marginLeft: "4px" }}>
              // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" fill="none"/>
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            </svg>
          );
        case StatusIndicatorState.IN_PROGRESS:
          return (
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" style={{ color: "orange", marginLeft: "4px" }}>
              // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" fill="none"/>
              // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              <path d="M 8 3 a 5 5 0 0 0 0 10 Z" fill="currentColor"/>
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            </svg>
          );
        case StatusIndicatorState.COMPLETED:
          return (
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" style={{ color: "green", marginLeft: "4px" }}>
              // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" fill="none"/>
              // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              <circle cx="8" cy="8" r="5" fill="currentColor"/>
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
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
      // @ts-expect-error TS(2307): Cannot find module 'react/jsx-runtime' or its corr... Remove this comment to see the full error message
      <Box style={{ position: 'relative', display: 'inline-block'}}>
        {this.getStatusIcon()}
      </Box>
    );
  }
};

export default StatusIndicator;