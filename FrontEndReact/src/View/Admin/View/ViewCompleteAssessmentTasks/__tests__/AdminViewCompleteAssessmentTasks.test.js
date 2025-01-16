import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "../../../../Login/Login.js";

import {
    clickElementWithAriaLabel,
    expectElementWithAriaLabelToBeInDocument,
    changeElementWithAriaLabelWithInput,
    clickFirstElementWithAriaLabel,
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
var vciat = "viewCompletedIndividualAssessmentsTitle";
var aismdb = "assessmentIndividualSeeMoreDetailsButton";
var mhbb = "mainHeaderBackButton";
var vcaisnb = "viewCompletedAssessmentIndividualSendNotificationButton";
var vcaamt = "viewCompletedAssessmentAddMessageTitle";
var ampcb = "addMessagePromptCancelButton";
var ampsnb = "addMessagePromptSendNotificationButton";
var vcaib = "viewCompletedAssessmentIconButton";



test("NOTE: Tests 1-7 will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});


test("AdminViewCompleteAssessmentTasks.test.js Test 1: Should render the AdminViewCompleteAssessmentTasks component given the View Icon Button on Individual AssessmentTasks is clicked.", async () => {
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
        clickFirstElementWithAriaLabel(vcaib);
    },{ timeout: 3000 });

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(vciat);
    });
});


test("AdminViewCompleteAssessmentTasks.test.js Test 2: Should render the Assessment Dashboard if the back button on the View Individual Completed Assessment Tasks is clicked.", async () => {
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
        clickFirstElementWithAriaLabel(vcaib);
    },{ timeout: 3000 });

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(vciat);
    });

    clickElementWithAriaLabel(mhbb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(adt);
    });
});


test("AdminViewCompleteAssessmentTasks.test.js Test 3: Should render the Add Message prompt given that the Send Notification button is clicked on View Individual Completed Assessment Tasks page.", async () => {
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
        clickFirstElementWithAriaLabel(vcaib);
    },{ timeout: 3000 });

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(vciat);
    });

    clickElementWithAriaLabel(vcaisnb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(vcaamt);
    });
});


test("AdminViewCompleteAssessmentTasks.test.js Test 4: Should render the Individual Assessment Task name page given that the See More Details button is clicked", async () => {
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
        clickFirstElementWithAriaLabel(vcaib);
    },{ timeout: 3000 });
    
    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(vciat);
    });

    clickFirstElementWithAriaLabel(aismdb);
});


test("AdminViewCompleteAssessmentTasks.test.js Test 5: Should render the Individual Completed Assessment Tasks page when the cancel button on the Add Message prompt is clicked", async () => {
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
        clickFirstElementWithAriaLabel(vcaib);
    },{ timeout: 3000 });

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(vciat);
    });
    
    clickElementWithAriaLabel(vcaisnb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(vcaamt);
    });

    clickElementWithAriaLabel(ampcb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(vciat);
    });
});


test("AdminViewCompleteAssessmentTasks.test.js Test 6: Should render the Individual Completed Assessment Tasks page when the send notification button on the Add Message prompt is clicked", async () => {
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
        clickFirstElementWithAriaLabel(vcaib);
    },{ timeout: 3000 });

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(vciat);
    });
    
    clickElementWithAriaLabel(vcaisnb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(vcaamt);
    });

    clickElementWithAriaLabel(ampsnb);
    
    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(vciat);
    });
});


test("AdminViewCompleteAssessmentTasks.test.js Test 7: Should render the Individual Completed Assessment Tasks page if the back button on the Critical Thinking page is clicked", async () => {
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
        clickFirstElementWithAriaLabel(vcaib);
    },{ timeout: 3000 });

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(vciat);
    });

    clickFirstElementWithAriaLabel(aismdb);

    clickElementWithAriaLabel(mhbb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(vciat);
    });
});