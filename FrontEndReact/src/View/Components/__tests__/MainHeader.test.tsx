import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
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
test("NOTE: Tests 1-9 will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});
test("Header.test.js Test 1: Should render the MainHeader component given the View Course button is clicked", async () => {
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
test("MainHeader.test.js Test 2: Clicking the back button on the MainHeader component should go to the page that came before the current (ViewCourseAdmin)", async () => {
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
test("MainHeader.test.js Test 3: Clicking the view button for a given course provides the correct course title", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(vcmh);
    });
});
test("MainHeader.test.js Test 4: Clicking a View Course button on the main page should render all four tabs", async () => {
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
test("MainHeader.test.js Test 5: Ensure that clicking the view button for a given course will render the rosterDashboard by default", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(rt);
    });
});
test("MainHeader.test.js Test 6: Ensure that clicking the rosterTab will render the rosterDashboard", async () => {
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
test("MainHeader.test.js Test 7: Ensure that clicking the teamTab will render the teamDashboard", async () => {
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
test("MainHeader.test.js Test 8: Ensure that clicking the assessmentTab will render the assessmentDashboard", async () => {
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
test("MainHeader.test.js Test 9: Ensure that clicking the reportingTab will render the reportingDashboard", async () => {
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