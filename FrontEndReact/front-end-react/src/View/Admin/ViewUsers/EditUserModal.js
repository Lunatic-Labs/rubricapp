import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function EditUserModal(user_id) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return(
        <div>
            <Button onClick={() => {handleOpen(); console.log(user_id.user_id);}} varient="contained">Edit</Button>
            <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" style={{margin: "1rem"}}> Edit User</Typography>
                    <TextField id="filled-required" label="First Name" defaultValue=""/>
                    <TextField id="filled-required" label="Last Name" defaultValue=""/>
                    <TextField id="filled-required" label="Email" defaultValue=""/>
                    <TextField id="filled-required" label="Role" defaultValue=""/>
                    <TextField id="filled-required" label="LMS ID" defaultValue=""/>
                    <TextField id="filled-required" label="Consent" defaultValue=""/>
                    <TextField id="filled-required" label="Owner ID" defaultValue=""/>
                    <Button onClick={handleClose}>Save User</Button>
                </Box>
            </Modal>
        </div>
    )
}

export default EditUserModal;