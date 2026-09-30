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
var ad = "account-dropdown";
var lob = "logout-button";
var ct = "courses-title";
var ac = "add-course";
var act = "add-course-title";
var ecib = "edit-course-icon-button";
var vcib = "view-course-icon-button";
var rt = "roster-title";
test("NOTE: Tests 1-7 will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});
test("AdminViewCourses.test.tsx Test 1: Should render Login Form component", () => {
    render(<Login />);

    expectElementWithTestIdToBeInDocument(lf);
});
test("AdminViewCourses.test.tsx Test 2: Should show courses page for admin view using demo admin credentials", async () => {
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
test("AdminViewCourses.test.tsx Test 3: Should show courses page for ta/instructor view using demo ta/instructor credentials", async () => {
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
test("AdminViewCourses.test.tsx Test 4: Should show courses page for student view using demo student credentials", async () => {
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
test("AdminViewCourses.test.tsx Test 5: Should show add course page for admin view using demo admin credentials and clicking add course button", async () =>{
    render(<Login />);

    changeElementWithTestIdWithInput(ei, "demoadmin02@skillbuilder.edu");

    changeElementWithTestIdWithInput(pi, globalThis.DEMO_ADMIN_PASSWORD);

    clickElementWithTestId(lb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickElementWithTestId(ac);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(act);
    });
});
test("AdminViewCourses.test.tsx Test 6: Should show edit course page for admin view using demo admin credentials and clicking edit course button", async () =>{
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(ecib);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(act);
    });
});
test("AdminViewCourses.test.tsx Test 7: Should show view course page for admin view using demo admin credentials and clicking view course button", async () =>{
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    });
});