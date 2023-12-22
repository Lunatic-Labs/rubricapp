import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { grey } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

const ColorButton = styled(Button)(({ theme }) => ({
    borderRadius:"100px",
    boxShadow: "none",
    color: theme.palette.getContrastText(grey[300]),
    backgroundColor: grey[300],
    '&:hover': {
      backgroundColor: grey[400],
      boxShadow: "none"
    },   
  }));

// This button calls the confirmCreateResource function 
// to validate the https requests before setting the corresponding tab
export default function BackButtonResource (props){
    return (
      <Box>
        <ColorButton   
          onClick={() => {
            props.confirmResource(props.tabSelected);
          }}
          variant="contained" startIcon={<ArrowBackIcon/>}>
          Back
        </ColorButton>
      </Box>
    );
}

