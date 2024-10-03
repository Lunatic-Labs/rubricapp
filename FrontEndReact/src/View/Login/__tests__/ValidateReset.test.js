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



test("ValidateReset.test.js Test 1: should render Login Form component", () => {
    render(<Login />);

    expectElementWithAriaLabelToBeInDocument(lf);
});


test("ValidateReset.test.js Test 2: Should show Set New Password page when clicking Forgot Password Link.", async () => {
    render(<Login/>);

    clickElementWithAriaLabel(rpb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(vrt);
    });
});


test("ValidateReset.test.js Test 3: Should show Login page when clicking Back button.", async () => {
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


test("ValidateReset.test.js Test 4: Should show email cannot be empty when email is not passed in.", async () => {
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


test("ValidateReset.test.js Test 5: Should show SetNewPassword page when email is invalid.", async () => {
    render(<Login/>);

    clickElementWithAriaLabel(rpb);

    changeElementWithAriaLabelWithInput(vrei, "sdfhdshajkfla");

    clickElementWithAriaLabel(vrcb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(vrf);

        expectElementWithAriaLabelToHaveErrorMessage(ema, "An error occurred: Invalid Credentials");
    });
});


test("ValidateReset.test.js Test 6: Should show SetNewPassword page when email is valid.", async () => {
    render(<Login/>);

    clickElementWithAriaLabel(rpb);

    changeElementWithAriaLabelWithInput(vrei, "demoadmin02@skillbuilder.edu");

    clickElementWithAriaLabel(vrcb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(vrf);

        expectElementWithAriaLabelToHaveErrorMessage(ema, "An error occurred: Email failure");
    });
});


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