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
var satb = "startAssessmentTasksButton";
var vatit = "viewAssessmentTaskInstructionsTitle";
var catvib = "completedAssessmentTasksViewIconButton";
var mhbb = "mainHeaderBackButton";



test("NOTE: Tests 1-6 will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});


// test("StudentDashboard.test.js Test 1: Should render assessment tasks, completed assessments and team tables if valid Student information is input to login", async () => {
//     render(<Login />);

//     changeElementWithAriaLabelWithInput(ei, "demostudent4@skillbuilder.edu");

//     changeElementWithAriaLabelWithInput(pi, demoStudentPassword + "4");

//     clickElementWithAriaLabel(lb);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(ct);
//     });

//     clickFirstElementWithAriaLabel(vcib);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(matt);

//         expectElementWithAriaLabelToBeInDocument(catt);

//         expectElementWithAriaLabelToBeInDocument(mtt);

//     });
// });


// test("StudentDashboard.test.js Test 2: Should render the completed assessment task page if the complete assessment task button is clicked", async () => {
//     render(<Login />);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(ct);
//     });

//     clickFirstElementWithAriaLabel(vcib);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(matt);

//         expectElementWithAriaLabelToBeInDocument(catt);

//         expectElementWithAriaLabelToBeInDocument(mtt);

//         clickFirstElementWithAriaLabel(satb);
//     });

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(vatit);
//     });
// });


// test("StudentDashboard.test.js Test 3: Should render the view completed assessment task page if the view button is clicked", async () => {
//     render(<Login />);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(ct);
//     });

//     clickFirstElementWithAriaLabel(vcib);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(matt);

//         expectElementWithAriaLabelToBeInDocument(catt);

//         expectElementWithAriaLabelToBeInDocument(mtt);
//     });

//     await waitFor(() => {
//         setTimeout(() => {
//             clickFirstElementWithAriaLabel(catvib);

//             expectElementWithAriaLabelToBeInDocument(vatit);
//         }, 3000);
//     });
// });


// test("StudentDashboard.test.js Test 4: Should render the course dashboard if the back button on assessment tasks, completed assessments and team tables page is clicked", async () => {
//     render(<Login />);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(ct);
//     });

//     clickFirstElementWithAriaLabel(vcib);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(matt);

//         expectElementWithAriaLabelToBeInDocument(catt);

//         expectElementWithAriaLabelToBeInDocument(mtt);
//     });

//     clickElementWithAriaLabel(mhbb);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(ct);
//     });

// });


// test("StudentDashboard.test.js Test 5: Should render the assessment tasks, completed assessments and team tables dashboard if the back button on viewAssessmentTaskInstructions is clicked", async () => {
//     render(<Login />);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(ct);
//     });

//     clickFirstElementWithAriaLabel(vcib);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(matt);

//         expectElementWithAriaLabelToBeInDocument(catt);

//         expectElementWithAriaLabelToBeInDocument(mtt);

//         clickFirstElementWithAriaLabel(satb);
//     });

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(vatit);
//     });

//     clickElementWithAriaLabel(mhbb);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(matt);

//         expectElementWithAriaLabelToBeInDocument(catt);

//         expectElementWithAriaLabelToBeInDocument(mtt);
//     });
// });


// test("StudentDashboard.test.js Test 6: Should render the assessment tasks, completed assessments and team tables dashboard if the back button on CompletedAssessmentTaskInstructions is clicked", async () => {
//     render(<Login />);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(ct);
//     });

//     clickFirstElementWithAriaLabel(vcib);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(matt);

//         expectElementWithAriaLabelToBeInDocument(catt);

//         expectElementWithAriaLabelToBeInDocument(mtt);
//     });

//     await waitFor(() => {
//         setTimeout(() => {
//             clickFirstElementWithAriaLabel(catvib);

//             expectElementWithAriaLabelToBeInDocument(vatit);
//         }, 3000);
//     });

//     clickElementWithAriaLabel(mhbb);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(matt);

//         expectElementWithAriaLabelToBeInDocument(catt);

//         expectElementWithAriaLabelToBeInDocument(mtt);
//     });
// });