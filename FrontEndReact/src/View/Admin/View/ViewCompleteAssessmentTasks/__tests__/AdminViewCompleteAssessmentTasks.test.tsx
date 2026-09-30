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


var lb = "login-submit-button";
var ei = "login-email-input";
var pi = "login-password-input";
var ct = "courses-title";
var vcib = "view-course-icon-button";
var rt = "roster-title";
var at = "assessment-tab";
var adt = "assessment-dashboard-title";
var vcirt = "view-completed-individual-rubrics-title";
var aismdb = "assessment-individual-see-more-details-buttons";
var mhbb = "main-header-back-button";
var vcaisnb = "view-completed-assessment-individual-send-notification-button";
var vcaamt = "view-completed-assessment-add-message-title";
var ampcb = "add-message-prompt-cancel-button";
var ampsnb = "add-message-prompt-send-notification-button";
var vcaib = "view-completed-assessment-icon-button";
test("NOTE: Tests 1-7 will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});
test("AdminViewCompleteAssessmentTasks.test.tsx Test 1: Should render the AdminViewCompleteAssessmentTasks component given the View Icon Button on Individual AssessmentTasks is clicked.", async () => {
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

    await waitFor(() => {
        clickFirstEnabledElementWithTestId(vcaib);
    }, { timeout: 3000 });

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(vcirt);
    });
});
test("AdminViewCompleteAssessmentTasks.test.tsx Test 2: Should render the Assessment Dashboard if the back button on the View Individual Completed Assessment Tasks is clicked.", async () => {
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

    clickElementWithTestId(mhbb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(adt);
    });
});
test("AdminViewCompleteAssessmentTasks.test.tsx Test 3: Should render the Add Message prompt given that the Send Notification button is clicked on View Individual Completed Assessment Tasks page.", async () => {
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

    clickElementWithTestId(vcaisnb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(vcaamt);
    });
});
test("AdminViewCompleteAssessmentTasks.test.tsx Test 4: Should render the Individual Assessment Task name page given that the See More Details button is clicked", async () => {
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

    clickFirstElementWithTestId(aismdb);
});
test("AdminViewCompleteAssessmentTasks.test.tsx Test 5: Should render the Individual Completed Assessment Tasks page when the cancel button on the Add Message prompt is clicked", async () => {
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

    clickElementWithTestId(vcaisnb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(vcaamt);
    });

    clickElementWithTestId(ampcb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(vcirt);
    });
});
test("AdminViewCompleteAssessmentTasks.test.tsx Test 6: Should render the Individual Completed Assessment Tasks page when the send notification button on the Add Message prompt is clicked", async () => {
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

    clickElementWithTestId(vcaisnb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(vcaamt);
    });

    clickElementWithTestId(ampsnb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(vcirt);
    });
});
test("AdminViewCompleteAssessmentTasks.test.tsx Test 7: Should render the Individual Completed Assessment Tasks page if the back button on the Critical Thinking page is clicked", async () => {
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

    clickFirstElementWithTestId(aismdb);

    clickElementWithTestId(mhbb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(vcirt);
    });
});