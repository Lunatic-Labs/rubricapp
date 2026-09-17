import { test, expect } from "@jest/globals";
import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "../Login";

import {
    clickElementWithTestId,
    expectElementWithTestIdToBeInDocument,
    expectElementWithTestIdToHaveErrorMessage,
    changeElementWithTestIdWithInput
} from "../../../testUtilities";

var lf = "login-form";
var lb = "login-submit-button";
var ei = "login-email-input";
var pi = "login-password-input";
var ema = "error-message-alert";
var sat = "super-admin-title";
var ad = "account-dropdown";
var lob = "logout-button";
var ct = "courses-title";
var fpb = "reset-password-button";
var vrt = "validate-reset-title";


test("NOTE: Tests 7-10 will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});
test("Login.test.tsx Test 1: should render Login Form component", () => {
    render(<Login />);

    expectElementWithTestIdToBeInDocument(lf);
});
test("Login.test.tsx Test 2: HelperText should show Email cannot be empty with Email and Password not filled.", async () => {
    render(<Login />);

    clickElementWithTestId(lb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(lf);

        expectElementWithTestIdToHaveErrorMessage(ei, "Email cannot be empty");
    });
});
test("Login.test.tsx Test 3: HelperText should show Email cannot be empty with Password filled, but not Email.", async () => {
    render(<Login />);

    changeElementWithTestIdWithInput(pi, "passwordTest123");

    clickElementWithTestId(lb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(lf);

        expectElementWithTestIdToHaveErrorMessage(ei, "Email cannot be empty");
    });
});
test("Login.test.tsx Test 4: HelperText should show Password cannot be empty with Email filled, but not Password.", async () => {
    render(<Login />);

    changeElementWithTestIdWithInput(ei, "test21@test.com");

    clickElementWithTestId(lb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(lf);

        expectElementWithTestIdToHaveErrorMessage(pi, "Password cannot be empty");
    });
});
test("Login.test.tsx Test 5: Error Message Component show error invalid credentials when email is invalid and password is not missing.", async () => {
    render(<Login />);

    changeElementWithTestIdWithInput(ei, "invalidEmail1@test.com");

    changeElementWithTestIdWithInput(pi, "testpassword123");

    clickElementWithTestId(lb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(lf);

        expectElementWithTestIdToBeInDocument(ema);

        expectElementWithTestIdToHaveErrorMessage(ema, "An error occurred: Invalid Credentials");
    });
});
test("Login.test.tsx Test 6: Error Message Component should show error unable to verify when email is valid but password is invalid.", async () => {
    render(<Login />);

    changeElementWithTestIdWithInput(ei, "superadminuser01@skillbuilder.edu");

    changeElementWithTestIdWithInput(pi, "testpassword123");

    clickElementWithTestId(lb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(lf);

        expectElementWithTestIdToBeInDocument(ema);

        expectElementWithTestIdToHaveErrorMessage(ema, "An error occurred: Invalid Credentials");
    });
});
test("Login.test.tsx Test 7: Should show users page for super admin view using super admin credentials", async () => {
    render(<Login />);

    changeElementWithTestIdWithInput(ei, "superadminuser01@skillbuilder.edu");

    changeElementWithTestIdWithInput(pi, globalThis.SUPER_ADMIN_PASSWORD);

    clickElementWithTestId(lb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(sat);
    });

    clickElementWithTestId(ad);

    clickElementWithTestId(lob);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(lf);
    });
});
test("Login.test.tsx Test 8: Should show courses page for admin view using demo admin credentials", async () => {
    render(<Login />);

    changeElementWithTestIdWithInput(ei, "demoadmin02@skillbuilder.edu");

    changeElementWithTestIdWithInput(pi, globalThis.DEMO_ADMIN_PASSWORD);

    clickElementWithTestId(lb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickElementWithTestId(ad);

    clickElementWithTestId(lob);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(lf);
    });
});
test("Login.test.tsx Test 9: Should show courses page for ta/instructor view using demo ta/instructor credentials", async () => {
    render(<Login />);

    changeElementWithTestIdWithInput(ei, "demotainstructor03@skillbuilder.edu");

    changeElementWithTestIdWithInput(pi, globalThis.DEMO_TA_INSTRUCTOR_PASSWORD);

    clickElementWithTestId(lb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickElementWithTestId(ad);

    clickElementWithTestId(lob);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(lf);
    });
});
test("Login.test.tsx Test 10: Should show courses page for student view using demo student credentials", async () => {
    render(<Login />);

    changeElementWithTestIdWithInput(ei, "demostudent4@skillbuilder.edu");

    changeElementWithTestIdWithInput(pi, globalThis.DEMO_STUDENT_PASSWORD + "4");

    clickElementWithTestId(lb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickElementWithTestId(ad);

    clickElementWithTestId(lob);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(lf);
    });
});
test("Login.test.tsx Test 11: Should show Set New Password page when clicking Forgot Password Link.", async () => {
    render(<Login/>);

    clickElementWithTestId(fpb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(vrt);
    });
});
