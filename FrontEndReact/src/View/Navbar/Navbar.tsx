// @ts-expect-error TS(2307): Cannot find module 'react' or its corresponding ty... Remove this comment to see the full error message
import * as React from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
// @ts-expect-error TS(2307): Cannot find module '@mui/material/AppBar' or its c... Remove this comment to see the full error message
import AppBar from '@mui/material/AppBar';
// @ts-expect-error TS(2307): Cannot find module '@mui/material/Box' or its corr... Remove this comment to see the full error message
import Box from '@mui/material/Box';
// @ts-expect-error TS(2307): Cannot find module '@mui/material/Toolbar' or its ... Remove this comment to see the full error message
import Toolbar from '@mui/material/Toolbar';
// @ts-expect-error TS(2307): Cannot find module '@mui/material/Typography' or i... Remove this comment to see the full error message
import Typography from '@mui/material/Typography';
// @ts-expect-error TS(2307): Cannot find module '@mui/material/Button' or its c... Remove this comment to see the full error message
import Button from '@mui/material/Button';
// @ts-expect-error TS(2307): Cannot find module './NavbarImages/ExpandMoreFille... Remove this comment to see the full error message
import ExpandMoreFilled from './NavbarImages/ExpandMoreFilled.png';
// @ts-expect-error TS(2307): Cannot find module '@mui/material/Avatar' or its c... Remove this comment to see the full error message
import Avatar from '@mui/material/Avatar';
// @ts-expect-error TS(2307): Cannot find module '@mui/material/Menu' or its cor... Remove this comment to see the full error message
import Menu from '@mui/material/Menu';
// @ts-expect-error TS(2307): Cannot find module '@mui/material/MenuItem' or its... Remove this comment to see the full error message
import MenuItem from '@mui/material/MenuItem';
// import ListItemIcon from '@mui/material/ListItemIcon';
// @ts-expect-error TS(2307): Cannot find module '@mui/material/Divider' or its ... Remove this comment to see the full error message
import Divider from '@mui/material/Divider';
// import Settings from '@mui/icons-material/Settings';
import Logout from '../Logout/Logout.js';
// @ts-expect-error TS(2307): Cannot find module './sbText.png' or its correspon... Remove this comment to see the full error message
import Logo from "./sbText.png";

export default function ButtonAppBar(props: any) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    // @ts-expect-error TS(2307): Cannot find module 'react/jsx-runtime' or its corr... Remove this comment to see the full error message
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{
          backgroundColor:"white", 
          py:".1rem", 
          px:{xs:"0.25rem",md:"1rem"},
          display: "flex", 
          justifyContent: "space-between"}}>
          <Box
            component="img" sx={{height: 48, }}
            alt="SkillBuilder logo"
            src={Logo}
          />
          <Box component="div" sx={{ paddingLeft:{xs:"2rem"},display: 'flex', justifyContent:'space-between',alignItems:'center'}}>
            <Typography variant='h5' sx={{
                color:"black",
                fontFamily: "Roboto",
                fontSize: {xs:"12px",md:"14px"},
                fontStyle: "normal",
                fontWeight: "400 !important",
                lineHeight:"150%" 
                }} >
                {props.userName}
            </Typography>

            <Button aria-label='accountDropdown' sx={{minWidth:{xs:"40px"}}} onClick={handleClick} aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}>
              // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              <img src={ExpandMoreFilled} alt='ExpandMoreFilled'></img>
            </Button>

            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
            {/* Will be commented out until new features are added! */}
              <MenuItem  onClick={() => {
                props.setNewTab("UserAccount");
              }}>
                <Avatar /> My account
              </MenuItem>

              <Divider />

              <MenuItem  
                onClick={() => window.open('https://rubricapp.atlassian.net/servicedesk/customer/portal/1', '_blank')
                }>
                Support Center
              </MenuItem>

              <Divider />

              <MenuItem  onClick={() => {
                props.setNewTab("PrivacyPolicy");
              }}>
                Privacy Policy
              </MenuItem>

              <Divider />

              {/* <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem> */}
              <Logout logout={props.logout}/>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}