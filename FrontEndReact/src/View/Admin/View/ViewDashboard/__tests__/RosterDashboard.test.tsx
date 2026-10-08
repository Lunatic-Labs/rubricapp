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
var lb = "login-submit-button";
var ei = "login-email-input";
var pi = "login-password-input";
var ct = "courses-title";
var vcib = "view-course-icon-button";
var rt = "roster-title";
var sbub = "student-bulk-upload-button";
var abut = "admin-bulk-upload-title";
var aub = "add-user-button";
var aut = "add-user-title";
var eut = "edit-user-title";
var eub = "edit-user-button";
var dub = "drop-user-button";
var dut = "drop-user-title";
test("NOTE: Tests 1-7 will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});
test("RosterDashboard.test.tsx Test 1: Should render Login Form component", () => {
    render(<Login />);

    expectElementWithTestIdToBeInDocument(lf);
});
test("RosterDashboard.test.tsx Test 2: Should show Admin View Courses when logging with Admin credentials", async () => {
    render(<Login />);

    changeElementWithTestIdWithInput(ei, "demoadmin02@skillbuilder.edu");

    changeElementWithTestIdWithInput(pi, globalThis.DEMO_ADMIN_PASSWORD);

    clickElementWithTestId(lb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });
});
test("RosterDashboard.test.tsx Test 3: Should show Roster Dashboard when clicking the view course button icon", async () => {
    render(<Login/>);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    });
});
test("RosterDashboard.test.tsx Test 4: Should show Student Bulkupload when clicking the student bulk upload button", async () => {
    render(<Login/>);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
       expectElementWithTestIdToBeInDocument(rt);
    });

    clickElementWithTestId(sbub);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(abut);
    });
});
test("RosterDashboard.test.tsx Test 5: Should show Add User page when clicking the add user button", async () => {
    render(<Login/>);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
       expectElementWithTestIdToBeInDocument(rt);
    });

    clickElementWithTestId(aub);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(aut);
    });
});
test("RosterDashboard.test.tsx Test 6: Should show Edit User page when clicking the edit user button", async () => {
    render(<Login/>);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    });

    await waitFor(() => {
        clickFirstElementWithTestId(eub);
    },{ timeout: 3000 });

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(eut);
    });
});
test("RosterDashboard.test.tsx Test 7: Should drop a user when clicking on the drop user button", async () => {
    render(<Login/>);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });
    
    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    });

    await waitFor(() => {
        clickFirstElementWithTestId(eub);
    },{ timeout: 3000 });

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(eut);
    });

    clickFirstElementWithTestId(dub);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(dut);
    });
});