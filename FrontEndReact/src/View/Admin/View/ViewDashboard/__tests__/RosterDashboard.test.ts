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
    demoAdminPassword,
} from "../../../../../App.js";



var lf = "loginForm";
var lb = "loginButton";
var ei = "emailInput";
var pi = "passwordInput";
var ct = "coursesTitle";
var vcib = "viewCourseIconButton";
var rt = "rosterTitle";
var sbub = "studentBulkUploadButton";
var abut = "adminBulkUploadTitle";
var aub = "addUserButton";
var aut = "addUserTitle";
var eut = "editUserTitle";
var eub = "editUserButton";
var dub = "dropUserButton";
var dut = "dropUserTitle";



// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("NOTE: Tests 1-7 will not pass if Demo Data is not loaded!", () => {
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(true).toBe(true);
});


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("RosterDashboard.test.js Test 1: Should render Login Form component", () => {
    // @ts-expect-error TS(2352): Conversion of type 'RegExp' to type 'Login' may be... Remove this comment to see the full error message
    render(<Login />);

    expectElementWithAriaLabelToBeInDocument(lf);
});


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("RosterDashboard.test.js Test 2: Should show Admin View Courses when logging with Admin credentials", async () => {
    // @ts-expect-error TS(2352): Conversion of type 'RegExp' to type 'Login' may be... Remove this comment to see the full error message
    render(<Login />);

    changeElementWithAriaLabelWithInput(ei, "demoadmin02@skillbuilder.edu");

    changeElementWithAriaLabelWithInput(pi, demoAdminPassword);

    clickElementWithAriaLabel(lb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });
});


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("RosterDashboard.test.js Test 3: Should show Roster Dashboard when clicking the view course button icon", async () => {
    // @ts-expect-error TS(2352): Conversion of type 'RegExp' to type 'Login' may be... Remove this comment to see the full error message
    render(<Login/>);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(rt);
    });
});


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("RosterDashboard.test.js Test 4: Should show Student Bulkupload when clicking the student bulk upload button", async () => {
    // @ts-expect-error TS(2352): Conversion of type 'RegExp' to type 'Login' may be... Remove this comment to see the full error message
    render(<Login/>);

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
test("RosterDashboard.test.js Test 5: Should show Add User page when clicking the add user button", async () => {
    // @ts-expect-error TS(2352): Conversion of type 'RegExp' to type 'Login' may be... Remove this comment to see the full error message
    render(<Login/>);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
       expectElementWithAriaLabelToBeInDocument(rt);
    });

    clickElementWithAriaLabel(aub);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(aut);
    });
});


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("RosterDashboard.test.js Test 6: Should show Edit User page when clicking the edit user button", async () => {
    // @ts-expect-error TS(2352): Conversion of type 'RegExp' to type 'Login' may be... Remove this comment to see the full error message
    render(<Login/>);

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
test("RosterDashboard.test.js Test 7: Should drop a user when clicking on the drop user button", async () => {
    // @ts-expect-error TS(2352): Conversion of type 'RegExp' to type 'Login' may be... Remove this comment to see the full error message
    render(<Login/>);

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

    clickFirstElementWithAriaLabel(dub);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(dut);
    });
});