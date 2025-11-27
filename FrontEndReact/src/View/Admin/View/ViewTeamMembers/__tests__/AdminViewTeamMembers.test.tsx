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
var mhbb = "mainHeaderBackButton";
var tt = "teamsTab";
var rt = "rosterTitle";
var td = "teamDashboard";
var vtib = "viewTeamsIconButton";
var avtmt = "adminViewTeamMembersTitle";
var amb = "addMemberButton";
var atmt = "AddTeamMembersTitle";
var rmb = "removeMemberButton";
var rtmt = "RemoveTeamMembersTitle";
var aetmstb = "adminEditTeamMembersSaveTeamButton";
test("NOTE: Tests 1-9 will not pass if Demo Data is not loaded!", () => {
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
        expectElementWithAriaLabelToBeInDocument(rt);
    });

    clickElementWithAriaLabel(tt);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(td);
    });
});
test("AdminViewTeamMembers.test.js Test 2: Should render the View Team page if the adminViewTeam button is clicked", async () => {
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
test("AdminViewTeamMembers.test.js Test 3: Should render the View Team page if the back button is clicked", async () => {
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
    
    clickElementWithAriaLabel(mhbb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(td);
    });
});
test("AdminViewTeamMembers.test.js Test 4: Should render the Add Team Members page if the add member button is clicked", async () => {
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
    
    clickElementWithAriaLabel(amb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(atmt);
    });
});
test("AdminViewTeamMembers.test.js Test 5: Should render the Remove Team Members page if the remove member button is clicked", async () => {
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

    clickElementWithAriaLabel(rmb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(rtmt);
    });
});
test("AdminViewTeamMembers.test.js Test 6: Should render the AdminViewTeamMembers page if the back button on the AddMembers page is clicked", async () => {
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

    clickElementWithAriaLabel(amb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(atmt);
    });
    
    clickElementWithAriaLabel(mhbb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(avtmt);
    });
});
test("AdminViewTeamMembers.test.js Test 7: Should render the AdminViewTeamMembers page if the back button on the RemoveMembers page is clicked", async () => {
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
    
    clickElementWithAriaLabel(rmb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(rtmt);
    });
    
    clickElementWithAriaLabel(mhbb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(avtmt);
    });
});
test("AdminViewTeamMembers.test.js Test 8: Should render the AdminViewTeamMembers page if the save team button on the AddMembers page is clicked", async () => {
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
    
    clickElementWithAriaLabel(amb);
    
    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(atmt);
    });
    
    clickElementWithAriaLabel(aetmstb);
});
test("AdminViewTeamMembers.test.js Test 9: Should render the AdminViewTeamMembers page if the save team button on the RemoveMembers page is clicked", async () => {
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
    
    clickElementWithAriaLabel(rmb);
    
    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(rtmt);
    });
    
    clickElementWithAriaLabel(aetmstb);
});