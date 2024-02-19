import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './View/Login/Login.js';
import './SBStyles.css';

function App() {
  return (
    <div className='app-body'>
      <BrowserRouter>
        <Routes>
          <Route path='*' element={<Navigate to='/'/>} />
          <Route path='/' element={<Login/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export const apiUrl = process.env.REACT_APP_API_URL;
export const superAdminPassword = process.env.REACT_APP_SUPER_ADMIN_PASSWORD;
export const demoAdminPassword = process.env.REACT_APP_DEMO_ADMIN_PASSWORD;
export const demoTaInstructorPassword = process.env.REACT_APP_DEMO_TA_INSTRUCTOR_PASSWORD;
export const demoStudentPassword = process.env.REACT_APP_DEMO_STUDENT_PASSWORD;
export default App;
