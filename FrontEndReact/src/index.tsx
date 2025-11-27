import React from 'react';
import ReactDOM from 'react-dom/client';
// @ts-ignore: No type declarations for side-effect import of './SBStyles.css'
import './SBStyles.css';
import App from './App';

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <App />
    );
}
