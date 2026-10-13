import { test, expect } from "@jest/globals";
import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "../../../../Login/Login";

import {
    clickElementWithTestId,
    expectElementWithTestIdToBeInDocument,
    changeElementWithTestIdWithInput,
    clickFirstElementWithTestId
} from "../../../../../testUtilities";

var lf = "login-form";
var ei = "login-email-input";
var pi = "login-password-input";
var ct = "courses-title";
var vcib = "view-course-icon-button";
var rt = "roster-title";
var tt = "teams-tab";
var td = "team-dashboard";
var abub = "admin-bulk-upload-button";
var abut = "admin-bulk-upload-title";
var aatb = "admin-add-team-button";
var aatt = "admin-add-team-title";
var etib = "edit-team-icon-button";
var aett = "admin-edit-team-title";
var vtib = "view-teams-icon-button";
var avtmt = "admin-view-team-members-title";
var lb = "login-submit-button";
test("NOTE: Tests 1-6 will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});
test("AdminViewTeams.test.tsx Test 1: Should render Login Form component", () => {
    render(<Login />);

    expectElementWithTestIdToBeInDocument(lf);
});
test("AdminViewTeams.test.tsx Test 2: Should render the Team Dashboard in Admin View",  async () => {
    render(<Login />);

    changeElementWithTestIdWithInput(ei, "demoadmin02@skillbuilder.edu");

    changeElementWithTestIdWithInput(pi, globalThis.DEMO_ADMIN_PASSWORD);

    clickElementWithTestId(lb);

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
test("AdminViewTeams.test.tsx Test 3: Should render the Team Bulk Upload page given the Team Bulk Upload Button is clicked on Admin View.",  async () => {
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

    await waitFor(() => {
        clickElementWithTestId(abub);
    },{ timeout: 3000 });

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(abut);
    });
});
test("AdminViewTeams.test.tsx Test 4: Should render the Add Team Form given the Add Team Button is clicked on Admin View.",  async () => {
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

    await waitFor(() => {
        clickElementWithTestId(aatb);
    },{ timeout: 3000 });

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(aatt);
    });
});
test("AdminViewTeams.test.tsx Test 5: Should render the Edit Team Form given the Edit Icon is clicked on Admin View.",  async () => {
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

    await waitFor(() => {
        clickFirstElementWithTestId(etib);
    },{ timeout: 3000 });

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(aett);
    });
});
test("AdminViewTeams.test.tsx Test 6: Should render the Team Name page given the View Team Members button is clicked on Admin View.",  async () => {
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

    await waitFor(() => {
            clickFirstElementWithTestId(vtib);
    },{ timeout: 3000 });

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(avtmt);
    });
});