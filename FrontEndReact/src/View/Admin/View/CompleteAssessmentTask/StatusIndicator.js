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
          return <FiberManualRecordIcon style={{ color: 'gray' }} />;
        case false:
          return <FiberManualRecordIcon style={{ color: 'orange' }} />;
        case true:
          return <FiberManualRecordIcon style={{ color: 'green' }} />;
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