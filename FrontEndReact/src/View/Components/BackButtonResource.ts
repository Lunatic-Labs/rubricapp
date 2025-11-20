// @ts-expect-error TS(2307): Cannot find module '@mui/material/Button' or its c... Remove this comment to see the full error message
import Button from '@mui/material/Button';
// @ts-expect-error TS(2307): Cannot find module '@mui/icons-material/ArrowBack'... Remove this comment to see the full error message
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// @ts-expect-error TS(2307): Cannot find module '@mui/material/colors' or its c... Remove this comment to see the full error message
import { grey } from '@mui/material/colors';
// @ts-expect-error TS(2307): Cannot find module '@mui/material/styles' or its c... Remove this comment to see the full error message
import { styled } from '@mui/material/styles';
// @ts-expect-error TS(2307): Cannot find module '@mui/material' or its correspo... Remove this comment to see the full error message
import { Box } from '@mui/material';

const ColorButton = styled(Button)(({
  theme
}: any) => ({
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
export default function BackButtonResource (props: any){
    var navbar = props.navbar;
    var confirmResource = navbar.confirmCreateResource;

    return (
      <Box>
        // @ts-expect-error TS(2749): 'ColorButton' refers to a value, but is being used... Remove this comment to see the full error message
        <ColorButton
          // @ts-expect-error TS(2552): Cannot find name 'onClick'. Did you mean 'onclick'... Remove this comment to see the full error message
          onClick={() => {
            confirmResource(props.tabSelected, 0);
          }}
          // @ts-expect-error TS(2304): Cannot find name 'variant'.
          variant="contained"
          // @ts-expect-error TS(2304): Cannot find name 'startIcon'.
          startIcon={<ArrowBackIcon/>}
          // @ts-expect-error TS(2304): Cannot find name 'aria'.
          aria-label="mainHeaderBackButton"
        >
          // @ts-expect-error TS(2304): Cannot find name 'Back'.
          Back
        </ColorButton>
      </Box>
    );
}