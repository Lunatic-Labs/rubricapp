import React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';

// The app's standard filled/outlined button. Any other Button prop
// (aria-label, data-testid, id, ...) is passed straight through, so new
// pass-through props don't need to be added here one at a time.
type CustomButtonProps = {
  label: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  isOutlined?: boolean;
  position?: React.CSSProperties['position'];
  disabled?: boolean;
} & Omit<ButtonProps, 'onClick' | 'style' | 'children' | 'disabled'>;

const CustomButton = ({
  label,
  onClick,
  style,
  isOutlined,
  position,
  disabled,
  className,
  ...buttonProps
}: CustomButtonProps) => {
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

  // SBStyles.css forces every MUI button's text to --table-text unless it
  // has white-text-button (or primary-color), which would override the
  // white text the filled style above asks for.
  const classes = [isOutlined ? '' : 'white-text-button', className ?? ''].join(' ').trim();

  return (
    <div style={{ position: 'relative' }}>
      <Button
        {...buttonProps}
        onClick={onClick}
        style={buttonStyle}
        className={classes}
        disabled={disabled ?? false}
      >
        {label}
      </Button>
    </div>
  );
};

export default CustomButton;
