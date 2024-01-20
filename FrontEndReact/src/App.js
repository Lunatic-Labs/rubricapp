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

export const API_URL = process.env.REACT_APP_API_URL;
export const super_admin_password = process.env.REACT_APP_SUPER_ADMIN_PASSWORD;
export const demo_admin_password = process.env.REACT_APP_DEMO_ADMIN_PASSWORD;
export const demo_ta_instructor_password = process.env.REACT_APP_DEMO_TA_INSTRUCTOR_PASSWORD;
export const demo_student_password = process.env.REACT_APP_DEMO_STUDENT_PASSWORD;
export default App;