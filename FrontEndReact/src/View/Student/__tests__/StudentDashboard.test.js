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
    demoStudentPassword
} from "../../../App.js";

var lb = "loginButton";
var ei = "emailInput";
var pi = "passwordInput";
var ct = "coursesTitle";
var vcib = "viewCourseIconButton";
var matt = "myAssessmentTasksTitle";
var catt = "completedAssessmentTasksTitle";
var mtt = "myTeamsTitle";
var catb = "completedAssessmentTasksButton";



test("NOTE: Tests 1-?? will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});


test("StudentDashboard.test.js Test 1: Should render assessment tasks, completed assessments and team tables if valid Student information is input to login", async () => {
    render(<Login />);

    changeElementWithAriaLabelWithInput(ei, "demostudent4@skillbuilder.edu");

    changeElementWithAriaLabelWithInput(pi, demoStudentPassword);

    clickElementWithAriaLabel(lb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(matt);

        expectElementWithAriaLabelToBeInDocument(catt);

        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(mtt);
        }, 3000);
    });
});


test("StudentDashboard.test.js Test 2: Should render the completed assessment task page if the complete assessment task button is clicked ", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(matt);

        expectElementWithAriaLabelToBeInDocument(catt);

        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(mtt);
        }, 3000);
    });
    
    await waitFor(() => {
        clickElementWithAriaLabel(catb);
    });

});