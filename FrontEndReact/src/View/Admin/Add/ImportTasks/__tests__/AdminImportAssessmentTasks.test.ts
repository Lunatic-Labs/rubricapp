// @ts-expect-error TS(2307): Cannot find module '@testing-library/react' or its... Remove this comment to see the full error message
import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "../../../../Login/Login.js";

import {
    clickElementWithAriaLabel,
    expectElementWithAriaLabelToBeInDocument,
    changeElementWithAriaLabelWithInput,
    expectElementWithAriaLabelToHaveErrorMessage,
    clickFirstElementWithAriaLabel
} from "../../../../../testUtilities.js";

import {
    demoAdminPassword
} from "../../../../../App.js";



var lb = "loginButton";
var ei = "emailInput";
var pi = "passwordInput";
var ct = "coursesTitle";
var iab = "importAssessmentButton";
var aiatt = "adminImportAssessmentTasksTitle";
var vcib = "viewCourseIconButton";
var rt = "rosterTitle";
var at = "assessmentTab";
var mhbb = "mainHeaderBackButton";
var aiatcb = "adminImportAssessmentTaskCancelButton";
var aiatsb = "adminImportAssessmentTasksSubmitButton";
var aiacs = "adminImportAssessmentCourseSelect";
var aiacd = "adminImportAssessmentCourseDropdown";
var adt = "assessmentDashboardTitle";



// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("NOTE: Tests 1-5 will not pass if Demo Data is not loaded!", () => {
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(true).toBe(true);
});


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("AdminImportAssessmentTasks.test.js Test 1: Should render the AdminImportAssessmentTasks component given the Import Assessments button is clicked", async () => {
    // @ts-expect-error TS(2352): Conversion of type 'RegExp' to type 'Login' may be... Remove this comment to see the full error message
    render(<Login />);

    changeElementWithAriaLabelWithInput(ei, "demoadmin02@skillbuilder.edu");

    changeElementWithAriaLabelWithInput(pi, demoAdminPassword);

    clickElementWithAriaLabel(lb);

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


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("AdminImportAssessmentTasks.test.js Test 2: Should render the page that came before given that the Cancel button is clicked", async () => {
    // @ts-expect-error TS(2352): Conversion of type 'RegExp' to type 'Login' may be... Remove this comment to see the full error message
    render(<Login />);

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

    clickElementWithAriaLabel(aiatcb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(adt);
    },{ timeout: 3000 });
});


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("AdminImportAssessmentTasks.test.js Test 3: Should render the assessment dashboard title page given that the back button is clicked on the ImportAssessmentTasks page", async () => {
    // @ts-expect-error TS(2352): Conversion of type 'RegExp' to type 'Login' may be... Remove this comment to see the full error message
    render(<Login />);

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

    clickElementWithAriaLabel(mhbb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(adt);
    });
});


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("AdminImportAssessmentTasks.test.js Test 4: Should render an error message on the page when no input is given", async () => {
    // @ts-expect-error TS(2352): Conversion of type 'RegExp' to type 'Login' may be... Remove this comment to see the full error message
    render(<Login />);

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

    clickElementWithAriaLabel(aiatsb);

    await waitFor(() => {
        expectElementWithAriaLabelToHaveErrorMessage(aiacs, "Missing Course to Import Tasks From");
    });
});


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("AdminImportAssessmentTasks.test.js Test 5: Should refresh and return back to Assessment Dashboard page when valid information is input and submit button is clicked", async() => {
    // @ts-expect-error TS(2352): Conversion of type 'RegExp' to type 'Login' may be... Remove this comment to see the full error message
    render(<Login />);

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

    clickElementWithAriaLabel(aiacd);

    clickElementWithAriaLabel(aiatsb);
});