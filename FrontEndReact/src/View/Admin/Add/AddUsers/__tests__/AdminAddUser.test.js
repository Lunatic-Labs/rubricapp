import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "../../../../Login/Login.js";

import {
    clickElementWithAriaLabel,
    expectElementWithAriaLabelToBeInDocument,
    changeElementWithAriaLabelWithInput,
    expectElementWithAriaLabelToHaveErrorMessage,
    clickFirstElementWithAriaLabel
} from "../../../../../testUtilities.js";

import {
    demoAdminPassword
} from "../../../../../App.js";



var lb = "loginButton";
var ei = "emailInput";
var pi = "passwordInput";
var aub = "addUserButton";
var aut = "addUserTitle";
var ct = "coursesTitle";
var vcib = "viewCourseIconButton";
var rt = "rosterTitle";
var mhbb = "mainHeaderBackButton";
var caub = "cancelAddUserButton";
var aosaub = "addOrSaveAddUserButton";
var auf = "addUserForm";
var ufni = "userFirstNameInput";
var ulni = "userLastNameInput";
var ueai = "userEmailAddressInput";
var aurdd= "addUserRoleDropDown";



test("NOTE: Tests 1-10 will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});


test("AdminAddUser.test.js Test 1: Should render the AdminAddUser component given the Add User button is clicked.", async () => {
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

    clickElementWithAriaLabel(aub);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(aut);
    });
});


test("AdminAddUser.test.js Test 2: Should render the roster dashboard if the back button on the Add User page is clicked.", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(rt);
    });

    clickElementWithAriaLabel(aub);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(aut);
    });

    clickElementWithAriaLabel(mhbb);
    
    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(rt);
    });
});


test("AdminAddUser.test.js Test 3: Should render the roster dashboard if the cancel button on the Add User page is clicked.", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(rt);
    });

    clickElementWithAriaLabel(aub);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(aut);
    });

    clickElementWithAriaLabel(caub);
    
    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(rt);
    },{ timeout: 3000 });
});


test("AdminAddUser.test.js Test 4: HelperText errors should show for each text field when no information is filled.", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(rt);
    });

    clickElementWithAriaLabel(aub);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(aut);
    });

    clickElementWithAriaLabel(aosaub);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(auf);

        expectElementWithAriaLabelToHaveErrorMessage(ufni,"First name cannot be empty");

        expectElementWithAriaLabelToHaveErrorMessage(ulni,"Last name cannot be empty");

        expectElementWithAriaLabelToHaveErrorMessage(ueai,"Email cannot be empty");
    });
});


test("AdminAddUser.test.js Test 5: HelperText error should show for the firstName text field when it is left blank while all other information is filled.", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(rt);
    });

    clickElementWithAriaLabel(aub);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(aut);
    });

    await waitFor(() => {
        changeElementWithAriaLabelWithInput(ulni,"Anderson");
    
        changeElementWithAriaLabelWithInput(ueai,"ebanderson@mail.lipscomb.edu");
    });

    clickElementWithAriaLabel(aosaub);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(auf);
    
        expectElementWithAriaLabelToHaveErrorMessage(ufni,"First name cannot be empty");
    });
});


test("AdminAddUser.test.js Test 6: HelperText error should show for the LastName text field when it is left blank while all other information is filled.", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(rt);
    });

    clickElementWithAriaLabel(aub);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(aut);
    });

    await waitFor(() => {
        changeElementWithAriaLabelWithInput(ufni,"Elliot");
    
        changeElementWithAriaLabelWithInput(ueai,"ebanderson@mail.lipscomb.edu");
    });

    clickElementWithAriaLabel(aosaub);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(auf);
    
        expectElementWithAriaLabelToHaveErrorMessage(ulni,"Last name cannot be empty");
    });
});


test("AdminAddUser.test.js Test 7: HelperText error should show for the Email Address text field when it is left blank while all other information is filled.", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(rt);
    });

    clickElementWithAriaLabel(aub);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(aut);
    });

    await waitFor(() => {
        changeElementWithAriaLabelWithInput(ufni,"Elliot");
    
        changeElementWithAriaLabelWithInput(ulni,"Anderson");
    });

    clickElementWithAriaLabel(aosaub);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(auf);
    
        expectElementWithAriaLabelToHaveErrorMessage(ueai,"Email cannot be empty");
    });
});


test("AdminAddUser.test.js Test 8: HelperText error should show for the Email Address text field when the input is invalid.", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(rt);
    });

    clickElementWithAriaLabel(aub);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(aut);
    });

    await waitFor(() => {
        changeElementWithAriaLabelWithInput(ufni,"Elliot");

        changeElementWithAriaLabelWithInput(ulni,"Anderson");

        changeElementWithAriaLabelWithInput(ueai,"ebanderson")
    });

    clickElementWithAriaLabel(aosaub);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(auf);
    
        expectElementWithAriaLabelToHaveErrorMessage(ueai,"Please enter a valid email address");
    });
});


// test("AdminAddUser.test.js Test 9: HelperText error should show for the Role dropdown text field when it is left blank while all other information is filled.", async () => {
//     render(<Login />);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(ct);
//     });

//     clickFirstElementWithAriaLabel(vcib);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(rt);
//     });

//     clickElementWithAriaLabel(aub);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(aut);
//     });

//     await waitFor(() => {
//         changeElementWithAriaLabelWithInput(ufni,"Elliot");

//         changeElementWithAriaLabelWithInput(ulni,"Anderson");

//         changeElementWithAriaLabelWithInput(ueai,"ebanderson@mail.lipscomb.edu")
//     });

//     clickElementWithAriaLabel(aosaub);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(auf);
    
//         expectElementWithAriaLabelToHaveErrorMessage(aurdd,"Role cannot be empty");
//     });
// });