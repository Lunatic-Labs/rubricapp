import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './View/Navbar/Navbar';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navbar />} />
      </Routes>
    </BrowserRouter>
  );
}
export const API_URL = process.env.REACT_APP_API_URL;
export default App;