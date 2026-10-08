import { test, expect } from "@jest/globals";
import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Cookies from "universal-cookie";
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
var eub = "edit-user-button";
var eut = "edit-user-title";
var sbub = "student-bulk-upload-button";
var abut = "admin-bulk-upload-title";
var aub = "add-user-button";
var auf = "add-user-form";
var sat = "super-admin-title";
test("NOTE: Tests 1-6 will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});
test("AdminViewUsers.test.tsx Test 1: should render Login Form component", () => {
    render(<Login />);

    expectElementWithTestIdToBeInDocument(lf);
});
test("AdminViewUsers.test.tsx Test 2: Should show roster page of the users for admin view using demo admin credentials", async () => {
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
});
test("AdminViewUsers.test.tsx Test 3: Should show Edit User Form when clicking the Edit Icon for admin view using demo admin credentials", async () => {
    render(<Login />);

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
test("AdminViewUsers.test.tsx Test 4: Should show Student Bulk Upload Form when clicking the Student Bulk Upload Button for admin view using demo admin credentials", async () => {
    render(<Login />);

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
test("AdminViewUsers.test.tsx Test 5: Should show Add User Form when clicking the Add User Button for admin view using demo admin credentials", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    });

    clickElementWithTestId(aub);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(auf);
    });
});
test("AdminViewUsers.test.tsx Test 6: Should show Edit User Form when clicking the Edit Icon for super admin view using super admin credentials (SKIL-795 regression)", async () => {
    // Previous tests logged in as the demo admin and never logged out, so their
    // auth cookies are still present. Clear them so Login renders the form
    // instead of auto-authenticating as the demo admin via checkAuthStatus().
    const cookies = new Cookies();
    cookies.remove('access_token');
    cookies.remove('refresh_token');
    cookies.remove('user');

    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(lf);
    });

    changeElementWithTestIdWithInput(ei, "superadminuser01@skillbuilder.edu");

    changeElementWithTestIdWithInput(pi, globalThis.SUPER_ADMIN_PASSWORD);

    clickElementWithTestId(lb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(sat);
    });

    await waitFor(() => {
        clickFirstElementWithTestId(eub);
    },{ timeout: 3000 });

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(eut);
    });
});
