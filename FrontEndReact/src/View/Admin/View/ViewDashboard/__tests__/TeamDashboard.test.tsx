import { test, expect } from "@jest/globals";
import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "../../../../Login/Login";

import {
    clickElementWithAriaLabel,
    expectElementWithAriaLabelToBeInDocument,
    changeElementWithAriaLabelWithInput,
    clickFirstElementWithAriaLabel
} from "../../../../../testUtilities";

import {
    demoAdminPassword
} from "../../../../../App";



var lb = "loginButton";
var ei = "emailInput";
var pi = "passwordInput";
var ct = "coursesTitle";
var vcib = "viewCourseIconButton";
var mhbb = "mainHeaderBackButton";
var tt = "teamsTab";
var rt = "rosterTitle";
var td = "teamDashboard";
var abub = "adminBulkUploadButton";
var abut = "adminBulkUploadTitle";
var aatb = "adminAddTeamButton";
var aatt = "adminAddTeamTitle";
var vtib = "viewTeamsIconButton";
var avtmt = "adminViewTeamMembersTitle";
test("NOTE: Tests 1-5 will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});
test("TeamDashboard.test.tsx Test 1: Should render the TeamDashboard", async () => {
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

    clickElementWithAriaLabel(tt);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(td);
    });
});
test("TeamDashboard.test.tsx Test 2: Should render the Admin Bulk Upload page if the adminBulkUpload button is clicked", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(rt);
    });

    clickElementWithAriaLabel(tt);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(td);
    });

    await waitFor(() => {
        clickElementWithAriaLabel(abub);
    },{ timeout: 3000 });

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(abut);
    });
});
test("TeamDashboard.test.tsx Test 3: Should render the Add Team page if the adminAddTeam button is clicked", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(rt);
    });

    clickElementWithAriaLabel(tt);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(td);
    });

    await waitFor(() => {
        clickElementWithAriaLabel(aatb);
    },{ timeout: 3000 });
    
    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(aatt);
    });
});
test("TeamDashboard.test.tsx Test 4: Should render the View Team page if the adminViewTeam button is clicked", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(rt);
    });

    clickElementWithAriaLabel(tt);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(td);
    });

    await waitFor(() => {
        clickFirstElementWithAriaLabel(vtib);
    },{ timeout: 3000 });
    
    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(avtmt);
    });
});
test("MainHeader.test.tsx Test 5: Clicking the back button on the page should go to the page that came before the current (ViewCourseAdmin)", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(rt);
    });

    clickElementWithAriaLabel(mhbb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });
});