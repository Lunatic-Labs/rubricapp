import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { grey } from '@mui/material/colors';
import { styled, Theme } from '@mui/material';
import { Box } from '@mui/material';

const ColorButton = styled(Button)(({ theme }: { theme: Theme }) => ({
    borderRadius:"100px",
    boxShadow: "none",
    color: theme.palette.getContrastText(grey[300]),
    backgroundColor: grey[300],
    '&:hover': {
      backgroundColor: grey[400],
      boxShadow: "none"
    },
  }));

interface BackButtonResourceProps {
    navbar: any;
    tabSelected: string;
}

// This button calls the confirmCreateResource function 
// to validate the https requests before setting the corresponding tab
export default function BackButtonResource (props: BackButtonResourceProps){
    var navbar = props.navbar;
    var confirmResource = navbar.confirmCreateResource;

    return (
      <Box>
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