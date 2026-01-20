import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// @ts-ignore: No type declarations for side-effect import of './SBStyles.css'
import './SBStyles.css';


const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <App />
    );
}
