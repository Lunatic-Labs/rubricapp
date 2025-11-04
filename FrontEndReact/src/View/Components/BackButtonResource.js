import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

const ColorButton = styled(Button)(({ theme }) => ({
    borderRadius:"100px",
    boxShadow: "none",
    color: 'var(--back-button-text)',
    backgroundColor: 'var(--back-button-bg)',
    '&:hover': {
      backgroundColor: 'var(--back-button-bg-hover)',
      boxShadow: "none"
    },
  }));

// This button calls the confirmCreateResource function 
// to validate the https requests before setting the corresponding tab
export default function BackButtonResource (props){
    var navbar = props.navbar;
    var confirmResource = navbar.confirmCreateResource;

    return (
      <Box className="back-button-colors">
        <ColorButton
          onClick={() => {
            confirmResource(props.tabSelected, 0);
          }}
          variant="contained"
          startIcon={<ArrowBackIcon/>}
          aria-label="mainHeaderBackButton"
        >
          Back
        </ColorButton>
      </Box>
    );
}