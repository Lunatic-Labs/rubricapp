import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "../../../../Login/Login.js";

import {
    clickElementWithAriaLabel,
    expectElementWithAriaLabelToBeInDocument,
    changeElementWithAriaLabelWithInput,
    clickFirstElementWithAriaLabel
} from "../../../../../testUtilities.js";

import {
    demoAdminPassword,
    demoTaInstructorPassword,
    demoStudentPassword
} from "../../../../../App.js";



var lf = "loginForm";
var lb = "loginButton";
var ei = "emailInput";
var pi = "passwordInput";
var ad = "accountDropdown";
var lob = "logoutButton";
var ct = "coursesTitle";
var ac = "addCourse";
var act = "addCourseTitle";
var ecib = "editCourseIconButton";
var vcib = "viewCourseIconButton";
var rt = "rosterTitle";



test("NOTE: Tests 1-7 will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});


test("AdminViewCourses.test.js Test 1: should render Login Form component", () => {
    render(<Login />);

    expectElementWithAriaLabelToBeInDocument(lf);
});


test("AdminViewCourses.test.js Test 2: Should show courses page for admin view using demo admin credentials", async () => {
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


test("AdminViewCourses.test.js Test 3: Should show courses page for ta/instructor view using demo ta/instructor credentials", async () => {
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


test("AdminViewCourses.test.js Test 4: Should show courses page for student view using demo student credentials", async () => {
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


test("AdminViewCourses.test.js Test 5: Should show add course page for admin view using demo admin credentials and clicking add course button", async () =>{
    render(<Login />);

    changeElementWithAriaLabelWithInput(ei, "demoadmin02@skillbuilder.edu");

    changeElementWithAriaLabelWithInput(pi, demoAdminPassword);

    clickElementWithAriaLabel(lb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickElementWithAriaLabel(ac);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(act);
    });
});


test("AdminViewCourses.test.js Test 6: Should show edit course page for admin view using demo admin credentials and clicking edit course button", async () =>{
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(ecib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(act);
    });
});


test("AdminViewCourses.test.js Test 7: Should show view course page for admin view using demo admin credentials and clicking view course button", async () =>{
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(rt);
    });
});