// @ts-expect-error TS(2307): Cannot find module '@testing-library/react' or its... Remove this comment to see the full error message
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
// var aetmstb = "adminEditTeamMembersSaveTeamButton";
// var amib = "addMemberIconButton";
// var rmib = "removeMemberIconButton"



// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("NOTE: Tests 1-8 will not pass if Demo Data is not loaded!", () => {
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(true).toBe(true);
});


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("AdminEditTeamMembers.test.js Test 1: Should render the TeamDashboard", async () => {
    // @ts-expect-error TS(2352): Conversion of type 'RegExp' to type 'Login' may be... Remove this comment to see the full error message
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


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("AdminEditTeamMembers.test.js Test 2: Should render the View Team Members page if the adminViewTeam button is clicked", async () => {
    // @ts-expect-error TS(2352): Conversion of type 'RegExp' to type 'Login' may be... Remove this comment to see the full error message
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


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("AdminEditTeamMembers.test.js Test 3: Should render the Add Team Members page if the Add Member button is clicked", async () => {
    // @ts-expect-error TS(2352): Conversion of type 'RegExp' to type 'Login' may be... Remove this comment to see the full error message
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


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("AdminEditTeamMembers.test.js Test 4: Should render the View Team Members page if the back button is clicked on the Add Members page", async () => {
    // @ts-expect-error TS(2352): Conversion of type 'RegExp' to type 'Login' may be... Remove this comment to see the full error message
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


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("AdminEditTeamMembers.test.js Test 6: Should render the Remove Team Members page if the remove member button is clicked", async () => {
    // @ts-expect-error TS(2352): Conversion of type 'RegExp' to type 'Login' may be... Remove this comment to see the full error message
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


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("AdminEditTeamMembers.test.js Test 7: Should render the View Team Members page if the back button is clicked on the remove member page", async () => {
    // @ts-expect-error TS(2352): Conversion of type 'RegExp' to type 'Login' may be... Remove this comment to see the full error message
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