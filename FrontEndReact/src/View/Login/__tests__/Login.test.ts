// @ts-expect-error TS(2307): Cannot find module '@testing-library/react' or its... Remove this comment to see the full error message
import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "../Login.js";

import {
    clickElementWithAriaLabel,
    expectElementWithAriaLabelToBeInDocument,
    expectElementWithAriaLabelToHaveErrorMessage,
    changeElementWithAriaLabelWithInput
} from "../../../testUtilities.js";

import {
    superAdminPassword,
    demoAdminPassword,
    demoTaInstructorPassword,
    demoStudentPassword
} from "../../../App.js";



var lf = "loginForm";
var lb = "loginButton";
var ei = "emailInput";
var pi = "passwordInput";
var ema = "errorMessageAlert";
var sat = "superAdminTitle";
var ad = "accountDropdown";
var lob = "logoutButton";
var ct = "coursesTitle";
var fpb = "resetPasswordButton";
var vrt = "validateResetTitle";



// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("NOTE: Tests 7-10 will not pass if Demo Data is not loaded!", () => {
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(true).toBe(true);
});


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("Login.test.js Test 1: should render Login Form component", () => {
    // @ts-expect-error TS(2352): Conversion of type 'RegExp' to type 'Login' may be... Remove this comment to see the full error message
    render(<Login />);

    expectElementWithAriaLabelToBeInDocument(lf);
});


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("Login.test.js Test 2: HelperText should show Email cannot be empty with Email and Password not filled.", async () => {
    // @ts-expect-error TS(2352): Conversion of type 'RegExp' to type 'Login' may be... Remove this comment to see the full error message
    render(<Login />);

    clickElementWithAriaLabel(lb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(lf);

        expectElementWithAriaLabelToHaveErrorMessage(ei, "Email cannot be empty");
    });
});


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("Login.test.js Test 3: HelperText should show Email cannot be empty with Password filled, but not Email.", async () => {
    // @ts-expect-error TS(2352): Conversion of type 'RegExp' to type 'Login' may be... Remove this comment to see the full error message
    render(<Login />);

    changeElementWithAriaLabelWithInput(pi, "passwordTest123");

    clickElementWithAriaLabel(lb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(lf);

        expectElementWithAriaLabelToHaveErrorMessage(ei, "Email cannot be empty");
    });
});


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("Login.test.js Test 4: HelperText should show Password cannot be empty with Email filled, but not Password.", async () => {
    // @ts-expect-error TS(2352): Conversion of type 'RegExp' to type 'Login' may be... Remove this comment to see the full error message
    render(<Login />);

    changeElementWithAriaLabelWithInput(ei, "test21@test.com");

    clickElementWithAriaLabel(lb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(lf);

        expectElementWithAriaLabelToHaveErrorMessage(pi, "Password cannot be empty");
    });
});


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("Login.test.js Test 5: Error Message Component show error invalid credentials when email is invalid and password is not missing.", async () => {
    // @ts-expect-error TS(2352): Conversion of type 'RegExp' to type 'Login' may be... Remove this comment to see the full error message
    render(<Login />);

    changeElementWithAriaLabelWithInput(ei, "invalidEmail1@test.com");

    changeElementWithAriaLabelWithInput(pi, "testpassword123");

    clickElementWithAriaLabel(lb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(lf);

        expectElementWithAriaLabelToBeInDocument(ema);

        expectElementWithAriaLabelToHaveErrorMessage(ema, "An error occurred: Invalid Credentials");
    });
});


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("Login.test.js Test 6: Error Message Component should show error unable to verify when email is valid but password is invalid.", async () => {
    // @ts-expect-error TS(2352): Conversion of type 'RegExp' to type 'Login' may be... Remove this comment to see the full error message
    render(<Login />);

    changeElementWithAriaLabelWithInput(ei, "superadminuser01@skillbuilder.edu");

    changeElementWithAriaLabelWithInput(pi, "testpassword123");

    clickElementWithAriaLabel(lb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(lf);

        expectElementWithAriaLabelToBeInDocument(ema);

        expectElementWithAriaLabelToHaveErrorMessage(ema, "An error occurred: Invalid Credentials");
    });
});


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("Login.test.js Test 7: Should show users page for super admin view using super admin credentials", async () => {
    // @ts-expect-error TS(2352): Conversion of type 'RegExp' to type 'Login' may be... Remove this comment to see the full error message
    render(<Login />);

    changeElementWithAriaLabelWithInput(ei, "superadminuser01@skillbuilder.edu");

    changeElementWithAriaLabelWithInput(pi, superAdminPassword);

    clickElementWithAriaLabel(lb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(sat);
    });

    clickElementWithAriaLabel(ad);

    clickElementWithAriaLabel(lob);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(lf);
    });
});


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("Login.test.js Test 8: Should show courses page for admin view using demo admin credentials", async () => {
    // @ts-expect-error TS(2352): Conversion of type 'RegExp' to type 'Login' may be... Remove this comment to see the full error message
    render(<Login />);

    changeElementWithAriaLabelWithInput(ei, "demoadmin02@skillbuilder.edu");

    changeElementWithAriaLabelWithInput(pi, demoAdminPassword);

    clickElementWithAriaLabel(lb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickElementWithAriaLabel(ad);

    clickElementWithAriaLabel(lob);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(lf);
    });
});


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("Login.test.js Test 9: Should show courses page for ta/instructor view using demo ta/instructor credentials", async () => {
    // @ts-expect-error TS(2352): Conversion of type 'RegExp' to type 'Login' may be... Remove this comment to see the full error message
    render(<Login />);

    changeElementWithAriaLabelWithInput(ei, "demotainstructor03@skillbuilder.edu");

    changeElementWithAriaLabelWithInput(pi, demoTaInstructorPassword);

    clickElementWithAriaLabel(lb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickElementWithAriaLabel(ad);

    clickElementWithAriaLabel(lob);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(lf);
    });
});


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("Login.test.js Test 10: Should show courses page for student view using demo student credentials", async () => {
    // @ts-expect-error TS(2352): Conversion of type 'RegExp' to type 'Login' may be... Remove this comment to see the full error message
    render(<Login />);

    changeElementWithAriaLabelWithInput(ei, "demostudent4@skillbuilder.edu");

    changeElementWithAriaLabelWithInput(pi, demoStudentPassword + "4");

    clickElementWithAriaLabel(lb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickElementWithAriaLabel(ad);

    clickElementWithAriaLabel(lob);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(lf);
    });
});


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("Login.test.js Test 11: Should show Set New Password page when clicking Forgot Password Link.", async () => {
    // @ts-expect-error TS(2352): Conversion of type 'RegExp' to type 'Login' may be... Remove this comment to see the full error message
    render(<Login/>);

    clickElementWithAriaLabel(fpb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(vrt);
    });
});