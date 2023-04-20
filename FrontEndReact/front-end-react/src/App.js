import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import AdminAddUser from './View/Admin/AddUsers/AdminAddUser';
import AdminViewUsers from './View/Admin/ViewUsers/AdminViewUsers';
import AssessmentTask from './View/AssessmentTask/AssessmentTask';
import DataTable from './View/Admin/ViewCourses/muitable'

function App() {
  return (
    // <BrowserRouter>
    //   <Routes>
    //     <Route path='/' element={<Navigate to="/admin/view_users"/>} />
    //     <Route path='/admin/view_users' element={<AdminViewUsers/>} />
    //     <Route path='/admin/add_user' element={<AdminAddUser/>} />
    //     <Route path='/assessment_task' element={<AssessmentTask/>}/>
    //   </Routes>
    // </BrowserRouter>
    <DataTable></DataTable>
  );
}

export default App;