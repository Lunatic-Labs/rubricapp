// @ts-expect-error TS(2307): Cannot find module '@testing-library/react' or its... Remove this comment to see the full error message
import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "../Login.js";

import {
    clickElementWithAriaLabel,
    expectElementWithAriaLabelToBeInDocument,
    expectElementWithAriaLabelToHaveErrorMessage,
    changeElementWithAriaLabelWithInput,
    // changeElementWithAriaLabelWithCode
} from "../../../testUtilities.js";



var lf = "loginForm";
var rpb = "resetPasswordButton";
var vrt = "validateResetTitle";
var vrbb = "validateResetBackButton";
var vrcb = "validateResetConfirmButton";
var vrf = "validateResetForm";
var vrei = "validateResetEmailInput";
// var ecf = "enterCodeForm";
// var vcb = "verifyCodeButton";
// var scbb = "sendCodeBackButton";
var ema = "errorMessageAlert";
// var sci = "sendCodeInput";



// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("ValidateReset.test.js Test 1: should render Login Form component", () => {
    // @ts-expect-error TS(2352): Conversion of type 'RegExp' to type 'Login' may be... Remove this comment to see the full error message
    render(<Login />);

    expectElementWithAriaLabelToBeInDocument(lf);
});


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("ValidateReset.test.js Test 2: Should show Set New Password page when clicking Forgot Password Link.", async () => {
    // @ts-expect-error TS(2352): Conversion of type 'RegExp' to type 'Login' may be... Remove this comment to see the full error message
    render(<Login/>);

    clickElementWithAriaLabel(rpb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(vrt);
    });
});


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("ValidateReset.test.js Test 3: Should show Login page when clicking Back button.", async () => {
    // @ts-expect-error TS(2352): Conversion of type 'RegExp' to type 'Login' may be... Remove this comment to see the full error message
    render(<Login/>);

    clickElementWithAriaLabel(rpb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(vrt);
    });

    clickElementWithAriaLabel(vrbb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(lf);
    });
});


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("ValidateReset.test.js Test 4: Should show email cannot be empty when email is not passed in.", async () => {
    // @ts-expect-error TS(2352): Conversion of type 'RegExp' to type 'Login' may be... Remove this comment to see the full error message
    render(<Login/>);

    clickElementWithAriaLabel(rpb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(vrt);
    });

    clickElementWithAriaLabel(vrcb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(vrf);

        expectElementWithAriaLabelToHaveErrorMessage(ema, "Email cannot be empty.");
    });
});


// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("ValidateReset.test.js Test 5: Should show SetNewPassword page when email is invalid.", async () => {
    // @ts-expect-error TS(2352): Conversion of type 'RegExp' to type 'Login' may be... Remove this comment to see the full error message
    render(<Login/>);

    clickElementWithAriaLabel(rpb);

    changeElementWithAriaLabelWithInput(vrei, "sdfhdshajkfla");

    clickElementWithAriaLabel(vrcb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(vrf);

        expectElementWithAriaLabelToHaveErrorMessage(ema, "An error occurred: Invalid Credentials");
    });
});

// Commented out due to validate reset email problems.
// test("ValidateReset.test.js Test 6: Should show SetNewPassword page when email is valid.", async () => {
//     render(<Login/>);

//     clickElementWithAriaLabel(rpb);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(vrt);
//     });

//     changeElementWithAriaLabelWithInput(vrei, "demoadmin02@skillbuilder.edu");

//     clickElementWithAriaLabel(vrcb);

//     await waitFor(() => {
//         expectElementWithAriaLabelToHaveErrorMessage(ema, "An error occurred: Invalid Credentials");
//     });
// });


// This test is currently broken due to a bug in the Validate Reset page
// test("ValidateReset.test.js Test 7: Should show Validate Reset page when clicking Back button on Code Required page.", async () => {
//     render(<Login/>);

//     clickElementWithAriaLabel(rpb);

//     changeElementWithAriaLabelWithInput(vrei, "sdfhdshajkfla");

//     clickElementWithAriaLabel(vrcb);

//     clickElementWithAriaLabel(scbb);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(vrt);
//     });
// });


// test("ValidateReset.test.js Test 8: Should show make sure your code is correct when no code is entered.", async () => {
//     render(<Login/>);

//     clickElementWithAriaLabel(rpb);

//     changeElementWithAriaLabelWithInput(vrei, "sdfhdshajkfla");

//     clickElementWithAriaLabel(vrcb);

//     clickElementWithAriaLabel(vcb);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(ecf);

//         expectElementWithAriaLabelToHaveErrorMessage(ema, "Make sure your code is correct.");
//     });
// });


// test("ValidateReset.test.js Test 9: Should show an error occurred please verify your code when an incorrect code is entered.", async () => {
//     render(<Login/>);

//     clickElementWithAriaLabel(rpb);

//     changeElementWithAriaLabelWithInput(vrei, "sdfhdshajkfla");

//     clickElementWithAriaLabel(vrcb);

//     changeElementWithAriaLabelWithCode(sci, "abcdef");

//     clickElementWithAriaLabel(vcb);

//     await waitFor(() => {
//         expectElementWithAriaLabelToBeInDocument(ecf);

//         expectElementWithAriaLabelToHaveErrorMessage(ema, "An error occurred: Invalid Credentials");
//     });
// });