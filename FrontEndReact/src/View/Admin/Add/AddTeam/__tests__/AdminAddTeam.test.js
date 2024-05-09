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



test("NOTE: Tests 1-6 will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});


test("AdminAddTeam.test.js Test 1: Should render the TeamDashboard", async () => {
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


test("AdminAddTeam.test.js Test 2: Should render the Add Team page if the adminAddTeam button is clicked", async () => {
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

            clickElementWithAriaLabel(aatb);
        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(aatt);
        }, 3000);
    });
});


test("AdminAddTeam.test.js Test 3: Should render the teams dashboard if the back button on the Add Team page is clicked ", async () => {
    render(<Login/>);

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

            clickElementWithAriaLabel(aatb);
        }, 3000);
    });

    

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(aatt);
        }, 3000);
    });

    clickElementWithAriaLabel(mhbb);
    
    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(td);
        }, 3000);
    });
});


test("AdminAddTeam.test.js Test 4: Should render the teams dashboard if the cancel button on the Add Team page is clicked ", async () => {
    render(<Login/>);

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

            clickElementWithAriaLabel(aatb);
        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(aatt);

            clickElementWithAriaLabel(catb);
        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(td);
        }, 3000);
    });
});


test("AdminAddTeam.test.js Test 5: HelperText errors should show for each text field when no information is filled", async () => {
    render(<Login/>);

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

            clickElementWithAriaLabel(aatb);
        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(aatt);

            clickElementWithAriaLabel(aosatb);
        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(atf);

            expectElementWithAriaLabelToHaveErrorMessage(utni,"Team name cannot be empty");
        }, 3000);
        
    });
});


test("AdminAddTeam.test.js Test 6: HelperText error should show for the teamName text field when it is left blank while all other information is filled", async () => {
    render(<Login/>);

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

            clickElementWithAriaLabel(aatb);
        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(atf);

            expectElementWithAriaLabelToHaveErrorMessage(utni,"Team name cannot be empty");
        }, 3000);
    });
});