import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../../../../Login/Login.js';

import {
    clickElementWithAriaLabel,
    expectElementWithAriaLabelToBeInDocument,
    expectElementWithAriaLabelToHaveErrorMessage,
    changeElementWithAriaLabelWithInput,
    clickFirstElementWithAriaLabel
} from '../../../../../testUtilities.js';

import {
    demoAdminPassword,
} from '../../../../../App.js';


var lf = "loginForm";
var lb = "loginButton";
var ei = 'emailInput';
var pi = 'passwordInput';
var ct = 'coursesTitle';
var vcib = "viewCourseIconButton";
var rt = "rosterTitle";
var bb = "backButton";



test("NOTE: Tests - will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});


test("RosterDashboard.test.js Test 1: Should render Login Form component", () => {
    render(<Login />);

    expectElementWithAriaLabelToBeInDocument(lf);
});


test("RosterDashboard.test.js Test 2: Should show Admin View Courses when logging with Admin credentials", async () => {
    render(<Login />);

    changeElementWithAriaLabelWithInput(ei, "demoadmin02@skillbuilder.edu");

    changeElementWithAriaLabelWithInput(pi, demoAdminPassword);

    clickElementWithAriaLabel(lb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });
});


test("RosterDashboard.test.js Test 3: Should show Roster Dashboard when clicking the view course button icon", async () => {
    render(<Login/>);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(rt);
    });
});


test("RosterDashboard.test.js Test 4: Should show View Courses page when clicking the back button icon", async () => {
    render(<Login/>);

    await waitFor(() => {
        clickFirstElementWithAriaLabel(vcib);

        expectElementWithAriaLabelToBeInDocument(rt);
    });

    clickElementWithAriaLabel(bb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });
});