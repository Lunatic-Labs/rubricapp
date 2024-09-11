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



var lf = "loginForm";
var ei = "emailInput";
var pi = "passwordInput";
var ct = "coursesTitle";
var vcib = "viewCourseIconButton";
var rt = "rosterTitle";
var tt = "teamsTab";
var td = "teamDashboard";
var abub = "adminBulkUploadButton";
var abut = "adminBulkUploadTitle";
var aatb = "adminAddTeamButton";
var aatt = "adminAddTeamTitle";
var etib = "editTeamIconButton";
var ett = "editTeamTitle";
var vtib = "viewTeamsIconButton";
var avtmt = "adminViewTeamMembersTitle";
var lb = "loginButton";



test("NOTE: Tests 1-6 will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});


test("AdminViewTeams.test.js Test 1: Should render Login Form component", () => {
    render(<Login />);

    expectElementWithAriaLabelToBeInDocument(lf);
});


test("AdminViewTeams.test.js Test 2: Should render the Team Dashboard in Admin View",  async () => {
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
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(td);
        }, 3000);
    });
});


test("AdminViewTeams.test.js Test 3: Should render the Team Bulk Upload page given the Team Bulk Upload Button is clicked on Admin View.",  async () => {
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
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(td);
        }, 3000);
    });


    setTimeout(() => {
        clickElementWithAriaLabel(abub);
    }, 3000);

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(abut);
        }, 3000);
    });
});


test("AdminViewTeams.test.js Test 4: Should render the Add Team Form given the Add Team Button is clicked on Admin View.",  async () => {
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
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(td);
        }, 3000);
    });

    setTimeout(() => {
        clickElementWithAriaLabel(aatb);
    }, 3000);
    
    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(aatt);
        }, 3000);
    });
});


test("AdminViewTeams.test.js Test 5: Should render the Edit Team Form given the Edit Icon is clicked on Admin View.",  async () => {
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
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(td);
        }, 3000);
    });

    setTimeout(() => {
        clickFirstElementWithAriaLabel(etib);
    }, 3000);

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(ett);
        }, 3000);
    });
});


test("AdminViewTeams.test.js Test 6: Should render the Team Name page given the View Team Members button is clicked on Admin View.",  async () => {
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
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(td);
        }, 3000);
    });

    setTimeout(() => {
        clickElementWithAriaLabel(vtib);
    }, 3000);

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(avtmt);
        }, 3000);
    });
});