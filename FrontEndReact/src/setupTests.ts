// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
// jest-environment-jsdom does not provide fetch/Headers/Request/Response.
import 'whatwg-fetch';
// jsdom v21+ makes window.location unconfigurable/unforgeable; this patches
// it back to a mockable Location with jest spies on reload/assign/replace.
import 'jest-location-mock';
import dotenv from 'dotenv';
import path from 'node:path';
import ResizeObserver from 'resize-observer-polyfill';

// Polyfill TextEncoder/TextDecoder for jsPDF in jsdom test environment
import { TextEncoder, TextDecoder } from 'util';
Object.assign(global, { TextEncoder, TextDecoder });

// jsdom doesn't implement ResizeObserver; MUI components (date pickers, mui-datatables) need it.
global.ResizeObserver = ResizeObserver;

// jsdom doesn't implement matchMedia; MUI's useMediaQuery needs it.
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

dotenv.config({ path: path.resolve(__dirname, '../.env') });

globalThis.SUPER_ADMIN_PASSWORD = String(process.env.VITE_SUPER_ADMIN_PASSWORD);
globalThis.DEMO_ADMIN_PASSWORD = String(process.env.VITE_DEMO_ADMIN_PASSWORD);
globalThis.DEMO_TA_INSTRUCTOR_PASSWORD = String(process.env.VITE_DEMO_TA_INSTRUCTOR_PASSWORD);
globalThis.DEMO_STUDENT_PASSWORD = String(process.env.VITE_DEMO_STUDENT_PASSWORD);

export {};
