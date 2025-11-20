import React, { FC } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './View/Login/Login';
import './SBStyles.css';

const App: FC = () => (
  <div className="app-body">
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  </div>
);

export const apiUrl: string | undefined = process.env.REACT_APP_API_URL;
export const superAdminPassword: string | undefined = process.env.REACT_APP_SUPER_ADMIN_PASSWORD;
export const demoAdminPassword: string | undefined = process.env.REACT_APP_DEMO_ADMIN_PASSWORD;
export const demoTaInstructorPassword: string | undefined = process.env.REACT_APP_DEMO_TA_INSTRUCTOR_PASSWORD;
export const demoStudentPassword: string | undefined = process.env.REACT_APP_DEMO_STUDENT_PASSWORD;

export default App;