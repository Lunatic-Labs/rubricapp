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



var lb = "loginButton";
var ei = "emailInput";
var pi = "passwordInput";
var ct = "coursesTitle";
var vcib = "viewCourseIconButton";
var vcmh = "viewCourseMainHeader";
var mhbb = "mainHeaderBackButton";
var tt = "teamsTab";
var rt = "rosterTitle";
var td = "teamDashboard";
var abub = "adminBulkUploadButton";
var abu = "adminBulkUpload";
var aatb = "adminAddTeamButton";
var aatt = "adminAddTeamTitle";
var vtib = "viewTeamsIconButton";
var avtmt = "adminViewTeamMembersTitle";
var amb = "addMemberButton";
var atmt = "addTeamMembersTitle";
var rmb = "removeMemberButton";
var rtmt = "removeTeamMembersTitle";



test("NOTE: Tests 1-4 will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});


test("AdminViewTeamMembers.test.js Test 1: Should render the TeamDashboard", async () => {
    render(<Login />);

    changeElementWithAriaLabelWithInput(ei, "demoadmin02@skillbuilder.edu");

    changeElementWithAriaLabelWithInput(pi, demoAdminPassword);

    clickElementWithAriaLabel(lb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(rt);
        }, 3000);
    });

    clickElementWithAriaLabel(tt);

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(td);
        }, 3000);
    });
});


test("AdminViewTeamMembers.test.js Test 2: Should render the View Team page if the adminViewTeam button is clicked", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(rt);
        }, 3000);
    });

    clickElementWithAriaLabel(tt);

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(td);

            clickElementWithAriaLabel(vtib);
        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(avtmt);
        }, 3000);
    });
});


test("AdminViewTeamMembers.test.js Test 3: Should render the Add Team Members page if the add member button is clicked", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(rt);
        }, 3000);
    });

    clickElementWithAriaLabel(tt);

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(td);

            clickElementWithAriaLabel(vtib);
        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(avtmt);

            clickElementWithAriaLabel(amb);
        }, 3000);
    });


    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(atmt);
        }, 3000);
    });
});


test("AdminViewTeamMembers.test.js Test 4: Should render the Remove Team Members page if the remove member button is clicked", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(rt);
        }, 3000);
    });

    clickElementWithAriaLabel(tt);

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(td);

            clickElementWithAriaLabel(vtib);
        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(avtmt);

            clickElementWithAriaLabel(rmb);
        }, 3000);
    });


    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(rtmt);
        }, 3000);
    });
});