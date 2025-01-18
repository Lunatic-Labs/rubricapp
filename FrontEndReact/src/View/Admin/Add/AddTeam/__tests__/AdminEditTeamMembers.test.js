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
var atmt = "addTeamMembersTitle";
var rmb = "removeMemberButton";
var rtmt = "removeTeamMembersTitle";
var aetmstb = "adminEditTeamMembersSaveTeamButton";



test("NOTE: Tests 1-8 will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});


test("AdminEditTeamMembers.test.js Test 1: Should render the TeamDashboard", async () => {
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


test("AdminEditTeamMembers.test.js Test 2: Should render the View Team Members page if the adminViewTeam button is clicked", async () => {
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


test("AdminEditTeamMembers.test.js Test 3: Should render the Add Team Members page if the Add Member button is clicked", async () => {
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


test("AdminEditTeamMembers.test.js Test 4: Should render the View Team Members page if the back button is clicked on the Add Members page", async () => {
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


// test("AdminEditTeamMembers.test.js Test 5: Should render the View Team Members page if the Save Team button is clicked on the Add Members page", async () => {
//     render(<Login />);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(ct);
//     });

//     clickFirstElementWithAriaLabel(vcib);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(rt);
//     });

//     clickElementWithAriaLabel(tt);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(td);
//     });

//     await waitFor(() => {
//         clickFirstElementWithAriaLabel(vtib);
//     },{ timeout: 3000 });

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(avtmt);
//     });
    
//     clickElementWithAriaLabel(amb);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(atmt);
//     });
    
//     clickElementWithAriaLabel(aetmstb);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(avtmt);
//     },{ timeout: 3000 });
// });


test("AdminEditTeamMembers.test.js Test 6: Should render the Remove Team Members page if the remove member button is clicked", async () => {
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


test("AdminEditTeamMembers.test.js Test 7: Should render the View Team Members page if the back button is clicked on the remove member page", async () => {
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


// test("AdminEditTeamMembers.test.js Test 8: Should render the View Team Members page if the save team button is clicked on the remove member page", async () => {
//     render(<Login />);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(ct);
//     });

//     clickFirstElementWithAriaLabel(vcib);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(rt);
//     });

//     clickElementWithAriaLabel(tt);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(td);
//     });

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(avtmt);
//     });
    
//     clickElementWithAriaLabel(rmb);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(rtmt);
//     });
    
//     clickElementWithAriaLabel(aetmstb);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(avtmt);
//     },{ timeout: 3000 });
// });