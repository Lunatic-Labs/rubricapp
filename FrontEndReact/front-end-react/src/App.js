import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminAddUser from './View/Admin/AddUsers/AdminAddUser';
import AdminViewUsers from './View/Admin/ViewUsers/AdminViewUsers';
import AdminViewAssessmentTask from './View/Admin/ViewAssessmentTask/AdminViewAssessmentTask';
import AdminViewCourses from './View/Admin/ViewCourses/AdminViewCourses';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to="/admin/view_users"/>} />
        <Route path='/admin/view_users' element={<AdminViewUsers/>} />
        <Route path='/admin/view_assessment_task' element={<AdminViewAssessmentTask/>}/>
        <Route path='/admin/view_courses' element={<AdminViewCourses/>}/>
        <Route path='/admin/add_user' element={<AdminAddUser/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;