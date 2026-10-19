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
var lb = "login-submit-button";
var ei = "login-email-input";
var pi = "login-password-input";
var ct = "courses-title";
var vcib = "view-course-icon-button";
var rt = "roster-title";
var at = "assessment-tab";
var adt = "assessment-dashboard-title";
var mhbb = "main-header-back-button";
var acrt = "add-custom-rubric-title";
var iab = "import-assessment-button";
var aiatt = "admin-import-assessment-tasks-title";
var atb = "add-task-button";
var aaatt = "admin-add-assessment-task-title";
var eaib = "edit-assessment-icon-button";
var vcaib = "view-completed-assessment-icon-button";
var vcirt = "view-completed-individual-rubrics-title";
var satb = "start-assessment-tasks-button";
var vatit = "view-assessment-task-instructions-title";
var vmcrb = "view-my-custom-rubrics-button";
var aeatt = "admin-edit-assessment-task-title";
test("NOTE: Tests 1-11 will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});
test("AssessmentDashboard.test.tsx Test 1: Should render Login Form component", () => {
    render(<Login />);

    expectElementWithTestIdToBeInDocument(lf);
});
test("AssessmentDashboard.test.tsx Test 2: Should show Admin View Courses when logging with Admin credentials", async () => {
    render(<Login />);

    changeElementWithTestIdWithInput(ei, "demoadmin02@skillbuilder.edu");

    changeElementWithTestIdWithInput(pi, globalThis.DEMO_ADMIN_PASSWORD);

    clickElementWithTestId(lb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });
});
test("AssessmentDashboard.test.tsx Test 3: Should show Roster Dashboard when clicking the view course button icon", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    });
});
test("AssessmentDashboard.test.tsx Test 4: Should show Assessment Dashboard when clicking the Assessment tab", async () => {
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
});
test("AssessmentDashboard.test.tsx Test 5: Should show View Courses page when clicking the back button", async () => {
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

    clickElementWithTestId(mhbb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });
});
test("AssessmentDashboard.test.tsx Test 6: Should show My Custom Rubrics page when clicking the My Custom Rubrics button", async () => {
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
test("AssessmentDashboard.test.tsx Test 7: Should show Import Assessment page when clicking the import assessment button", async () => {
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
test("AssessmentDashboard.test.tsx Test 8: Should show Add Assessment page when clicking the add assessment button", async () => {
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
test("AssessmentDashboard.test.tsx Test 9: Should show Edit Assessment page when clicking the edit assessment button", async () => {
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
        clickFirstElementWithTestId(eaib);
    }, { timeout: 3000 });

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(aeatt);
    });
});
test("AssessmentDashboard.test.tsx Test 10: Should show View Completed Assessments page when clicking the view completed assessment button", async () => {
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
test("AssessmentDashboard.test.tsx Test 11: Should show Instructions for Assessment page when clicking the complete assessment button", async () => {
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