import * as React from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ExpandMoreFilled from './NavbarImages/ExpandMoreFilled.png';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
// import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
// import Settings from '@mui/icons-material/Settings';
import Logout from '../Logout/Logout.js';
import Logo from "./sbText.png";

export default function ButtonAppBar(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
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