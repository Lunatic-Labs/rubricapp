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
    demoAdminPassword
} from "../../../../../App.js";



var lf = "loginForm";
var ei = "emailInput";
var pi = "passwordInput";
var ct = "coursesTitle";
var vcib = "viewCourseIconButton";
var rt = "rosterTitle";
var at = "assessmentTab";
var adt = "assessmentDashboardTitle";
var vmcrb = "viewMyCustomRubricsButton";
var acrt = "addCustomRubricTitle";
var iab = "importAssessmentButton";
var aiatt = "adminImportAssessmentTasksTitle";
var atb = "addTaskButton";
var aaatt = "adminAddAssessmentTaskTitle";
var eaib = "editAssessmentIconButton";
var aeatt = "adminEditAssessmentTaskTitle";
var vcaib = "viewCompletedAssessmentIconButton";
var vcat = "viewCompletedAssessmentsTitle";



test("NOTE: Tests 1-??? will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});


test("AdminViewAssessmentTask.test.js Test 1: Should render Login Form component.", () => {
    render(<Login />);

    expectElementWithAriaLabelToBeInDocument(lf);
});


test("AdminViewAssessmentTask.test.js Test 2: Should render the Assessment Task Dashboard in Admin View.",  async () => {
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
});


test("AdminViewAssessmentTask.test.js Test 3: Should render the My Custom Rubrics page given the My Custom Rubrics Button is clicked on Admin View.",  async () => {
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

    clickElementWithAriaLabel(vmcrb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(acrt);
    });
});


test("AdminViewAssessmentTask.test.js Test 4: Should render the Import Assessment Tasks page given the Import Tasks Button is clicked on Admin View.",  async () => {
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


test("AdminViewAssessmentTask.test.js Test 5: Should render the Add Assessment Task page given the Add Task Button is clicked on Admin View.",  async () => {
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

    clickElementWithAriaLabel(atb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(aaatt);
    });
});


test("AdminViewAssessmentTask.test.js Test 6: Should render the Edit Assessment Task page given the Edit Button is clicked on Admin View.",  async () => {
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

    clickFirstElementWithAriaLabel(eaib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(aeatt);
    });
});


test("AdminViewAssessmentTask.test.js Test 7: Should render the Completed Assessment Tasks page given the View Icon Button is clicked on Admin View.",  async () => {
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

    clickFirstElementWithAriaLabel(vcaib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(vcat);
    });
});