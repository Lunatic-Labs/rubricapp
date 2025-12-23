import { test, expect } from "@jest/globals";
import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "../../../../Login/Login";

import {
    clickElementWithAriaLabel,
    expectElementWithAriaLabelToBeInDocument,
    changeElementWithAriaLabelWithInput,
    clickFirstElementWithAriaLabel,
    expectElementWithAriaLabelToHaveErrorMessage
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
var aatb = "adminAddTeamButton";
var aatt = "adminAddTeamTitle";
var catb = "cancelAddTeamButton";
var aosatb = "addOrSaveAddTeamButton";
var atf = "addTeamForm";
var utni = "userTeamNameInput";
test("NOTE: Tests 1-5 will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});
test("AdminAddTeam.test.tsx Test 1: Should render the TeamDashboard", async () => {
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
test("AdminAddTeam.test.tsx Test 2: Should render the Add Team page if the adminAddTeam button is clicked", async () => {
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
test("AdminAddTeam.test.tsx Test 3: Should render the teams dashboard if the back button on the Add Team page is clicked", async () => {
    render(<Login/>);

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

    clickElementWithAriaLabel(mhbb);
    
    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(td);
    });
});
test("AdminAddTeam.test.tsx Test 4: Should render the teams dashboard if the cancel button on the Add Team page is clicked", async () => {
    render(<Login/>);

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

    clickElementWithAriaLabel(catb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(td);
    });
});
test("AdminAddTeam.test.tsx Test 5: HelperText errors should show for Team Name text field when no information is filled", async () => {
    render(<Login/>);

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

    clickElementWithAriaLabel(aosatb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(atf);

        expectElementWithAriaLabelToHaveErrorMessage(utni,"Team name cannot be empty");
    });
});