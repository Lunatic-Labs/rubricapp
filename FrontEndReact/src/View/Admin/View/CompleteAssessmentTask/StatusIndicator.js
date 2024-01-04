import React from 'react';
import { Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';


const StatusIndicator = ({ status }) => {
  // This function needs to be changed to check the initialTime! 
  const getStatusIcon = () => {
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

  return (
    <Box style={{ position: 'relative', display: 'inline-block'}}>
      {getStatusIcon()}
      {status === 'loading' && (
        <CircularProgress
          size={20}
          style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
        />
      )}
    </Box>
  );
};

export default StatusIndicator;

