import { test, expect } from "@jest/globals";
// import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
// import Login from "../../Login/Login";

// import {
//     clickElementWithTestId,
//     expectElementWithTestIdToBeInDocument,
//     changeElementWithTestIdWithInput,
//     clickFirstElementWithTestId
// } from "../../../testUtilities";

// import {
//     demoStudentPassword
// } from "../../../App";



// var lb = "login-submit-button";
// var ei = "login-email-input";
// var pi = "login-password-input";
// var ct = "courses-title";
// var vcib = "view-course-icon-button";
// var matt = "my-assessment-tasks-title";
// var catt = "completed-assessment-tasks-title";
// var mtt = "my-teams-title";
// var satb = "start-assessment-tasks-button";
// var vatit = "view-assessment-task-instructions-title";
// var catvib = "completed-assessment-tasks-view-icon-button";
// var mhbb = "main-header-back-button";
test("NOTE: Tests 1-6 will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});


// test("StudentDashboard.test.tsx Test 1: Should render assessment tasks, completed assessments and team tables if valid Student information is input to login", async () => {
//     render(<Login />);

//     changeElementWithTestIdWithInput(ei, "demostudent4@skillbuilder.edu");

//     changeElementWithTestIdWithInput(pi, demoStudentPassword + "4");

//     clickElementWithTestId(lb);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(ct);
//     });

//     clickFirstElementWithTestId(vcib);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(matt);

//         expectElementWithTestIdToBeInDocument(catt);

//         setTimeout(() => {
//             expectElementWithTestIdToBeInDocument(mtt);
//         }, 3000);
//     });
// });


// test("StudentDashboard.test.tsx Test 2: Should render the completed assessment task page if the complete assessment task button is clicked", async () => {
//     render(<Login />);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(ct);
//     });

//     clickFirstElementWithTestId(vcib);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(matt);

//         expectElementWithTestIdToBeInDocument(catt);

//         setTimeout(() => {
//             expectElementWithTestIdToBeInDocument(mtt);
//         }, 3000);

//         clickFirstElementWithTestId(satb);
//     });

//     await waitFor(() => {
//         setTimeout(() => {
//             expectElementWithTestIdToBeInDocument(vatit);
//         }, 3000);
//     });
// });


// test("StudentDashboard.test.tsx Test 3: Should render the view completed assessment task page if the view button is clicked", async () => {
//     render(<Login />);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(ct);
//     });

//     clickFirstElementWithTestId(vcib);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(matt);

//         expectElementWithTestIdToBeInDocument(catt);

//         setTimeout(() => {
//             expectElementWithTestIdToBeInDocument(mtt);
//         }, 3000);
//     });

//     await waitFor(() => {
//         setTimeout(() => {
//             clickFirstElementWithTestId(catvib);

//             expectElementWithTestIdToBeInDocument(vatit);
//         }, 3000);
//     });
// });


// test("StudentDashboard.test.tsx Test 4: Should render the course dashboard if the back button on assessment tasks, completed assessments and team tables page is clicked", async () => {
//     render(<Login />);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(ct);
//     });

//     clickFirstElementWithTestId(vcib);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(matt);

//         expectElementWithTestIdToBeInDocument(catt);

//         setTimeout(() => {
//             expectElementWithTestIdToBeInDocument(mtt);
//         }, 3000);
//     });

//     clickElementWithTestId(mhbb);

//     await waitFor(() => {
//         setTimeout(() => {
//            expectElementWithTestIdToBeInDocument(ct);
//         }, 3000);
//     });

// });


// test("StudentDashboard.test.tsx Test 5: Should render the assessment tasks, completed assessments and team tables dashboard if the back button on viewAssessmentTaskInstructions is clicked", async () => {
//     render(<Login />);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(ct);
//     });

//     clickFirstElementWithTestId(vcib);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(matt);

//         expectElementWithTestIdToBeInDocument(catt);

//         setTimeout(() => {
//             expectElementWithTestIdToBeInDocument(mtt);
//         }, 3000);

//         clickFirstElementWithTestId(satb);
//     });

//     await waitFor(() => {
//         setTimeout(() => {
//             expectElementWithTestIdToBeInDocument(vatit);
//         }, 3000);
//     });

//     clickElementWithTestId(mhbb);

//     await waitFor(() => {
//         setTimeout(() => {
//             expectElementWithTestIdToBeInDocument(matt);

//             expectElementWithTestIdToBeInDocument(catt);

//             expectElementWithTestIdToBeInDocument(mtt);
//         }, 3000);
//     });
// });


// test("StudentDashboard.test.tsx Test 6: Should render the assessment tasks, completed assessments and team tables dashboard if the back button on CompletedAssessmentTaskInstructions is clicked", async () => {
//     render(<Login />);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(ct);
//     });

//     clickFirstElementWithTestId(vcib);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(matt);

//         expectElementWithTestIdToBeInDocument(catt);

//         setTimeout(() => {
//             expectElementWithTestIdToBeInDocument(mtt);
//         }, 3000);
//     });

//     await waitFor(() => {
//         setTimeout(() => {
//             clickFirstElementWithTestId(catvib);

//             expectElementWithTestIdToBeInDocument(vatit);
//         }, 3000);
//     });

//     clickElementWithTestId(mhbb);

//     await waitFor(() => {
//         setTimeout(() => {
//             expectElementWithTestIdToBeInDocument(matt);

//             expectElementWithTestIdToBeInDocument(catt);

//             expectElementWithTestIdToBeInDocument(mtt);
//         }, 3000);
//     });
// });