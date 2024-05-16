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
} from "../../../../../App.js";



var lf = "loginForm";
var lb = "loginButton";
var ei = "emailInput";
var pi = "passwordInput";
var ct = "coursesTitle";
var vcib = "viewCourseIconButton";
var rt = "rosterTitle";
var at = "assessmentTab";
var adt = "assessmentDashboardTitle";
var mhbb = "mainHeaderBackButton";
var acrt = "addCustomRubricTitle";
var iab = "importAssessmentButton";
var aiatt = "adminImportAssessmentTasksTitle";
var atb = "addTaskButton";
var aaatt = "adminAddAssessmentTaskTitle";
var eaib = "editAssessmentIconButton";
var vcaib = "viewCompletedAssessmentIconButton";
var vcatt = "viewCompletedAssessmentsTitle";
var catb = "completeAssessmentTaskButton";
var vatit = "viewAssessmentTaskInstructionsTitle";
var vmcrb = "viewMyCustomRubricsButton";
var eatb = "exportAssessmentTaskButton";


test("NOTE: Tests 1-11 will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});


test("AssessmentDashboard.test.js Test 1: Should render Login Form component", () => {
    render(<Login />);

    expectElementWithAriaLabelToBeInDocument(lf);
});


test("AssessmentDashboard.test.js Test 2: Should show Admin View Courses when logging with Admin credentials", async () => {
    render(<Login />);

    changeElementWithAriaLabelWithInput(ei, "demoadmin02@skillbuilder.edu");

    changeElementWithAriaLabelWithInput(pi, demoAdminPassword);

    clickElementWithAriaLabel(lb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });
});


test("AssessmentDashboard.test.js Test 3: Should show Roster Dashboard when clicking the view course button icon", async () => {
    render(<Login/>);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(rt);
    });
});


test("AssessmentDashboard.test.js Test 4: Should show Assessment Dashboard when clicking the Assessment tab", async () => {
    render(<Login/>);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
       expectElementWithAriaLabelToBeInDocument(rt);
    });

    clickElementWithAriaLabel(at);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(adt);
    });
});


test("AssessmentDashboard.test.js Test 5: Should show View Courses page when clicking the back button", async () => {
    render(<Login/>);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
       expectElementWithAriaLabelToBeInDocument(rt);
    });

    clickElementWithAriaLabel(at);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(adt);
    });

    clickElementWithAriaLabel(mhbb);

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(ct);
        }, 3000);
    });
});


test("AssessmentDashboard.test.js Test 6: Should show My Custom Rubrics page when clicking the My Custom Rubrics button", async () => {
    render(<Login/>);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
       expectElementWithAriaLabelToBeInDocument(rt);
    });

    clickElementWithAriaLabel(at);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(adt);
    });

    clickElementWithAriaLabel(vmcrb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(acrt);
    });
});


test("AssessmentDashboard.test.js Test 7: Should show Import Assessment page when clicking the import assessment button", async () => {
    render(<Login/>);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
       expectElementWithAriaLabelToBeInDocument(rt);
    });

    clickElementWithAriaLabel(at);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(adt);
    });

    clickElementWithAriaLabel(iab);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(aiatt);
    });
});


test("AssessmentDashboard.test.js Test 8: Should show Add Assessment page when clicking the add assessment button", async () => {
    render(<Login/>);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
       expectElementWithAriaLabelToBeInDocument(rt);
    });

    clickElementWithAriaLabel(at);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(adt);
    });

    clickElementWithAriaLabel(atb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(aaatt);
    });
});


test("AssessmentDashboard.test.js Test 9: Should show Edit Assessment page when clicking the edit assessment button", async () => {
    render(<Login/>);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
       expectElementWithAriaLabelToBeInDocument(rt);
    });

    clickElementWithAriaLabel(at);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(adt);

        clickFirstElementWithAriaLabel(eaib);
    });

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(aaatt);
    });
});


test("AssessmentDashboard.test.js Test 10: Should show View Completed Assessments page when clicking the view completed assessment button", async () => {
    render(<Login/>);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
       expectElementWithAriaLabelToBeInDocument(rt);
    });

    clickElementWithAriaLabel(at);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(adt);

        clickFirstElementWithAriaLabel(vcaib);
    });

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(vcatt);
    });
});


test("AssessmentDashboard.test.js Test 11: Should show Instructions for Assessment page when clicking the complete assessment button", async () => {
    render(<Login/>);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
       expectElementWithAriaLabelToBeInDocument(rt);
    });

    clickElementWithAriaLabel(at);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(adt);

        clickFirstElementWithAriaLabel(catb);
    });

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(vatit);
    });
});


// test("AssessmentDashboard.test.js Test 12: Should download a csv file when the export button is clicked.", async () => {
//     render(<Login/>);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(ct);
//     });

//     clickFirstElementWithAriaLabel(vcib);

//     await waitFor(() => {
//        expectElementWithAriaLabelToBeInDocument(rt);
//     });

//     clickElementWithAriaLabel(at);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(adt);

//         // clickFirstElementWithAriaLabel(eatb);
//     });

//     // await waitFor(() => {
//     //     // expectElementWithAriaLabelToBeInDocument(eatb);
//     // });
// });