import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';


const StatusIndicator = ({ status }) => {
  // This function needs to be changed to check the initialTime! 
  const getStatusIcon = () => {
    switch (status) {
      case 'idle':
        return <FiberManualRecordIcon style={{ color: 'gray' }} />;
      case 'inProgress':
        return <FiberManualRecordIcon style={{ color: 'orange' }} />;
      case 'completed':
        return <CheckCircleIcon style={{ color: 'green' }} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {getStatusIcon()}
      {status === 'loading' && (
        <CircularProgress
          size={20}
          style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
        />
      )}
    </div>
  );
};

StatusIndicator.propTypes = {
  status: PropTypes.oneOf(['idle', 'inProgress', 'completed']).isRequired,
};

export default StatusIndicator;

