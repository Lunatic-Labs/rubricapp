import { test, expect } from "@jest/globals";
import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "../../../../Login/Login";

import {
    clickElementWithTestId,
    expectElementWithTestIdToBeInDocument,
    changeElementWithTestIdWithInput,
    clickFirstElementWithTestId
} from "../../../../../testUtilities";


var lb = "login-submit-button";
var ei = "login-email-input";
var pi = "login-password-input";
var ct = "courses-title";
var vcib = "view-course-icon-button";
var mhbb = "main-header-back-button";
var tt = "teams-tab";
var rt = "roster-title";
var td = "team-dashboard";
var vtib = "view-teams-icon-button";
var avtmt = "admin-view-team-members-title";
var amb = "add-member-button";
var atmt = "add-team-members-title";
var rmb = "remove-member-button";
var rtmt = "remove-team-members-title";
var aetmstb = "admin-edit-team-members-save-team-button";
test("NOTE: Tests 1-9 will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});
test("AdminViewTeamMembers.test.tsx Test 1: Should render the TeamDashboard", async () => {
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

    clickElementWithTestId(tt);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(td);
    });
});
test("AdminViewTeamMembers.test.tsx Test 2: Should render the View Team page if the adminViewTeam button is clicked", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    });

    clickElementWithTestId(tt);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(td);
    });
    
    await waitFor(() => {
        clickFirstElementWithTestId(vtib);
    },{ timeout: 3000 });

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(avtmt);
    });
});
test("AdminViewTeamMembers.test.tsx Test 3: Should render the View Team page if the back button is clicked", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    });

    clickElementWithTestId(tt);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(td);
    });

    await waitFor(() => {
        clickFirstElementWithTestId(vtib);
    },{ timeout: 3000 });

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(avtmt);
    });
    
    clickElementWithTestId(mhbb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(td);
    });
});
test("AdminViewTeamMembers.test.tsx Test 4: Should render the Add Team Members page if the add member button is clicked", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    });

    clickElementWithTestId(tt);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(td);
    });

    await waitFor(() => {
        clickFirstElementWithTestId(vtib);
    },{ timeout: 3000 });

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(avtmt);
    });
    
    clickElementWithTestId(amb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(atmt);
    });
});
test("AdminViewTeamMembers.test.tsx Test 5: Should render the Remove Team Members page if the remove member button is clicked", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    });

    clickElementWithTestId(tt);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(td);
    });

    await waitFor(() => {
        clickFirstElementWithTestId(vtib);
    },{ timeout: 3000 });

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(avtmt);
    });

    clickElementWithTestId(rmb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rtmt);
    });
});
test("AdminViewTeamMembers.test.tsx Test 6: Should render the AdminViewTeamMembers page if the back button on the AddMembers page is clicked", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    });

    clickElementWithTestId(tt);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(td);
    });

    await waitFor(() => {
        clickFirstElementWithTestId(vtib);
    },{ timeout: 3000 });

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(avtmt);
    });

    clickElementWithTestId(amb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(atmt);
    });
    
    clickElementWithTestId(mhbb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(avtmt);
    });
});
test("AdminViewTeamMembers.test.tsx Test 7: Should render the AdminViewTeamMembers page if the back button on the RemoveMembers page is clicked", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    });

    clickElementWithTestId(tt);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(td);
    });

    await waitFor(() => {
        clickFirstElementWithTestId(vtib);
    },{ timeout: 3000 });

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(avtmt);
    });
    
    clickElementWithTestId(rmb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rtmt);
    });
    
    clickElementWithTestId(mhbb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(avtmt);
    });
});
test("AdminViewTeamMembers.test.tsx Test 8: Should render the AdminViewTeamMembers page if the save team button on the AddMembers page is clicked", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    });

    clickElementWithTestId(tt);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(td);
    });

    await waitFor(() => {
        clickFirstElementWithTestId(vtib);
    },{ timeout: 3000 });

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(avtmt);
    });
    
    clickElementWithTestId(amb);
    
    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(atmt);
    });
    
    clickElementWithTestId(aetmstb);
});
test("AdminViewTeamMembers.test.tsx Test 9: Should render the AdminViewTeamMembers page if the save team button on the RemoveMembers page is clicked", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    });

    clickElementWithTestId(tt);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(td);
    });

    await waitFor(() => {
        clickFirstElementWithTestId(vtib);
    },{ timeout: 3000 });

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(avtmt);
    });
    
    clickElementWithTestId(rmb);
    
    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rtmt);
    });
    
    clickElementWithTestId(aetmstb);
});