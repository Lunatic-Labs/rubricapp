// @ts-expect-error TS(2307): Cannot find module 'react-router-dom' or its corre... Remove this comment to see the full error message
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './View/Login/Login.js';
import './SBStyles.css';

function App() {
  return (
    // @ts-expect-error TS(2304): Cannot find name 'div'.
    <div className='app-body'>
      // @ts-expect-error TS(2304): Cannot find name 'future'.
      <BrowserRouter future={{ 
        // @ts-expect-error TS(2695): Left side of comma operator is unused and has no s... Remove this comment to see the full error message
        v7_startTransition: true,   // enables React 18 startTransition
        // @ts-expect-error TS(2304): Cannot find name 'v7_relativeSplatPath'.
        v7_relativeSplatPath: true, // enables relative routing with splats
      }}>
        <Routes>
          // @ts-expect-error TS(2304): Cannot find name 'path'.
          <Route path='*' element={<Navigate to='/'/>} />
          // @ts-expect-error TS(2304): Cannot find name 'path'.
          <Route path='/' element={<Login/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

// @ts-expect-error TS(2591): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
export const apiUrl = process.env.REACT_APP_API_URL;
// @ts-expect-error TS(2591): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
export const superAdminPassword = process.env.REACT_APP_SUPER_ADMIN_PASSWORD;
// @ts-expect-error TS(2591): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
export const demoAdminPassword = process.env.REACT_APP_DEMO_ADMIN_PASSWORD;
// @ts-expect-error TS(2591): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
export const demoTaInstructorPassword = process.env.REACT_APP_DEMO_TA_INSTRUCTOR_PASSWORD;
// @ts-expect-error TS(2591): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
export const demoStudentPassword = process.env.REACT_APP_DEMO_STUDENT_PASSWORD;
export default App;
