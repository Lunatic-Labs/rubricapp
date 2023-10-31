import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { grey } from '@mui/material/colors';
import { styled } from '@mui/material/styles';

const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(grey[300]),
    backgroundColor: grey[300],
    '&:hover': {
      backgroundColor: grey[400],
    },
    
  }));

export default function BackButton (){
   
    return (
        <ColorButton sx={{borderRadius:"100px"}} variant="contained" startIcon={<ArrowBackIcon />}>
            Back
        </ColorButton>
    );
}

