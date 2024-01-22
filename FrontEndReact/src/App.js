import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './View/Login/Login';
import './SBStyles.css';
import AdminAddCustomRubric from './View/Admin/Add/AddCustomRubric/AdminAddCustomRubric';

function App() {
  return (
    <div className='app-body'>
      <BrowserRouter>
        <Routes>
          <Route path='*' element={<Navigate to='/'/>} />
          {/* <Route path='/' element={<Login/>} /> */}
          <Route path='/' element={<AdminAddCustomRubric/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export const API_URL = process.env.REACT_APP_API_URL;
export default App;