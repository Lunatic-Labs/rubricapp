import React from 'react';
import Button from '@mui/material/Button';

const CustomButton = ({ label, onClick, style, isOutlined, position, disabled,'aria-label': ariaLabel}) => {
  // Default styles for the button
  const defaultStyle = {
    backgroundColor: isOutlined ? 'white' : '#2E8BEF',
    color: isOutlined ? '#2E8BEF' : 'white',
    margin: '5px 2.5px 2.5px 0',
    position,
		border: isOutlined ? '1px solid #2E8BEF' : 'none',
  };

  if (disabled) {
    defaultStyle.backgroundColor = '#E0E0E0';
  }

  // Merge the default style with the custom style
  const buttonStyle = { ...defaultStyle, ...style };

  return (
		<div style={{ position: 'relative' }}>
    	<Button
        onClick={onClick}
        style={buttonStyle}
        position={position}
        disabled={disabled}
        aria-label={ariaLabel}
      >
        {label}
    	</Button>
		</div>
  );
};

export default CustomButton;
