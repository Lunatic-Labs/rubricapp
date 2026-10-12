import { test, expect } from "@jest/globals";
import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "../../../../Login/Login";

import {
    clickElementWithTestId,
    expectElementWithTestIdToBeInDocument,
    changeElementWithTestIdWithInput,
    expectElementWithTestIdToHaveErrorMessage,
    clickFirstElementWithTestId
} from "../../../../../testUtilities";


var lb = "login-submit-button";
var ei = "login-email-input";
var pi = "login-password-input";
var aub = "add-user-button";
var aut = "add-user-title";
var ct = "courses-title";
var vcib = "view-course-icon-button";
var rt = "roster-title";
var mhbb = "main-header-back-button";
var caub = "cancel-add-user-button";
var aosaub = "add-or-save-add-user-button";
var auf = "add-user-form";
var ufni = "user-first-name-input";
var ulni = "user-last-name-input";
var ueai = "user-email-address-input";
// var aurdd= "add-user-role-drop-down";
test("NOTE: Tests 1-9 will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});
test("AdminAddUser.test.tsx Test 1: Should render the AdminAddUser component given the Add User button is clicked.", async () => {
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

    clickElementWithTestId(aub);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(aut);
    });
});
test("AdminAddUser.test.tsx Test 2: Should render the roster dashboard if the back button on the Add User page is clicked.", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    });

    clickElementWithTestId(aub);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(aut);
    });

    clickElementWithTestId(mhbb);
    
    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    });
});
test("AdminAddUser.test.tsx Test 3: Should render the roster dashboard if the cancel button on the Add User page is clicked.", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    });

    clickElementWithTestId(aub);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(aut);
    });

    clickElementWithTestId(caub);
    
    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    },{ timeout: 3000 });
});
test("AdminAddUser.test.tsx Test 4: HelperText errors should show for each text field when no information is filled.", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    });

    clickElementWithTestId(aub);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(aut);
    });

    clickElementWithTestId(aosaub);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(auf);

        expectElementWithTestIdToHaveErrorMessage(ufni,"First name cannot be empty");

        expectElementWithTestIdToHaveErrorMessage(ulni,"Last name cannot be empty");

        expectElementWithTestIdToHaveErrorMessage(ueai,"Email cannot be empty");
    });
});
test("AdminAddUser.test.tsx Test 5: HelperText error should show for the firstName text field when it is left blank while all other information is filled.", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    });

    clickElementWithTestId(aub);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(aut);
    });

    await waitFor(() => {
        changeElementWithTestIdWithInput(ulni,"Anderson");
    
        changeElementWithTestIdWithInput(ueai,"ebanderson@mail.lipscomb.edu");
    });

    clickElementWithTestId(aosaub);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(auf);
    
        expectElementWithTestIdToHaveErrorMessage(ufni,"First name cannot be empty");
    });
});
test("AdminAddUser.test.tsx Test 6: HelperText error should show for the LastName text field when it is left blank while all other information is filled.", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    });

    clickElementWithTestId(aub);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(aut);
    });

    await waitFor(() => {
        changeElementWithTestIdWithInput(ufni,"Elliot");
    
        changeElementWithTestIdWithInput(ueai,"ebanderson@mail.lipscomb.edu");
    });

    clickElementWithTestId(aosaub);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(auf);
    
        expectElementWithTestIdToHaveErrorMessage(ulni,"Last name cannot be empty");
    });
});
test("AdminAddUser.test.tsx Test 7: HelperText error should show for the Email Address text field when it is left blank while all other information is filled.", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    });

    clickElementWithTestId(aub);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(aut);
    });

    await waitFor(() => {
        changeElementWithTestIdWithInput(ufni,"Elliot");
    
        changeElementWithTestIdWithInput(ulni,"Anderson");
    });

    clickElementWithTestId(aosaub);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(auf);
    
        expectElementWithTestIdToHaveErrorMessage(ueai,"Email cannot be empty");
    });
});
test("AdminAddUser.test.tsx Test 8: HelperText error should show for the Email Address text field when the input is invalid.", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    });

    clickElementWithTestId(aub);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(aut);
    });

    await waitFor(() => {
        changeElementWithTestIdWithInput(ufni,"Elliot");

        changeElementWithTestIdWithInput(ulni,"Anderson");

        changeElementWithTestIdWithInput(ueai,"ebanderson")
    });

    clickElementWithTestId(aosaub);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(auf);
    
        expectElementWithTestIdToHaveErrorMessage(ueai,"Please enter a valid email address");
    });
});


// test("AdminAddUser.test.tsx Test 9: HelperText error should show for the Role dropdown text field when it is left blank while all other information is filled.", async () => {
//     render(<Login />);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(ct);
//     });

//     clickFirstElementWithTestId(vcib);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(rt);
//     });

//     clickElementWithTestId(aub);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(aut);
//     });

//     await waitFor(() => {
//         changeElementWithTestIdWithInput(ufni,"Elliot");

//         changeElementWithTestIdWithInput(ulni,"Anderson");

//         changeElementWithTestIdWithInput(ueai,"ebanderson@mail.lipscomb.edu")
//     });

//     clickElementWithTestId(aosaub);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(auf);
    
//         expectElementWithTestIdToHaveErrorMessage(aurdd,"Role cannot be empty");
//     });
// });