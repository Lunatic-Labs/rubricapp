// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Polyfill TextEncoder/TextDecoder for jsPDF in jsdom test environment
import { TextEncoder, TextDecoder } from 'util';
Object.assign(global, { TextEncoder, TextDecoder });

import dotenv from 'dotenv';
dotenv.config({ path : '../.env}'});

globalThis.SUPER_ADMIN_PASSWORD = String(process.env.REACT_APP_SUPER_ADMIN_PASSWORD);
globalThis.DEMO_ADMIN_PASSWORD = String(process.env.REACT_APP_DEMO_ADMIN_PASSWORD);
globalThis.DEMO_TA_INSTRUCTOR_PASSWORD = String(process.env.REACT_APP_DEMO_TA_INSTRUCTOR_PASSWORD);
globalThis.DEMO_STUDENT_PASSWORD = String(process.env.REACT_APP_DEMO_STUDENT_PASSWORD);

export {};
