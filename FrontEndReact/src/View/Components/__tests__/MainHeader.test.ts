// @ts-expect-error TS(2307): Cannot find module '@testing-library/react' or its... Remove this comment to see the full error message
import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
// @ts-expect-error TS(2307): Cannot find module 'resize-observer-polyfill' or i... Remove this comment to see the full error message
import ResizeObserver from "resize-observer-polyfill";
import Login from "../../Login/Login.js";

import {
    clickElementWithAriaLabel,
    expectElementWithAriaLabelToBeInDocument,
    changeElementWithAriaLabelWithInput,
    clickFirstElementWithAriaLabel
} from "../../../testUtilities.js";

import {
    demoAdminPassword
} from "../../../App.js";

// @ts-expect-error TS(2304): Cannot find name 'global'.
global.ResizeObserver = ResizeObserver;

var lb = "loginButton";
var ei = "emailInput";
var pi = "passwordInput";
var ct = "coursesTitle";
var vcib = "viewCourseIconButton";
var vcmh = "viewCourseMainHeader";
var mhbb = "mainHeaderBackButton";
var rot = "rosterTab";
var rt = "rosterTitle";
var tt = "teamsTab";
var at = "assessmentTab";
var rept = "reportingTab";
var td = "teamDashboard";
var ad = "assessmentDashboard";
var repd = "reportingDashboard";



// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("NOTE: Tests 1-9 will not pass if Demo Data is not loaded!", () => {
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(true).toBe(true);
});


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("Header.test.js Test 1: Should render the MainHeader component given the View Course button is clicked", async () => {
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
        expectElementWithAriaLabelToBeInDocument(vcmh);
    });
});


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("MainHeader.test.js Test 2: Clicking the back button on the MainHeader component should go to the page that came before the current (ViewCourseAdmin)", async () => {
    // @ts-expect-error TS(2352): Conversion of type 'RegExp' to type 'Login' may be... Remove this comment to see the full error message
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(vcmh);
    });

    clickElementWithAriaLabel(mhbb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });
});


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("MainHeader.test.js Test 3: Clicking the view button for a given course provides the correct course title", async () => {
    // @ts-expect-error TS(2352): Conversion of type 'RegExp' to type 'Login' may be... Remove this comment to see the full error message
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(vcmh);
    });
});


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("MainHeader.test.js Test 4: Clicking a View Course button on the main page should render all four tabs", async () => {
    // @ts-expect-error TS(2352): Conversion of type 'RegExp' to type 'Login' may be... Remove this comment to see the full error message
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(rot);

        expectElementWithAriaLabelToBeInDocument(at);

        expectElementWithAriaLabelToBeInDocument(tt);

        expectElementWithAriaLabelToBeInDocument(rept);
    });
});


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("MainHeader.test.js Test 5: Ensure that clicking the view button for a given course will render the rosterDashboard by default", async () => {
    // @ts-expect-error TS(2352): Conversion of type 'RegExp' to type 'Login' may be... Remove this comment to see the full error message
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(rt);
    });
});


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("MainHeader.test.js Test 6: Ensure that clicking the rosterTab will render the rosterDashboard", async () => {
    // @ts-expect-error TS(2352): Conversion of type 'RegExp' to type 'Login' may be... Remove this comment to see the full error message
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(rt);
    });

    clickElementWithAriaLabel(rot);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(rt);
    });
});


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("MainHeader.test.js Test 7: Ensure that clicking the teamTab will render the teamDashboard", async () => {
    // @ts-expect-error TS(2352): Conversion of type 'RegExp' to type 'Login' may be... Remove this comment to see the full error message
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(rt);
    });

    clickElementWithAriaLabel(tt);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(td);
    });
});


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("MainHeader.test.js Test 8: Ensure that clicking the assessmentTab will render the assessmentDashboard", async () => {
    // @ts-expect-error TS(2352): Conversion of type 'RegExp' to type 'Login' may be... Remove this comment to see the full error message
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(rt);
    });

    clickElementWithAriaLabel(at);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ad);
    });
});


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("MainHeader.test.js Test 9: Ensure that clicking the reportingTab will render the reportingDashboard", async () => {
    // @ts-expect-error TS(2352): Conversion of type 'RegExp' to type 'Login' may be... Remove this comment to see the full error message
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(rt);
    });

    clickElementWithAriaLabel(rept);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(repd);
    });
});