// @ts-expect-error TS(2307): Cannot find module '@testing-library/react' or its... Remove this comment to see the full error message
import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "../../../../Login/Login.js";

import {
    clickElementWithAriaLabel,
    expectElementWithAriaLabelToBeInDocument,
    changeElementWithAriaLabelWithInput,
    clickFirstElementWithAriaLabel
} from "../../../../../testUtilities.js";

import {
    demoAdminPassword
} from "../../../../../App.js";



var lf = "loginForm";
var lb = "loginButton";
var ei = "emailInput";
var pi = "passwordInput";
var ct = "coursesTitle";
var vcib = "viewCourseIconButton";
var rt = "rosterTitle";
var eub = "editUserButton";
var eut = "editUserTitle";
var sbub = "studentBulkUploadButton";
var abut = "adminBulkUploadTitle";
var aub = "addUserButton";
var auf = "addUserForm";



// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("NOTE: Tests 1-5 will not pass if Demo Data is not loaded!", () => {
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(true).toBe(true);
});


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("AdminViewUsers.test.js Test 1: should render Login Form component", () => {
    // @ts-expect-error TS(2352): Conversion of type 'RegExp' to type 'Login' may be... Remove this comment to see the full error message
    render(<Login />);

    expectElementWithAriaLabelToBeInDocument(lf);
});


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("AdminViewUsers.test.js Test 2: Should show roster page of the users for admin view using demo admin credentials", async () => {
    // @ts-expect-error TS(2352): Conversion of type 'RegExp' to type 'Login' may be... Remove this comment to see the full error message
    render(<Login />);

    changeElementWithAriaLabelWithInput(ei, "demoadmin02@skillbuilder.edu");

    changeElementWithAriaLabelWithInput(pi, demoAdminPassword);

    clickElementWithAriaLabel(lb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(rt);
    });
});


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("AdminViewUsers.test.js Test 3: Should show Edit User Form when clicking the Edit Icon for admin view using demo admin credentials", async () => {
    // @ts-expect-error TS(2352): Conversion of type 'RegExp' to type 'Login' may be... Remove this comment to see the full error message
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(rt);
    });

    await waitFor(() => {
        clickFirstElementWithAriaLabel(eub);
    },{ timeout: 3000 });

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(eut);
    });
});


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("AdminViewUsers.test.js Test 4: Should show Student Bulk Upload Form when clicking the Student Bulk Upload Button for admin view using demo admin credentials", async () => {
    // @ts-expect-error TS(2352): Conversion of type 'RegExp' to type 'Login' may be... Remove this comment to see the full error message
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(rt);
    });

    clickElementWithAriaLabel(sbub);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(abut);
    });
});


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("AdminViewUsers.test.js Test 5: Should show Add User Form when clicking the Add User Button for admin view using demo admin credentials", async () => {
    // @ts-expect-error TS(2352): Conversion of type 'RegExp' to type 'Login' may be... Remove this comment to see the full error message
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(rt);
    });

    clickElementWithAriaLabel(aub);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(auf);
    });
});