// @ts-expect-error TS(2307): Cannot find module '@testing-library/react' or its... Remove this comment to see the full error message
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
var vcirt = "viewCompletedIndividualRubricsTitle";
var aismdb = "assessmentIndividualSeeMoreDetailsButtons";
var mhbb = "mainHeaderBackButton";
var vcaisnb = "viewCompletedAssessmentIndividualSendNotificationButton";
var vcaamt = "viewCompletedAssessmentAddMessageTitle";
var ampcb = "addMessagePromptCancelButton";
var ampsnb = "addMessagePromptSendNotificationButton";
var vcaib = "viewCompletedAssessmentIconButton";



// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("NOTE: Tests 1-7 will not pass if Demo Data is not loaded!", () => {
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(true).toBe(true);
});


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("AdminViewCompleteAssessmentTasks.test.js Test 1: Should render the AdminViewCompleteAssessmentTasks component given the View Icon Button on Individual AssessmentTasks is clicked.", async () => {
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
    
    await waitFor(() => {
        clickFirstElementWithAriaLabel(vcaib);
    },{ timeout: 3000 });

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(vcirt);
    });
});


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("AdminViewCompleteAssessmentTasks.test.js Test 2: Should render the Assessment Dashboard if the back button on the View Individual Completed Assessment Tasks is clicked.", async () => {
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

    await waitFor(() => {
        clickFirstElementWithAriaLabel(vcaib);
    },{ timeout: 3000 });

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(vcirt);
    });

    clickElementWithAriaLabel(mhbb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(adt);
    });
});


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("AdminViewCompleteAssessmentTasks.test.js Test 3: Should render the Add Message prompt given that the Send Notification button is clicked on View Individual Completed Assessment Tasks page.", async () => {
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

    await waitFor(() => {
        clickFirstElementWithAriaLabel(vcaib);
    },{ timeout: 3000 });

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(vcirt);
    });

    clickElementWithAriaLabel(vcaisnb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(vcaamt);
    });
});


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("AdminViewCompleteAssessmentTasks.test.js Test 4: Should render the Individual Assessment Task name page given that the See More Details button is clicked", async () => {
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

    await waitFor(() => {
        clickFirstElementWithAriaLabel(vcaib);
    },{ timeout: 3000 });
    
    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(vcirt);
    });

    clickFirstElementWithAriaLabel(aismdb);
});


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("AdminViewCompleteAssessmentTasks.test.js Test 5: Should render the Individual Completed Assessment Tasks page when the cancel button on the Add Message prompt is clicked", async () => {
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

    await waitFor(() => {
        clickFirstElementWithAriaLabel(vcaib);
    },{ timeout: 3000 });

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(vcirt);
    });
    
    clickElementWithAriaLabel(vcaisnb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(vcaamt);
    });

    clickElementWithAriaLabel(ampcb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(vcirt);
    });
});


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("AdminViewCompleteAssessmentTasks.test.js Test 6: Should render the Individual Completed Assessment Tasks page when the send notification button on the Add Message prompt is clicked", async () => {
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

    await waitFor(() => {
        clickFirstElementWithAriaLabel(vcaib);
    },{ timeout: 3000 });

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(vcirt);
    });
    
    clickElementWithAriaLabel(vcaisnb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(vcaamt);
    });

    clickElementWithAriaLabel(ampsnb);
    
    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(vcirt);
    });
});


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("AdminViewCompleteAssessmentTasks.test.js Test 7: Should render the Individual Completed Assessment Tasks page if the back button on the Critical Thinking page is clicked", async () => {
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

    await waitFor(() => {
        clickFirstElementWithAriaLabel(vcaib);
    },{ timeout: 3000 });

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(vcirt);
    });

    clickFirstElementWithAriaLabel(aismdb);

    clickElementWithAriaLabel(mhbb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(vcirt);
    });
});