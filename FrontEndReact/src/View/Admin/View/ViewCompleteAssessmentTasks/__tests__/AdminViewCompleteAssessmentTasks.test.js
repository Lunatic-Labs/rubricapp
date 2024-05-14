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
var vcib = "viewCourseIconButton";
var rt = "rosterTitle";
var at = "assessmentTab";
var adt = "assessmentDashboardTitle";
var vcatt = "viewCompletedAssessmentTasksTitle";
var avb = "assessmentViewButton";
var mhbb = "mainHeaderBackButton";
var vcasnb = "viewCompletedAssessmentSendNotificationButton";
var vcaamt = "viewCompletedAssessmentAddMessageTitle";



test("NOTE: Tests 1-?? will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});


test("AdminViewCompleteAssessmentTasks.test.js Test 1: Should render the AdminViewCompleteAssessmentTasks component given the View Icon Button on AssessmentTasks is clicked", async () => {
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

    await waitFor(() => {
        setTimeout(() => {
            clickFirstElementWithAriaLabel(vcib);
        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(vcatt);
        }, 3000);
    });
});


test("AdminViewCompleteAssessmentTasks.test.js Test 2: Should render the Assessment Dashboard if the back button on the View Completed Assessment Tasks is clicked", async () => {
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

    await waitFor(() => {
        setTimeout(() => {
            clickFirstElementWithAriaLabel(vcib);
        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(vcatt);
        }, 3000);
    });

    clickElementWithAriaLabel(mhbb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(adt);
    });
});


test("AdminViewCompleteAssessmentTasks.test.js Test 3: Should render the Add Message prompt given that the Send Notification button is clicked", async () => {
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

    await waitFor(() => {
        setTimeout(() => {
            clickFirstElementWithAriaLabel(vcib);
        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(vcatt);

            clickElementWithAriaLabel(vcasnb);
        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(vcaamt);
        }, 3000);
    });
});


test("AdminViewCompleteAssessmentTasks.test.js Test 4: Should render the Critical Thinking page given that the View button is clicked", async () => {
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

    await waitFor(() => {
        setTimeout(() => {
            clickFirstElementWithAriaLabel(vcib);
        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(vcatt);

            clickElementWithAriaLabel(avb);
        }, 3000);
    });
});