import React, { Component } from 'react';
import Button from '@mui/material/Button';

// NOTE: Might add the back button here 
//
// class BackButton extends Component {
// 	render() {
// 		const { onBackClick } = this.props;
//
// 		return (
// 			<div >
// 				{/*"Back" button*/}
// 				<Button
// 					variant='filledTonal'
// 					size='small'
// 					onClick={() => {
// 						console.log('back')
// 					}}
// 					style={{
// 						backgroundColor:'#dcdcdc',
// 						position:'absolute',
// 						borderRadius: '21px',
// 						top: '80px',
// 						left: '10px'
// 					}}
// 					>
// 				<ArrowBackIos style={{ fontSize: 12, color: '#2E8BEF' }}/>
// 				<Typography variant='body2'
// 					style={{ fontSize: '12px' }}
// 					>
// 					Back
// 				</Typography>
// 				</Button>
// 			</div>
// 		);
// 	}
// }

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
