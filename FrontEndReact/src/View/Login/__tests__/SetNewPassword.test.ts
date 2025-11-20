import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import SetNewPassword from "../SetNewPassword.js";

import {
    clickElementWithAriaLabel,
    expectElementWithAriaLabelToBeInDocument,
    expectElementWithAriaLabelToHaveErrorMessage,
    changeElementWithAriaLabelWithInput
} from "../../../testUtilities.js";



var snpfl = "setNewPasswordFormLabel";
var snpb = "setNewPasswordButton";
var ema = "errorMessageAlert";
var snpi = "setNewPasswordInput";
var sncpi = "setNewPasswordConfirmInput";
var lf = "loginForm";



test("NOTE: Test 11 will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});


test("SetNewPassword.test.js Test 1: should render SetNewPassword Form component", () => {
    render(<SetNewPassword />);

    expectElementWithAriaLabelToBeInDocument(snpfl);
});


test("SetNewPassword.test.js Test 2: should display error password cannot be empty when no password or confirm password are entered", async () => {
    render(<SetNewPassword />);

    expectElementWithAriaLabelToBeInDocument(snpfl);

    clickElementWithAriaLabel(snpb);

    await waitFor(() => {
        expectElementWithAriaLabelToHaveErrorMessage(ema, "Password cannot be empty");
    });
});


test("SetNewPassword.test.js Test 3: should display error confirm password cannot be empty when password is filled but not confirm password", async () => {
    render(<SetNewPassword />);

    expectElementWithAriaLabelToBeInDocument(snpfl);

    changeElementWithAriaLabelWithInput(snpi, "sdfhdshajkfla");

    clickElementWithAriaLabel(snpb);

    await waitFor(() => {
        expectElementWithAriaLabelToHaveErrorMessage(ema, "Confirm Password cannot be empty");
    })
});


test("SetNewPassword.test.js Test 4: should display error passwords to not match", async () => {
    render(<SetNewPassword />);

    expectElementWithAriaLabelToBeInDocument(snpfl);

    changeElementWithAriaLabelWithInput(snpi, "passwordonedoesnotmatch");

    changeElementWithAriaLabelWithInput(sncpi, "passwordshouldmatch");

    clickElementWithAriaLabel(snpb);

    await waitFor(() => {
        expectElementWithAriaLabelToHaveErrorMessage(ema, "Passwords do not match");
    });
});


test("SetNewPassword.test.js Test 5: should display error check password strength when password is less than 7 characters long", async () => {
    render(<SetNewPassword />);

    expectElementWithAriaLabelToBeInDocument(snpfl);

    changeElementWithAriaLabelWithInput(snpi, "1234567");

    changeElementWithAriaLabelWithInput(sncpi, "1234567");

    clickElementWithAriaLabel(snpb);

    await waitFor(() => {
        expectElementWithAriaLabelToHaveErrorMessage(ema, "Please verify your password strength");
    });
});


test("SetNewPassword.test.js Test 6: should display error check password strength when password is 7 long and has one uppercase letter but not one lowercase letter", async () => {
    render(<SetNewPassword />);

    expectElementWithAriaLabelToBeInDocument(snpfl);

    changeElementWithAriaLabelWithInput(snpi, "ABCDEFG");

    changeElementWithAriaLabelWithInput(sncpi, "ABCDEFG");

    clickElementWithAriaLabel(snpb);

    await waitFor(() => {
        expectElementWithAriaLabelToHaveErrorMessage(ema, "Please verify your password strength");
    });
});


test("SetNewPassword.test.js Test 7: should display error check password strength when password is 7 long and has one lowercase letter but not one uppercase letter", async () => {
    render(<SetNewPassword />);

    expectElementWithAriaLabelToBeInDocument(snpfl);

    changeElementWithAriaLabelWithInput(snpi, "abcdefg");

    changeElementWithAriaLabelWithInput(sncpi, "abcdefg");

    clickElementWithAriaLabel(snpb);

    await waitFor(() => {
        expectElementWithAriaLabelToHaveErrorMessage(ema, "Please verify your password strength");
    });
});


test("SetNewPassword.test.js Test 8: should display error check password strength when password is 7 long, has one uppercase, and one lowercase letter but not one number", async () => {
    render(<SetNewPassword />);

    expectElementWithAriaLabelToBeInDocument(snpfl);

    changeElementWithAriaLabelWithInput(snpi, "Abcdefg");

    changeElementWithAriaLabelWithInput(sncpi, "Abcdefg");

    clickElementWithAriaLabel(snpb);

    await waitFor(() => {
        expectElementWithAriaLabelToHaveErrorMessage(ema, "Please verify your password strength");
    });
});


test("SetNewPassword.test.js Test 9: should display error check password strength when password is 7 long, has one uppercase, one lowercase, and one number but not a special symbol", async () => {
    render(<SetNewPassword />);

    expectElementWithAriaLabelToBeInDocument(snpfl);

    changeElementWithAriaLabelWithInput(snpi, "Abcdefg1");

    changeElementWithAriaLabelWithInput(sncpi, "Abcdefg1");

    clickElementWithAriaLabel(snpb);

    await waitFor(() => {
        expectElementWithAriaLabelToHaveErrorMessage(ema, "Please verify your password strength");
    });
});


test("SetNewPassword.test.js Test 10: should display error missing email or password when email is missing but check password strength is strong because the password is 7 long, has one uppercase, one lowercase, one number, and one special symbol", async () => {
    render(<SetNewPassword email={""} />);

    expectElementWithAriaLabelToBeInDocument(snpfl);

    changeElementWithAriaLabelWithInput(snpi, "Abcdefg1@");

    changeElementWithAriaLabelWithInput(sncpi, "Abcdefg1@");

    clickElementWithAriaLabel(snpb);

    await waitFor(() => {
        expectElementWithAriaLabelToHaveErrorMessage(ema, "An error occurred: Missing Email or Password");
    });
});


test("SetNewPassword.test.js Test 11: should display login page when email is valid and check password strength is strong because the password is 7 long, has one uppercase, one lowercase, one number, and one special symbol", async () => {
    render(<SetNewPassword email={"demostudent5@skillbuilder.edu"} />);

    expectElementWithAriaLabelToBeInDocument(snpfl);

    changeElementWithAriaLabelWithInput(snpi, "Abcdefg1@");

    changeElementWithAriaLabelWithInput(sncpi, "Abcdefg1@");

    clickElementWithAriaLabel(snpb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(lf);
    });
});