import { test, expect } from "@jest/globals";
// import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ResizeObserver from "resize-observer-polyfill";
// import Login from "../../../../Login/Login.tsx";

// import {
//     clickElementWithTestId,
//     expectElementWithTestIdToBeInDocument,
//     changeElementWithTestIdWithInput,
//     clickFirstElementWithTestId
// } from "../../../../../testUtilities";

global.ResizeObserver = ResizeObserver;

// var lf = "login-form";
// var lb = "login-submit-button";
// var ei = "login-email-input";
// var pi = "login-password-input";
// var ct = "courses-title";
// var vcib = "view-course-icon-button";
// var rt = "roster-title";
// var rpt = "reporting-tab";
// var vasb = "view-assessment-status-box";
// var mhbb = "main-header-back-button";
// var raft = "rating-and-feedback-tab";
// var avrb = "admin-view-ratings-box";
test("NOTE: Tests 1-7 will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});


// test("ReportingDashboard.test.tsx Test 1: Should render Login Form component", () => {
//     render(<Login />);

//     expectElementWithTestIdToBeInDocument(lf);
// });


// test("ReportingDashboard.test.tsx Test 2: Should show Admin View Courses when logging with Admin credentials", async () => {
//     render(<Login />);

//     changeElementWithTestIdWithInput(ei, "demoadmin02@skillbuilder.edu");

//     changeElementWithTestIdWithInput(pi, globalThis.DEMO_ADMIN_PASSWORD);

//     clickElementWithTestId(lb);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(ct);
//     });
// });


// test("ReportingDashboard.test.tsx Test 3: Should show Roster Dashboard when clicking the view course button icon", async () => {
//     render(<Login/>);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(ct);
//     });

//     clickFirstElementWithTestId(vcib);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(rt);
//     });
// });


// test("ReportingDashboard.test.tsx Test 4: Should show Assessment Status page when clicking the reporting tab", async () => {
//     render(<Login/>);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(ct);
//     });

//     clickFirstElementWithTestId(vcib);

//     await waitFor(() => {
//        expectElementWithTestIdToBeInDocument(rt);
//     });

//     clickElementWithTestId(rpt);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(vasb);
//     },{ timeout: 3000 });
// });


// test("ReportingDashboard.test.tsx Test 5: Should show Roster Dashboard when clicking the back button from the AssessmentStatus page.", async () => {
//     render(<Login/>);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(ct);
//     });

//     clickFirstElementWithTestId(vcib);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(rt);
//     });

//     clickElementWithTestId(rpt);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(vasb);
//     });
    
//     clickElementWithTestId(mhbb);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(rt);
//     });
// });


// test("ReportingDashboard.test.tsx Test 6: Should show Ratings and Feedback page when clicking the ratings and feedback tab", async () => {
//     render(<Login/>);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(ct);
//     });

//     clickFirstElementWithTestId(vcib);

//     await waitFor(() => {
//        expectElementWithTestIdToBeInDocument(rt);
//     });

//     clickElementWithTestId(rpt);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(vasb);

//         clickElementWithTestId(raft);
//     });

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(avrb);
//     });
// });


// test("ReportingDashboard.test.tsx Test 7: Should show Roster Dashboard when clicking the back button from the Ratings and Feedback page.", async () => {
//     render(<Login/>);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(ct);

//         clickFirstElementWithTestId(vcib);
//     });

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(rt);

//         clickElementWithTestId(rpt);
//     });

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(vasb);
//     });

//     clickElementWithTestId(raft);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(avrb);
//     });

//     clickElementWithTestId(mhbb);

//     await waitFor(() => {
//         setTimeout(() => {
//             expectElementWithTestIdToBeInDocument(rt);
//         }, 3000);
//     });
// });