import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../../../../Login/Login.js';

import {
    clickElementWithAriaLabel,
    expectElementWithAriaLabelToBeInDocument,
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
var rpt = "reportingTab";
var vasb = "viewAssessmentStatusBox";



test("NOTE: Tests ?-? will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});


test("ReportingDashboard.test.js Test 1: Should render Login Form component", () => {
    render(<Login />);

    expectElementWithAriaLabelToBeInDocument(lf);
});


test("ReportingDashboard.test.js Test 2: Should show Admin View Courses when logging with Admin credentials", async () => {
    render(<Login />);

    changeElementWithAriaLabelWithInput(ei, "demoadmin02@skillbuilder.edu");

    changeElementWithAriaLabelWithInput(pi, demoAdminPassword);

    clickElementWithAriaLabel(lb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });
});


test("ReportingDashboard.test.js Test 3: Should show Roster Dashboard when clicking the view course button icon", async () => {
    render(<Login/>);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(rt);
    });
});


test("ReportingDashboard.test.js Test 4: Should show Reporting Dashboard when clicking the reporting tab", async () => {
    render(<Login/>);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
       expectElementWithAriaLabelToBeInDocument(rt);
    });

    clickElementWithAriaLabel(rpt);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(vasb);
    });
});