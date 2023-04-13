import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import AdminAddUser from './View/Admin/AddUsers/AdminAddUser';
import AdminViewUsers from './View/Admin/ViewUsers/AdminViewUsers';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to="/admin/view_users"/>} />
        <Route path='/admin/view_users' element={<AdminViewUsers/>} />
        <Route path='/admin/add_user' element={<AdminAddUser/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;