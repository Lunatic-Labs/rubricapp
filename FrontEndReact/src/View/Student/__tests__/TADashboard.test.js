import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "../../Login/Login.js";

import {
    clickElementWithAriaLabel,
    expectElementWithAriaLabelToBeInDocument,
    changeElementWithAriaLabelWithInput,
    clickFirstElementWithAriaLabel
} from "../../../testUtilities.js";

import {
    demoTaInstructorPassword
} from "../../../App.js";



var lb = "loginButton";
var ei = "emailInput";
var pi = "passwordInput";
var ct = "coursesTitle";
var matt = "myAssessmentTasksTitle";
var catt = "completedAssessmentTasksTitle";
var vcib = "viewCourseIconButton";
var catb = "completedAssessmentTasksButton";
var catvib = "completedAssessmentTasksViewIconButton";
var vatit = "viewAssessmentTaskInstructionsTitle";



test("NOTE: Tests 1-3 will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});


test("AdminAddCourse.test.js Test 1: Should render both assessment tables if valid TA information is input to login", async () => {
    render(<Login />);

    changeElementWithAriaLabelWithInput(ei, "demotainstructor03@skillbuilder.edu");

    changeElementWithAriaLabelWithInput(pi, demoTaInstructorPassword);

    clickElementWithAriaLabel(lb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(matt);

        expectElementWithAriaLabelToBeInDocument(catt);
    });
});


test("AdminAddCourse.test.js Test 2: Should render the completed assessment task page if the complete assessment task button is clicked", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(matt);

        expectElementWithAriaLabelToBeInDocument(catt);

        clickFirstElementWithAriaLabel(catb);
    });
        
    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(vatit);
        }, 3000);
    });
});


test("AdminAddCourse.test.js Test 3: Should render the view completed assessment task page if the view button is clicked", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(matt);

        expectElementWithAriaLabelToBeInDocument(catt);
    });
        
    await waitFor(() => {
        setTimeout(() => {
            clickFirstElementWithAriaLabel(catvib);

            expectElementWithAriaLabelToBeInDocument(vatit);
        }, 3000);
    });
});