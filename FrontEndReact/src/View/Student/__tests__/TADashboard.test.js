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
var satb = "startAssessmentTasksButton";
var catvib = "completedAssessmentTasksViewIconButton";
var vatit = "viewAssessmentTaskInstructionsTitle";
var mhbb = "mainHeaderBackButton";
var vaticb = "viewAssessmentTaskInstructionsContinueButton";
var catnt = "completeAssessmentTaskNameTitle"



test("NOTE: Tests 1-9 will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});


// test("TADashboard.test.js Test 1: Should render both assessment tables if valid TA information is input to login.", async () => {
//     render(<Login />);

//     changeElementWithAriaLabelWithInput(ei, "demotainstructor03@skillbuilder.edu");

//     changeElementWithAriaLabelWithInput(pi, demoTaInstructorPassword);

//     clickElementWithAriaLabel(lb);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(ct);
//     });

//     clickFirstElementWithAriaLabel(vcib);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(matt);

//         expectElementWithAriaLabelToBeInDocument(catt);
//     });
// });


// test("TADashboard.test.js Test 2: Should render the completed assessment task page if the complete assessment task button is clicked.", async () => {
//     render(<Login />);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(ct);
//     });

//     clickFirstElementWithAriaLabel(vcib);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(matt);

//         expectElementWithAriaLabelToBeInDocument(catt);

//         clickFirstElementWithAriaLabel(satb);
//     });

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(vatit);
//     });
// });


// test("TADashboard.test.js Test 3: Should render the view completed assessment task page if the view button is clicked.", async () => {
//     render(<Login />);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(ct);
//     });

//     clickFirstElementWithAriaLabel(vcib);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(matt);

//         expectElementWithAriaLabelToBeInDocument(catt);
//     });
        
//     await waitFor(() => {
//         setTimeout(() => {
//             clickFirstElementWithAriaLabel(catvib);

//             expectElementWithAriaLabelToBeInDocument(vatit);
//         }, 3000);
//     });
// });


// test("TADashboard.test.js Test 4: Should render to the course dashboard when the back button is clicked on my Assessment Tasks and Completed Assessments page.", async () => {
//     render(<Login />);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(ct);
//     });

//     clickFirstElementWithAriaLabel(vcib);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(matt);

//         expectElementWithAriaLabelToBeInDocument(catt);
//     });

//     clickElementWithAriaLabel(mhbb);
    
//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(ct);
//     });
// });


// test("TADashboard.test.js Test 5: Should render to the my Assessment Tasks and Completed Assessments page when the back button is clicked on the viewAssessmentTaskInstructions page.", async () => {
//     render(<Login />);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(ct);
//     });

//     clickFirstElementWithAriaLabel(vcib);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(matt);

//         expectElementWithAriaLabelToBeInDocument(catt);

//         clickFirstElementWithAriaLabel(satb);
//     });
    
//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(vatit);
//     });
    
//     clickElementWithAriaLabel(mhbb);
    
//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(matt);

//         expectElementWithAriaLabelToBeInDocument(catt);
//     });
// });


// test("TADashboard.test.js Test 6: Should render to the Feedback page of the Assessment Task when the continue button is selected.", async () => {
//     render(<Login />);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(ct);
//     });

//     clickFirstElementWithAriaLabel(vcib);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(matt);

//         expectElementWithAriaLabelToBeInDocument(catt);

//         clickFirstElementWithAriaLabel(satb);
//     });
    
//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(vatit);
//     });

//     clickElementWithAriaLabel(vaticb);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(catnt);
//     });
// });


// test("TADashboard.test.js Test 7: Should render to the my Assessment Tasks and Completed Assessments page when the back button is clicked on the sections page.", async () => {
//     render(<Login />);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(ct);
//     });

//     clickFirstElementWithAriaLabel(vcib);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(matt);

//         expectElementWithAriaLabelToBeInDocument(catt);

//         clickFirstElementWithAriaLabel(satb);
//     });
    
//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(vatit);
//     });

//     clickElementWithAriaLabel(vaticb);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(catnt);
//     });

//     clickElementWithAriaLabel(mhbb);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(matt);

//         expectElementWithAriaLabelToBeInDocument(catt);
//     });
// });

// test("TADashboard.test.js Test 8: Should render to the sections page when the refresh button is clicked, which ensures that everything you tried to select gets reverted back to its original state.", async () => {
//     render(<Login />);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(ct);
//     });

//     clickFirstElementWithAriaLabel(vcib);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(matt);

//         expectElementWithAriaLabelToBeInDocument(catt);

//         clickFirstElementWithAriaLabel(satb);
//     });
    
//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(vatit);

//         clickElementWithAriaLabel(vaticb);
//     });

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(catnt);
//     });

//     // clickElementWithAriaLabel(rb);

//     // await waitFor(() => {
//     //     expectElementWithAriaLabelToBeInDocument(catnt);
//     // });
// });


// test("TADashboard.test.js Test 9: Should successfully save all the changes when the save button is clicked on the sections page.", async () => {
//     render(<Login />);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(ct);
//     });

//     clickFirstElementWithAriaLabel(vcib);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(matt);

//         expectElementWithAriaLabelToBeInDocument(catt);

//         clickFirstElementWithAriaLabel(satb);
//     });
    
//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(vatit);

//         clickElementWithAriaLabel(vaticb);
//     });

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(catnt);
//     });

//     // Needs to be redone due to change from Save button to Done.
//     // setTimeout(() => {
//     //     clickElementWithAriaLabel(sb);
//     // }, 3000);
// });
