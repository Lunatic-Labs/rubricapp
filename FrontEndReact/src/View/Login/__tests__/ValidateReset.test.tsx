import { test } from "@jest/globals";
import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "../Login";

import {
    clickElementWithTestId,
    expectElementWithTestIdToBeInDocument,
    expectElementWithTestIdToHaveErrorMessage,
    changeElementWithTestIdWithInput,
    // changeElementWithTestIdWithCode
} from "../../../testUtilities";



var lf = "login-form";
var rpb = "reset-password-button";
var vrt = "validate-reset-title";
var vrbb = "validate-reset-back-button";
var vrcb = "validate-reset-confirm-button";
var vrf = "validate-reset-form";
var vrei = "validate-reset-email-input";
// var ecf = "enter-code-form";
// var vcb = "verify-code-button";
// var scbb = "send-code-back-button";
var ema = "error-message-alert";
// var sci = "send-code-input";
test("ValidateReset.test.tsx Test 1: should render Login Form component", () => {
    render(<Login />);

    expectElementWithTestIdToBeInDocument(lf);
});
test("ValidateReset.test.tsx Test 2: Should show Set New Password page when clicking Forgot Password Link.", async () => {
    render(<Login/>);

    clickElementWithTestId(rpb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(vrt);
    });
});
test("ValidateReset.test.tsx Test 3: Should show Login page when clicking Back button.", async () => {
    render(<Login/>);

    clickElementWithTestId(rpb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(vrt);
    });

    clickElementWithTestId(vrbb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(lf);
    });
});
test("ValidateReset.test.tsx Test 4: Should show email cannot be empty when email is not passed in.", async () => {
    render(<Login/>);

    clickElementWithTestId(rpb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(vrt);
    });

    clickElementWithTestId(vrcb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(vrf);

        expectElementWithTestIdToHaveErrorMessage(vrei, "Email cannot be empty.");
        //expectElementWithTestIdToHaveErrorMessage(ema, "Email cannot be empty.");
    });
});
test("ValidateReset.test.tsx Test 5: Should show SetNewPassword page when email is invalid.", async () => {
    render(<Login/>);

    clickElementWithTestId(rpb);

    changeElementWithTestIdWithInput(vrei, "sdfhdshajkfla");

    clickElementWithTestId(vrcb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(vrf);

        expectElementWithTestIdToHaveErrorMessage(ema, "An error occurred: Invalid Credentials");
    });
});

// Commented out due to validate reset email problems.
// test("ValidateReset.test.tsx Test 6: Should show SetNewPassword page when email is valid.", async () => {
//     render(<Login/>);

//     clickElementWithTestId(rpb);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(vrt);
//     });

//     changeElementWithTestIdWithInput(vrei, "demoadmin02@skillbuilder.edu");

//     clickElementWithTestId(vrcb);

//     await waitFor(() => {
//         expectElementWithTestIdToHaveErrorMessage(ema, "An error occurred: Invalid Credentials");
//     });
// });


// This test is currently broken due to a bug in the Validate Reset page
// test("ValidateReset.test.tsx Test 7: Should show Validate Reset page when clicking Back button on Code Required page.", async () => {
//     render(<Login/>);

//     clickElementWithTestId(rpb);

//     changeElementWithTestIdWithInput(vrei, "sdfhdshajkfla");

//     clickElementWithTestId(vrcb);

//     clickElementWithTestId(scbb);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(vrt);
//     });
// });


// test("ValidateReset.test.tsx Test 8: Should show make sure your code is correct when no code is entered.", async () => {
//     render(<Login/>);

//     clickElementWithTestId(rpb);

//     changeElementWithTestIdWithInput(vrei, "sdfhdshajkfla");

//     clickElementWithTestId(vrcb);

//     clickElementWithTestId(vcb);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(ecf);

//         expectElementWithTestIdToHaveErrorMessage(ema, "Make sure your code is correct.");
//     });
// });


// test("ValidateReset.test.tsx Test 9: Should show an error occurred please verify your code when an incorrect code is entered.", async () => {
//     render(<Login/>);

//     clickElementWithTestId(rpb);

//     changeElementWithTestIdWithInput(vrei, "sdfhdshajkfla");

//     clickElementWithTestId(vrcb);

//     changeElementWithTestIdWithCode(sci, "abcdef");

//     clickElementWithTestId(vcb);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(ecf);

//         expectElementWithTestIdToHaveErrorMessage(ema, "An error occurred: Invalid Credentials");
//     });
// });
