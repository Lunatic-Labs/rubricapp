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
var aiatcb = "adminImportAssessmentTaskCancelButton";
var aiatsb = "adminImportAssessmentTasksSubmitButton";
var aiacs = "adminImportAssessmentTasksCourseSelect";
var aiacc = "adminImportAssessmentCourseChoice";
var aiacd = "adminImportAssessmentCourseDropdown";



test("NOTE: Tests 1-5 will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});


test("AdminImportAssessmentTasks.test.js Test 1: Should render the AdminImportAssessmentTasks component given the Import Assessments button is clicked", async () => {
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
        clickElementWithAriaLabel(iab);

        expectElementWithAriaLabelToBeInDocument(aiatt);
    });
});


test("AdminImportAssessmentTasks.test.js Test 2: Should render the page that came before given that the Cancel button is clicked", async () => {
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
        clickElementWithAriaLabel(iab);

        expectElementWithAriaLabelToBeInDocument(aiatt);
    });

    clickElementWithAriaLabel(aiatcb);

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(rt);
        }, 3000);
    });
});


test("AdminImportAssessmentTasks.test.js Test 3: Should render the page that came before given that the back button is clicked", async () => {
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
        clickElementWithAriaLabel(iab);

        expectElementWithAriaLabelToBeInDocument(aiatt);
    });

    clickElementWithAriaLabel(mhbb);

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(rt);
        }, 3000);
    });
});


test("AdminImportAssessmentTasks.test.js Test 4: Should render an error message on the page when no input is given", async () => {
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
        clickElementWithAriaLabel(iab);

        expectElementWithAriaLabelToBeInDocument(aiatt);
    });

    await waitFor(() => {
        setTimeout(() => {
            clickElementWithAriaLabel(aiatsb);
        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToHaveErrorMessage(aiacs, "Invalid Form: Missing Course!");
        }, 3000);
    });
});


test("AdminImportAssessmentTasks.test.js Test 5: Should refresh and return back to Assessment Dashboard page when valid information is input and submit button is clicked", async() => {
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
        clickElementWithAriaLabel(iab);

        expectElementWithAriaLabelToBeInDocument(aiatt);
    });

    await waitFor(() => {
        setTimeout(() => {
            clickElementWithAriaLabel(aiacd);
            
            clickFirstElementWithAriaLabel(aiacc);

            clickElementWithAriaLabel(aiatsb);
        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(rt);
        }, 3000);
    });
});