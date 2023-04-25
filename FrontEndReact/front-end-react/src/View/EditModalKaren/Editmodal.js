//tutorial from mui
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

export default function Editmodul() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen} style={{margin: "1rem"}}>Edit Course</Button>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" style={{margin: "1rem"}}> Edit Course</Typography>
          <TextField id="filled-required" label="Course Number" defaultValue=""/>
          <TextField id="filled-required" label="Course Name" defaultValue=""/>
          <TextField id="filled-required" label="Year" defaultValue=""/>
          <TextField id="filled-required" label="Term" defaultValue=""/>
          <TextField id="filled-required" label="Active" defaultValue=""/>
          <TextField id="filled-required" label="Admin ID" defaultValue=""/>
          <Button onClick={handleClose}>Save Course</Button>
        </Box>
      </Modal>
    </div>
  );
}
