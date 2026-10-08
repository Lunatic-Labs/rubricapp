import { test, expect } from "@jest/globals";
// import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
// import Login from "../../../../Login/Login";

// import {
//     clickElementWithTestId,
//     expectElementWithTestIdToBeInDocument,
//     changeElementWithTestIdWithInput,
//     clickFirstElementWithTestId
// } from "../../../../../testUtilities";


// var lb = "login-submit-button";
// var ei = "login-email-input";
// var pi = "login-password-input";
// var ct = "courses-title";
// var vcib = "view-course-icon-button";
// var rt = "roster-title";
// var at = "assessment-tab";
// var adt = "assessment-dashboard-title";
// var mhbb = "main-header-back-button";
// var vmcrb = "view-my-custom-rubrics-button";
// var acrt = "add-custom-rubric-title";
// var mcracrb = "my-custom-rubrics-add-custom-rubric-button"
test("NOTE: Tests 1-3 will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});

/* The rest of the tests will be redone due to updates that were made in my Custrom Rubrics*/

// test("AdminViewCustomRubrics.test.tsx Test 1: Should render the View Custom Rubrics page if the My Custom Rubrics button is clicked", async () => {
//     render(<Login />);

//     changeElementWithTestIdWithInput(ei, "demoadmin02@skillbuilder.edu");

//     changeElementWithTestIdWithInput(pi, globalThis.DEMO_ADMIN_PASSWORD);

//     clickElementWithTestId(lb);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(ct);
//     });

//     clickFirstElementWithTestId(vcib);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(rt);
//     });

//     clickElementWithTestId(at);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(adt);
//     });

//     clickElementWithTestId(vmcrb)

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(acrt);
//     });
// });


// test("AdminViewCustomRubrics.test.tsx Test 2: Should render the Add Custom Rubrics page if the Add Custom Rubrics button is clicked", async () => {
//     render(<Login />);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(ct);
//     });

//     clickFirstElementWithTestId(vcib);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(rt);
//     });

//     clickElementWithTestId(at);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(adt);
//     });

//     clickElementWithTestId(vmcrb);

//     clickElementWithTestId(mcracrb);

//     await waitFor(() => {
//         setTimeout(() => {
//             expectElementWithTestIdToBeInDocument(acrt);
//         }, 3000);
//     });
// });


// test("AdminViewCustomRubrics.test.tsx Test 3: Should render the Assessment Dashboard if the Back button on the My Custom Rubrics page is clicked", async () => {
//     render(<Login />);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(ct);
//     });

//     clickFirstElementWithTestId(vcib);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(rt);
//     });

//     clickElementWithTestId(at);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(adt);
//     });

//     clickElementWithTestId(vmcrb);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(acrt);
//     });

//     clickElementWithTestId(mhbb);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(adt);
//     });
// });