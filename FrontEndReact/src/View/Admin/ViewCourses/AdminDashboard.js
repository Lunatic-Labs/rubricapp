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
  width:350,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function AdminDashboard(course_id) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return(
        <div>
            <Button onClick={() => {handleOpen(); console.log(course_id.course_id);}} varient="contained">View</Button>
            <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h4" component="h2" style={{margin: ".25rem"}}> This will be the Admin Dashboard</Typography>
                    <TextField id="filled-required" label="Admin Field" defaultValue="" style={{margin: "0.5rem"}}/>
                    <Button onClick={handleClose} style={{backgroundColor: "#2E8BEF", color:"white",margin: "0.5rem", float:"right"}}>Save</Button>
                </Box>
            </Modal>
        </div>
    )
}

export default AdminDashboard;