import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './View/Login/Login';
import './SBStyles.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='*' element={<Navigate to='/'/>} />
        <Route path='/' element={<Login/>} />
    </Routes>
    </BrowserRouter>
  );
}
export const API_URL = process.env.REACT_APP_API_URL;
export default App;
