import React from 'react';
import Button from '@mui/material/Button';

interface CustomButtonProps {
    label: string;
    onClick: () => void;
    style?: React.CSSProperties;
    isOutlined?: boolean;
    position?: React.CSSProperties['position'];
    'data-testid'?: string;
}

const CustomButton = ({
  label,
  onClick,
  style,
  isOutlined,
  position,
  'data-testid': testId
}: CustomButtonProps) => {

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
    <div style={{ position: 'relative' }}>
      <Button
        onClick={onClick}
        style={buttonStyle}
        className={isOutlined ? '' : 'white-text-button'}
        data-testid={testId}
      >
        {label}
      </Button>
    </div>
  );
};

export default CustomButton;
