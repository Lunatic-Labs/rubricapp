import React, { Component } from 'react';
import Button from '@mui/material/Button';

// Create a new component for the buttons
class EditConfirmButtons extends Component {
  render() {
		const { onEditClick, onConfirmClick } = this.props;

    return (
      <div style={{ position: 'relative' }}>
        {/* "Edit" button */}
        <Button
          variant="outlined"
          style={{
            backgroundColor: 'white',
            color: '#2E8BEF',
            margin: '10px 5px 5px 0',
            position: 'absolute',
            top: '10px',
            right: '150px', // Adjust as needed
          }}
          onClick={onEditClick}
        >
          Edit
        </Button>

        {/* "Confirm Team" button */}
        <Button
          style={{
            backgroundColor: '#2E8BEF',
            color: 'white',
            margin: '10px 5px 5px 0',
            position: 'absolute',
            top: '10px',
            right: '0px',
          }}
          onClick={onConfirmClick}
        >
          Confirm Team
        </Button>
      </div>
    );
  }
}

export default EditConfirmButtons;
