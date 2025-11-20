// @ts-expect-error TS(2307): Cannot find module 'react' or its corresponding ty... Remove this comment to see the full error message
import React from 'react';
// @ts-expect-error TS(2307): Cannot find module '@mui/material/Button' or its c... Remove this comment to see the full error message
import Button from '@mui/material/Button';

const CustomButton = ({
  label,
  onClick,
  style,
  isOutlined,
  position
}: any) => {
  // Default styles for the button
  const defaultStyle = {
    backgroundColor: isOutlined ? 'white' : '#2E8BEF',
    color: isOutlined ? '#2E8BEF' : 'white',
    margin: '5px 2.5px 2.5px 0',
    position,
		border: isOutlined ? '1px solid #2E8BEF' : 'none',
  };

  // Merge the default style with the custom style
  const buttonStyle = { ...defaultStyle, ...style };

  return (
// @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
		<div style={{ position: 'relative' }}>
    	<Button
        onClick={onClick}
        style={buttonStyle}
        position={position}
      >
        {label}
    	</Button>
// @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
		</div>
  );
};

export default CustomButton;
