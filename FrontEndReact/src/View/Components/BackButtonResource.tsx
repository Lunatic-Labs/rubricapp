import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import { grey } from '@mui/material/colors';
import { styled, Theme } from '@mui/material';
import { Box } from '@mui/material';

const ColorButton = styled(Button)(({ theme }: { theme: Theme }) => ({
    borderRadius:"100px",
    boxShadow: "none",
    // Old: color: theme.palette.getContrastText(grey[300]),
    // Old: backgroundColor: grey[300],
    color: 'var(--back-button-text)',
    backgroundColor: 'var(--back-button-bg) !important',
    '&:hover': {
      // Old: backgroundColor: grey[400],
      backgroundColor: 'var(--back-button-bg-hover) !important',
      boxShadow: "none",
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
      // Old: <Box>
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