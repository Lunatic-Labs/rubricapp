import { test, expect } from "@jest/globals";
import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ResizeObserver } from "@juggle/resize-observer";
import Login from "../../Login/Login";

import {
    clickElementWithTestId,
    expectElementWithTestIdToBeInDocument,
    changeElementWithTestIdWithInput,
    clickFirstElementWithTestId
} from "../../../testUtilities";

global.ResizeObserver = ResizeObserver;

var lb = "login-submit-button";
var ei = "login-email-input";
var pi = "login-password-input";
var ct = "courses-title";
var vcib = "view-course-icon-button";
var vcmh = "view-course-main-header";
var mhbb = "main-header-back-button";
var rot = "roster-tab";
var rt = "roster-title";
var tt = "teams-tab";
var at = "assessment-tab";
var rept = "reporting-tab";
var td = "team-dashboard";
var ad = "assessment-dashboard";
var repd = "reporting-dashboard";
test("NOTE: Tests 1-9 will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});
test("Header.test.tsx Test 1: Should render the MainHeader component given the View Course button is clicked", async () => {
    render(<Login />);

    changeElementWithTestIdWithInput(ei, "demoadmin02@skillbuilder.edu");

    changeElementWithTestIdWithInput(pi, globalThis.DEMO_ADMIN_PASSWORD);

    clickElementWithTestId(lb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(vcmh);
    });
});
test("MainHeader.test.tsx Test 2: Clicking the back button on the MainHeader component should go to the page that came before the current (ViewCourseAdmin)", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(vcmh);
    });

    clickElementWithTestId(mhbb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });
});
test("MainHeader.test.tsx Test 3: Clicking the view button for a given course provides the correct course title", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(vcmh);
    });
});
test("MainHeader.test.tsx Test 4: Clicking a View Course button on the main page should render all four tabs", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rot);

        expectElementWithTestIdToBeInDocument(at);

        expectElementWithTestIdToBeInDocument(tt);

        expectElementWithTestIdToBeInDocument(rept);
    });
});
test("MainHeader.test.tsx Test 5: Ensure that clicking the view button for a given course will render the rosterDashboard by default", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    });
});
test("MainHeader.test.tsx Test 6: Ensure that clicking the rosterTab will render the rosterDashboard", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    });

    clickElementWithTestId(rot);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    });
});
test("MainHeader.test.tsx Test 7: Ensure that clicking the teamTab will render the teamDashboard", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    });

    clickElementWithTestId(tt);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(td);
    });
});
test("MainHeader.test.tsx Test 8: Ensure that clicking the assessmentTab will render the assessmentDashboard", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    });

    clickElementWithTestId(at);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ad);
    });
});
test("MainHeader.test.tsx Test 9: Ensure that clicking the reportingTab will render the reportingDashboard", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    });

    clickElementWithTestId(rept);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(repd);
    });
});