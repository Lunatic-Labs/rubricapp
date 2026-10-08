import { test, expect } from "@jest/globals";
import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "../../../../Login/Login";

import {
    clickElementWithTestId,
    expectElementWithTestIdToBeInDocument,
    changeElementWithTestIdWithInput,
    clickFirstElementWithTestId,
    expectElementWithTestIdToHaveErrorMessage
} from "../../../../../testUtilities";


var lb = "login-submit-button";
var ei = "login-email-input";
var pi = "login-password-input";
var ct = "courses-title";
var vcib = "view-course-icon-button";
var mhbb = "main-header-back-button";
var tt = "teams-tab";
var rt = "roster-title";
var td = "team-dashboard";
var aatb = "admin-add-team-button";
var aatt = "admin-add-team-title";
var catb = "cancel-add-team-button";
var aosatb = "add-or-save-add-team-button";
var atf = "add-team-form";
var utni = "user-team-name-input";
test("NOTE: Tests 1-5 will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});
test("AdminAddTeam.test.tsx Test 1: Should render the TeamDashboard", async () => {
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
test("AdminAddTeam.test.tsx Test 2: Should render the Add Team page if the adminAddTeam button is clicked", async () => {
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
test("AdminAddTeam.test.tsx Test 3: Should render the teams dashboard if the back button on the Add Team page is clicked", async () => {
    render(<Login/>);

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

    clickElementWithTestId(mhbb);
    
    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(td);
    });
});
test("AdminAddTeam.test.tsx Test 4: Should render the teams dashboard if the cancel button on the Add Team page is clicked", async () => {
    render(<Login/>);

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

    clickElementWithTestId(catb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(td);
    });
});
test("AdminAddTeam.test.tsx Test 5: HelperText errors should show for Team Name text field when no information is filled", async () => {
    render(<Login/>);

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

    clickElementWithTestId(aosatb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(atf);

        expectElementWithTestIdToHaveErrorMessage(utni,"Team name cannot be empty");
    });
});