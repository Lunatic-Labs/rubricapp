// @ts-expect-error TS(2307): Cannot find module 'react' or its corresponding ty... Remove this comment to see the full error message
import React from 'react';
// @ts-expect-error TS(2307): Cannot find module 'react-dom/client' or its corre... Remove this comment to see the full error message
import ReactDOM from 'react-dom/client';
import './SBStyles.css';
import App from './App.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // @ts-expect-error TS(2307): Cannot find module 'react/jsx-runtime' or its corr... Remove this comment to see the full error message
    <App />
);
