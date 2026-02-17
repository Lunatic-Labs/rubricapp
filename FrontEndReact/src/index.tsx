import React from 'react';
import ReactDOM from 'react-dom/client';
import './SBStyles.css';


const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <App />
    );
}
