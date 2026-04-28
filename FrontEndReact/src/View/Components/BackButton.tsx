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
      boxShadow: "none",
    },
  }));

interface BackButtonProps {
    navbar: any;
}

export default function BackButton (props: BackButtonProps){
    return (
      <Box>
        <ColorButton
          size='medium'
          onClick={() => {
            props.navbar.setState({
              activeTab: "Courses",
              chosenCourse: null
            });
          }}
          variant="contained"
          startIcon={<ArrowBackIcon/>}
        >
          Back
        </ColorButton>
      </Box>
    );
}