import { test, expect } from "@jest/globals";
import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "../../../../Login/Login";

import {
    clickElementWithTestId,
    expectElementWithTestIdToBeInDocument,
    changeElementWithTestIdWithInput,
    clickFirstElementWithTestId,
    clickFirstEnabledElementWithTestId
} from "../../../../../testUtilities";


var lf = "login-form";
var ei = "login-email-input";
var pi = "login-password-input";
var ct = "courses-title";
var vcib = "view-course-icon-button";
var rt = "roster-title";
var at = "assessment-tab";
var adt = "assessment-dashboard-title";
var vmcrb = "view-my-custom-rubrics-button";
var acrt = "add-custom-rubric-title";
var iab = "import-assessment-button";
var aiatt = "admin-import-assessment-tasks-title";
var atb = "add-task-button";
var aaatt = "admin-add-assessment-task-title";
var eaib = "edit-assessment-icon-button";
var aeatt = "admin-edit-assessment-task-title";
var vcaib = "view-completed-assessment-icon-button";
var vcirt = "view-completed-individual-rubrics-title";
var satb = "start-assessment-tasks-button";
var vatit = "view-assessment-task-instructions-title";
var lb = "login-submit-button";
test("NOTE: Tests 1-8 will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});
test("AdminViewAssessmentTask.test.tsx Test 1: Should render Login Form component.", () => {
    render(<Login />);

    expectElementWithTestIdToBeInDocument(lf);
});
test("AdminViewAssessmentTask.test.tsx Test 2: Should render the Assessment Task Dashboard in Admin View.", async () => {
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
});
test("AdminViewAssessmentTask.test.tsx Test 3: Should render the My Custom Rubrics page given the My Custom Rubrics Button is clicked on Admin View.", async () => {
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

    clickElementWithTestId(vmcrb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(acrt);
    });
});
test("AdminViewAssessmentTask.test.tsx Test 4: Should render the Import Assessment Tasks page given the Import Tasks Button is clicked on Admin View.", async () => {
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
});
test("AdminViewAssessmentTask.test.tsx Test 5: Should render the Add Assessment Task page given the Add Task Button is clicked on Admin View.", async () => {
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

    clickElementWithTestId(atb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(aaatt);
    });
});
test("AdminViewAssessmentTask.test.tsx Test 6: Should render the Edit Assessment Task page given the Edit Button is clicked on Admin View.", async () => {
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

    await waitFor(() => {
        clickFirstEnabledElementWithTestId(eaib);
    }, { timeout: 3000 });

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(aeatt);
    });
});
test("AdminViewAssessmentTask.test.tsx Test 7: Should render the Completed Assessment Tasks page given the View Icon Button is clicked on Admin View.", async () => {
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

    await waitFor(() => {
        clickFirstEnabledElementWithTestId(vcaib);
    }, { timeout: 3000 });

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(vcirt);
    });
});
test("AdminViewAssessmentTask.test.tsx Test 8: Should render the Instructions for Assessments page given the Start button is clicked on Admin View.", async () => {
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

    await waitFor(() => {
        clickFirstEnabledElementWithTestId(satb);
    }, { timeout: 3000 });

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(vatit);
    });
});