import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './View/Login/Login';
import './App.css';

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

export default App;