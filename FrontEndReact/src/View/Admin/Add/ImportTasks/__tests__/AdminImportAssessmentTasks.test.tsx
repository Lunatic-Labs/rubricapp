import { test, expect } from "@jest/globals";
import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "../../../../Login/Login";

import {
    clickElementWithTestId,
    expectElementWithTestIdToBeInDocument,
    changeElementWithTestIdWithInput,
    expectElementWithTestIdToHaveErrorMessage,
    clickFirstElementWithTestId
} from "../../../../../testUtilities";


var lb = "login-submit-button";
var ei = "login-email-input";
var pi = "login-password-input";
var ct = "courses-title";
var iab = "import-assessment-button";
var aiatt = "admin-import-assessment-tasks-title";
var vcib = "view-course-icon-button";
var rt = "roster-title";
var at = "assessment-tab";
var mhbb = "main-header-back-button";
var aiatcb = "admin-import-assessment-task-cancel-button";
var aiatsb = "admin-import-assessment-tasks-submit-button";
var aiacs = "admin-import-assessment-course-select";
var aiacd = "admin-import-assessment-course-dropdown";
var adt = "assessment-dashboard-title";
test("NOTE: Tests 1-5 will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});
test("AdminImportAssessmentTasks.test.tsx Test 1: Should render the AdminImportAssessmentTasks component given the Import Assessments button is clicked", async () => {
    render(<Login />);

    changeElementWithTestIdWithInput(ei, "demoadmin02@skillbuilder.edu");

    changeElementWithTestIdWithInput(pi, globalThis.DEMO_ADMIN_PASSWORD);

    clickElementWithTestId(lb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    });

    clickElementWithTestId(at);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(adt);
    });

    clickElementWithTestId(iab);
    
    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(aiatt);
    });
});
test("AdminImportAssessmentTasks.test.tsx Test 2: Should render the page that came before given that the Cancel button is clicked", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    });

    clickElementWithTestId(at);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(adt);
    });

    clickElementWithTestId(iab);
    
    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(aiatt);
    });

    clickElementWithTestId(aiatcb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(adt);
    },{ timeout: 3000 });
});
test("AdminImportAssessmentTasks.test.tsx Test 3: Should render the assessment dashboard title page given that the back button is clicked on the ImportAssessmentTasks page", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    });

    clickElementWithTestId(at);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(adt);
    });
    
    clickElementWithTestId(iab);
    
    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(aiatt);
    });

    clickElementWithTestId(mhbb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(adt);
    });
});
test("AdminImportAssessmentTasks.test.tsx Test 4: Should render an error message on the page when no input is given", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    });

    clickElementWithTestId(at);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(adt);
    });

    clickElementWithTestId(iab);
    
    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(aiatt);
    });

    clickElementWithTestId(aiatsb);

    await waitFor(() => {
        expectElementWithTestIdToHaveErrorMessage(aiacs, "Missing Course to Import Tasks From");
    });
});
test("AdminImportAssessmentTasks.test.tsx Test 5: Should refresh and return back to Assessment Dashboard page when valid information is input and submit button is clicked", async() => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    });

    clickElementWithTestId(at);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(adt);
    });

    clickElementWithTestId(iab);
    
    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(aiatt);
    });

    clickElementWithTestId(aiacd);

    clickElementWithTestId(aiatsb);
});