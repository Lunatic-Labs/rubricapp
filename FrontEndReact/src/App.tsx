import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './View/Login/Login';
import './SBStyles.css';

function App() {
  return (
    <div className='app-body'>
      <BrowserRouter future={{ 
        v7_startTransition: true,   // enables React 18 startTransition
        v7_relativeSplatPath: true, // enables relative routing with splats
      }}>
        <Routes>
          <Route path='*' element={<Navigate to='/'/>} />
          <Route path='/' element={<Login/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export const apiUrl = import.meta.env.VITE_API_URL;
export default App;
