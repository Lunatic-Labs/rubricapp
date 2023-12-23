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
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Settings from '@mui/icons-material/Settings';
import Logout from '../Logout/Logout';

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
    <div>
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{
          backgroundColor:"white", 
          py:"0.5rem", 
          px:{xs:"0.5rem",md:"1rem"},
          display: "flex", 
          justifyContent: "space-between"}}>
          <Typography variant="h6" component="div" sx={{
                color: "#2E8BEF",
                fontFeatureSettings: "'clig' off, 'liga' off",
                fontFamily: "Roboto",
                fontSize: {xs:"24px", md:"24px"},
                fontStyle: "normal",
                fontWeight: "500",
                lineHeight: "160%",
                letterSpacing: "0.15px"
            }}>
                SkillBuilder
            </Typography>
            <Box component="div" sx={{ paddingLeft:{xs:"2rem"},display: 'flex', justifyContent:'space-between',alignItems:'center'}}>
            <Typography variant='h5' sx={{
                color:"black",
                fontFamily: "Roboto",
                fontSize: {xs:"12px",md:"14px"},
                fontStyle: "normal",
                fontWeight: "400 !important",
                lineHeight:"150%" 
                }} >
                {props.user_name}
              </Typography>
              <Button sx={{minWidth:{xs:"40px"}}} onClick={handleClick} aria-controls={open ? 'account-menu' : undefined}
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
        <MenuItem onClick={handleClose}>
          <Avatar /> My account
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Logout/>
          </ListItemIcon>
        </MenuItem>
      </Menu>
      </Box>
        </Toolbar>
      </AppBar>
    </Box>
    </div>
  );
}

// Copy over code into AppState:
// import StudentConfirmCurrentTeam from '../Student/View/ConfirmCurrentTeam/StudentConfirmCurrentTeam';
// import StudentBuildTeam from '../Student/View/BuildTeam/StudentBuildTeam';
// import StudentViewAssessmentTaskInstructions from '../Student/View/AssessmentTask/StudentViewAssessmentTaskInstructions'
// // import StudentViewAssessmentTask from '../Student/View/AssessmentTask/StudentViewAssessmentTask';

// this.setAssessmentTaskInstructions = (assessment_tasks, assessment_task_id) => {
//     var assessment_task = null;
//     for(var index = 0; index < assessment_tasks.length; index++) {
//         if(assessment_tasks[index]["assessment_task_id"]===assessment_task_id) {
//             assessment_task = assessment_tasks[index];
//         }
//     }
//     this.setState({
//         activeTab: "AssessmentTaskInstructions",
//         chosen_assessment_task: assessment_task
//     });
// }
// this.setConfirmCurrentTeam = (team, users) => {
//     this.setState({
//         activeTab: "ConfirmCurrentTeam",
//         team: team,
//         users: users
//     });
// }

// StudentDashboard Page
// NOTE: SKIL-161 
// setAssessmentTaskInstructions={this.setAssessmentTaskInstructions}
// setConfirmCurrentTeam={this.setConfirmCurrentTeam}


//         </div>
//     </>
// }
// {this.state.activeTab==="AssessmentTaskInstructions"&&
//   // NOTE: SKIL-161 
//   <>
//     <div
//         style={{
//             backgroundColor: '#F8F8F8',
//             height: "100vh%",
//             paddingBottom: "10rem"
//         }}
//     >
//         <Button
//             variant='filledTonal'
//             size='small'
//             // TODO: Add proper functionality to Back Button
//             onClick={() => {
//                 this.setNewTab("StudentDashboard");
//             }}
//             style={{
//                 backgroundColor:'#dcdcdc',
//                 position:'absolute',
//                 borderRadius: '21px',
//                 top: '80px',
//                 left: '32px'
//             }}
//         >
//             <ArrowBackIos style={{ fontSize: 12, color: '#2E8BEF' }}/>
//             <Typography
//                 variant='body2'
//                 style={{ fontSize: '12px' }}
//             >
//                 Back
//             </Typography>
//         </Button>
//         <StudentViewAssessmentTaskInstructions
//             // Variables to pass
//             students={this.state.users}
//             chosenCourse={this.state.chosenCourse}
//             chosen_assessment_task={this.state.chosen_assessment_task}
//         />
//     </div>
//   </>
// }
// {this.state.activeTab==="BuildNewTeam" &&
//     // NOTE: SKIL-161 
//     <>
//         <div style={{ backgroundColor: '#F8F8F8' }}>
//             <div >
//                 {/*"Back" button*/}
//                 <Button
//                     variant='filledTonal'
//                     size='small'
//                     // TODO: Add proper functionality to Back Button
//                     onClick={() => {
//                         this.setState({
//                                 activeTab: "Courses",
//                         })
//                     }}
//                     style={{
//                         backgroundColor:'#dcdcdc',
//                         position:'absolute',
//                         borderRadius: '21px',
//                         top: '80px',
//                         left: '32px'
//                     }}
//                     >
//                     <ArrowBackIos style={{ fontSize: 12, color: '#2E8BEF' }}/>
//                     <Typography variant='body2'
//                         style={{ fontSize: '12px' }}
//                     >
//                         Back
//                     </Typography>
//                 </Button>
//             </div>
//             <StudentBuildTeam
//               // Variables to pass
//               students={this.state.users}
//               chosenCourse={this.state.chosenCourse}
//             />
//         </div>                      
//     </>
// }
// {this.state.activeTab==="ConfirmCurrentTeam" &&
// // NOTE: SKIL-161
// // Handles the button and view for SelectTeamMembers View
//     <>
//       { console.log(this.state) }
//         <div style={{ backgroundColor: '#F8F8F8' }}>
//             <div >
//                 {/*"Back" button*/}
//                 <Button
//                     variant='filledTonal'
//                     size='small'
//                     // TODO: Add proper functionality to Back Button
//                     onClick={() => {
//                         this.setNewTab("StudentDashboard");
//                     }}
//                     style={{
//                         backgroundColor:'#dcdcdc',
//                         position:'absolute',
//                         borderRadius: '21px',
//                         top: '80px',
//                         left: '32px'
//                     }}
//                     >
//                     <ArrowBackIos style={{ fontSize: 12, color: '#2E8BEF' }}/>
//                     <Typography variant='body2'
//                         style={{ fontSize: '12px' }}
//                     >
//                         Back
//                     </Typography>
//                 </Button>
//             </div>
//             <StudentConfirmCurrentTeam
//               // Variables to pass
//               students={this.state.users}
//               chosenCourse={this.state.chosenCourse}
//             />
//         </div>
//     </>
// }
// {this.state.activeTab==="CodeRequirement"&&
//   <>
//     <div className='container'>
//     {console.log(this.state)}
//       <div style ={{backgroundColor:'#F8F8F8'}}></div>
//         <div >
//           <Button
//             variant='filledTonal'
//             size='small'
//             onClick={() => {
//               this.setState({
//                 activeTab: "",
//               })
//             }}
//           style={{
//               backgroundColor:'#dcdcdc',
//               position:'absolute',
//               borderRadius: '21px',
//               top: '80px',
//               left: '10px'
//             }}
//           >
//           <ArrowBackIos style={{ fontSize: 12, color: '#2E8BEF' }}/>
//           <Typography variant='body2'
//             style={{ fontSize: '12px' }}
//           >
//             Back
//           </Typography>
//         </Button>