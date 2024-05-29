import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "../../../../Login/Login.js";

import {
    clickElementWithAriaLabel,
    expectElementWithAriaLabelToBeInDocument,
    changeElementWithAriaLabelWithInput,
    clickFirstElementWithAriaLabel,
    expectElementWithAriaLabelToHaveErrorMessage
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
var ampcb = "addMessagePromptCancelButton";
var ampsnb = "addMessagePromptSendNotificationButton";
var rs = "ratingsSection";
var ocs = "observableCharacteristicsSection";
var sfis = "suggestionsForImprovementSection";
var cbs = "commentBoxSection";
var rb = "refreshButton";
var sb = "saveButton";



test("NOTE: Tests 1-10 will not pass if Demo Data is not loaded!", () => {
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

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(rs);

            expectElementWithAriaLabelToBeInDocument(ocs);

            expectElementWithAriaLabelToBeInDocument(sfis);

            expectElementWithAriaLabelToBeInDocument(cbs);
        }, 3000);
    });
});


test("AdminViewCompleteAssessmentTasks.test.js Test 5: Should render the Completed Assessment Tasks page when the cancel button on the Add Message prompt is clicked", async () => {
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

            clickElementWithAriaLabel(ampcb);
        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(vcaamt);
        }, 3000);
    });
});


test("AdminViewCompleteAssessmentTasks.test.js Test 6: Should render the Completed Assessment Tasks page when the send notification button on the Add Message prompt is clicked", async () => {
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

            clickElementWithAriaLabel(ampsnb);
        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(vcaamt);
        }, 3000);
    });
});


test("AdminViewCompleteAssessmentTasks.test.js Test 7: Should render the Completed Assessment Tasks page if the back button on the Critical Thinking page is clicked", async () => {
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

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(rs);

            expectElementWithAriaLabelToBeInDocument(ocs);

            expectElementWithAriaLabelToBeInDocument(sfis);

            expectElementWithAriaLabelToBeInDocument(cbs);
        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            clickElementWithAriaLabel(mhbb);

            expectElementWithAriaLabelToBeInDocument(vcatt);
        }, 3000);
    });
});


test("AdminViewCompleteAssessmentTasks.test.js Test 8: Should undo the selections made in the sections boxes in the Critical Thinking page when the Refresh Button is clicked", async () => {
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

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(rs);

            expectElementWithAriaLabelToBeInDocument(ocs);

            expectElementWithAriaLabelToBeInDocument(sfis);

            expectElementWithAriaLabelToBeInDocument(cbs);
        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            clickElementWithAriaLabel(rb);
        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(rs);

            expectElementWithAriaLabelToBeInDocument(ocs);

            expectElementWithAriaLabelToBeInDocument(sfis);

            expectElementWithAriaLabelToBeInDocument(cbs);
        }, 3000);
    });
});


test("AdminViewCompleteAssessmentTasks.test.js Test 9: Should save the selections made in the sections boxes in the Critical Thinking page when the Save Button is clicked", async () => {
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

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(rs);

            expectElementWithAriaLabelToBeInDocument(ocs);

            expectElementWithAriaLabelToBeInDocument(sfis);

            expectElementWithAriaLabelToBeInDocument(cbs);
        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            clickElementWithAriaLabel(sb);
        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(rs);

            expectElementWithAriaLabelToBeInDocument(ocs);

            expectElementWithAriaLabelToBeInDocument(sfis);

            expectElementWithAriaLabelToBeInDocument(cbs);
        }, 3000);
    });
});


test("AdminViewCompleteAssessmentTasks.test.js Test 10: Should provide a HelperText error when the Add Message box is left empty", async () => {
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

            clickElementWithAriaLabel(ampsnb);
        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToHaveErrorMessage(vcaamt,"Notification Message cannot be empty");
        }, 3000);
    })
});