import { test, expect } from "@jest/globals";
// import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
//import Login from "../../Login/Login.tsx";

// import {
//     clickElementWithTestId,
//     expectElementWithTestIdToBeInDocument,
//     changeElementWithTestIdWithInput,
//     clickFirstElementWithTestId
// } from "../../../testUtilities";

// import {
//     demoTaInstructorPassword
// } from "../../../App";



// var lb = "login-submit-button";
// var ei = "login-email-input";
// var pi = "login-password-input";
// var ct = "courses-title";
// var matt = "my-assessment-tasks-title";
// var catt = "completed-assessment-tasks-title";
// var vcib = "view-course-icon-button";
// var satb = "start-assessment-tasks-button";
// var catvib = "completed-assessment-tasks-view-icon-button";
// var vatit = "view-assessment-task-instructions-title";
// var mhbb = "main-header-back-button";
// var vaticb = "view-assessment-task-instructions-continue-button";
// var rs = "ratings-section";
// var ocs = "observable-characteristics-section";
// var sfis = "suggestions-for-improvement-section";
// var cbs = "comment-box-section";
// var rb = "refresh-button";
// var sb = "save-button";



test("NOTE: Tests 1-9 will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});


// test("TADashboard.test.tsx Test 1: Should render both assessment tables if valid TA information is input to login.", async () => {
//     render(<Login />);

//     changeElementWithTestIdWithInput(ei, "demotainstructor03@skillbuilder.edu");

//     changeElementWithTestIdWithInput(pi, demoTaInstructorPassword);

//     clickElementWithTestId(lb);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(ct);

//     });

//     clickFirstElementWithTestId(vcib);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(matt);

//         expectElementWithTestIdToBeInDocument(catt);
//     });
// });


// test("TADashboard.test.tsx Test 2: Should render the completed assessment task page if the complete assessment task button is clicked.", async () => {
//     render(<Login />);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(ct);

//         clickFirstElementWithTestId(vcib);
//     });

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(matt);

//         expectElementWithTestIdToBeInDocument(catt);
//     });

//     setTimeout(() => {
//         clickFirstElementWithTestId(satb);
//     }, 3000);
        
//     await waitFor(() => {
//         setTimeout(() => {
//             expectElementWithTestIdToBeInDocument(vatit);
//         }, 3000);
//     });
// });


// test("TADashboard.test.tsx Test 3: Should render the view completed assessment task page if the view button is clicked.", async () => {
//     render(<Login />);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(ct);
//     });

//     clickFirstElementWithTestId(vcib);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(matt);

//         expectElementWithTestIdToBeInDocument(catt);
//     });
        
//     await waitFor(() => {
//         setTimeout(() => {
//             clickFirstElementWithTestId(catvib);

//             expectElementWithTestIdToBeInDocument(vatit);
//         }, 3000);
//     });
// });


// test("TADashboard.test.tsx Test 4: Should render to the course dashboard when the back button is clicked on my Assessment Tasks and Completed Assessments page.", async () => {
//     render(<Login />);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(ct);
//     });

//     clickFirstElementWithTestId(vcib);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(matt);

//         expectElementWithTestIdToBeInDocument(catt);
//     });

//     setTimeout(() => {
//         clickElementWithTestId(mhbb);
//     }, 3000);
    
//     await waitFor(() => {
//         setTimeout(() => {
//             expectElementWithTestIdToBeInDocument(ct);
//         }, 3000);
//     });
// });


// test("TADashboard.test.tsx Test 5: Should render to the my Assessment Tasks and Completed Assessments page when the back button is clicked on the viewAssessmentTaskInstructions page.", async () => {
//     render(<Login />);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(ct);
//     });

//     clickFirstElementWithTestId(vcib);

//     await waitFor(() => {
//         setTimeout(() => {
//             expectElementWithTestIdToBeInDocument(matt);

//             expectElementWithTestIdToBeInDocument(catt);

//             clickFirstElementWithTestId(satb);
//         }, 3000);
        
//     });
    
//     await waitFor(() => {
//         setTimeout(() => {
//             expectElementWithTestIdToBeInDocument(vatit);

//             clickElementWithTestId(mhbb);
//         }, 3000);
//     });
    
//     await waitFor(() => {
//         setTimeout(() => {
//             expectElementWithTestIdToBeInDocument(matt);

//             expectElementWithTestIdToBeInDocument(catt);
//         }, 3000);
//     });
// });


// test("TADashboard.test.tsx Test 6: Should render to the Feedback page of the Assessment Task when the continue button is selected.", async () => {
//     render(<Login />);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(ct);
//     });

//     clickFirstElementWithTestId(vcib);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(matt);

//         expectElementWithTestIdToBeInDocument(catt);

//         setTimeout(() => {
//             clickFirstElementWithTestId(satb);
//         }, 3000);
//     });
    
//     await waitFor(() => {
//         setTimeout(() => {
//             expectElementWithTestIdToBeInDocument(vatit);

//             clickElementWithTestId(vaticb);
//         }, 3000);
//     });

//     await waitFor(() => {
//         setTimeout(() => {
//             expectElementWithTestIdToBeInDocument(rs);

//             expectElementWithTestIdToBeInDocument(ocs);

//             expectElementWithTestIdToBeInDocument(sfis);

//             expectElementWithTestIdToBeInDocument(cbs);
//         }, 3000);
//     });
// });


// test("TADashboard.test.tsx Test 7: Should render to the my Assessment Tasks and Completed Assessments page when the back button is clicked on the sections page.", async () => {
//     render(<Login />);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(ct);
//     });

//     clickFirstElementWithTestId(vcib);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(matt);

//         expectElementWithTestIdToBeInDocument(catt);

//         clickFirstElementWithTestId(satb);
//     });
    
//     await waitFor(() => {
//         setTimeout(() => {
//             expectElementWithTestIdToBeInDocument(vatit);

//             clickElementWithTestId(vaticb);
//         }, 3000);
//     });

//     await waitFor(() => {
//         setTimeout(() => {
//             expectElementWithTestIdToBeInDocument(rs);

//             expectElementWithTestIdToBeInDocument(ocs);

//             expectElementWithTestIdToBeInDocument(sfis);

//             expectElementWithTestIdToBeInDocument(cbs);
//         }, 3000);
//     });

//     setTimeout(() => {
//         clickElementWithTestId(mhbb);
//     }, 3000);

//     await waitFor(() => {
//         setTimeout(() => {
//             expectElementWithTestIdToBeInDocument(matt);

//             expectElementWithTestIdToBeInDocument(catt);
//         }, 3000);
//     });
// });

// test("TADashboard.test.tsx Test 8: Should render to the sections page when the refresh button is clicked, which ensures that everything you tried to select gets reverted back to its original state.", async () => {
//     render(<Login />);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(ct);
//     });

//     clickFirstElementWithTestId(vcib);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(matt);

//         expectElementWithTestIdToBeInDocument(catt);

//         clickFirstElementWithTestId(satb);
//     });
    
//     await waitFor(() => {
//         setTimeout(() => {
//             expectElementWithTestIdToBeInDocument(vatit);
//         }, 3000);
//     });

//     setTimeout(() => {
//         clickElementWithTestId(vaticb);
//     }, 3000);

//     await waitFor(() => {
//         setTimeout(() => {
//             expectElementWithTestIdToBeInDocument(rs);

//             expectElementWithTestIdToBeInDocument(ocs);

//             expectElementWithTestIdToBeInDocument(sfis);

//             expectElementWithTestIdToBeInDocument(cbs);
//         }, 3000);
//     });

//     setTimeout(() => {
//         clickElementWithTestId(rb);
//     }, 3000);
// });


// test("TADashboard.test.tsx Test 9: Should successfully save all the changes when the save button is clicked on the sections page.", async () => {
//     render(<Login />);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(ct);
//     });

//     clickFirstElementWithTestId(vcib);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(matt);

//         expectElementWithTestIdToBeInDocument(catt);

//         setTimeout(() => {
//             clickFirstElementWithTestId(satb);
//         }, 3000);
//     });
    
//     await waitFor(() => {
//         setTimeout(() => {
//             expectElementWithTestIdToBeInDocument(vatit);
//         }, 3000);
//     });

//     setTimeout(() => {
//         clickElementWithTestId(vaticb);
//     }, 3000);

//     await waitFor(() => {
//         setTimeout(() => {
//             expectElementWithTestIdToBeInDocument(rs);

//             expectElementWithTestIdToBeInDocument(ocs);

//             expectElementWithTestIdToBeInDocument(sfis);

//             expectElementWithTestIdToBeInDocument(cbs);
//         }, 3000);
//     });

//     setTimeout(() => {
//         clickElementWithTestId(sb);
//     }, 3000);
// });
