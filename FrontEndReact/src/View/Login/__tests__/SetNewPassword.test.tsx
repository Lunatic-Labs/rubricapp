import { test, expect } from "@jest/globals";
import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import SetNewPassword from "../SetNewPassword";

import {
    clickElementWithTestId,
    expectElementWithTestIdToBeInDocument,
    expectElementWithTestIdToHaveErrorMessage,
    changeElementWithTestIdWithInput
} from "../../../testUtilities";



var snpfl = "set-new-password-form";
var snpb = "set-new-password-button";
var ema = "error-message-alert";
var snpi = "set-new-password-input";
var sncpi = "set-new-password-confirm-input";
var lf = "login-form";
test("NOTE: Test 11 will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});
test("SetNewPassword.test.tsx Test 1: should render SetNewPassword Form component", () => {
    render(<SetNewPassword email="test@example.com" />);

    expectElementWithTestIdToBeInDocument(snpfl);
});
test("SetNewPassword.test.tsx Test 2: should display error password cannot be empty when no password or confirm password are entered", async () => {
    render(<SetNewPassword email="test@example.com" />);

    expectElementWithTestIdToBeInDocument(snpfl);

    clickElementWithTestId(snpb);

    await waitFor(() => {
        expectElementWithTestIdToHaveErrorMessage(ema, "Password cannot be empty");
    });
});
test("SetNewPassword.test.tsx Test 3: should display error confirm password cannot be empty when password is filled but not confirm password", async () => {
    render(<SetNewPassword email="test@example.com" />);

    expectElementWithTestIdToBeInDocument(snpfl);

    changeElementWithTestIdWithInput(snpi, "sdfhdshajkfla");

    clickElementWithTestId(snpb);

    await waitFor(() => {
        expectElementWithTestIdToHaveErrorMessage(ema, "Confirm Password cannot be empty");
    })
});
test("SetNewPassword.test.tsx Test 4: should display error passwords to not match", async () => {
    render(<SetNewPassword email="test@example.com" />);

    expectElementWithTestIdToBeInDocument(snpfl);

    changeElementWithTestIdWithInput(snpi, "passwordonedoesnotmatch");

    changeElementWithTestIdWithInput(sncpi, "passwordshouldmatch");

    clickElementWithTestId(snpb);

    await waitFor(() => {
        expectElementWithTestIdToHaveErrorMessage(ema, "Passwords do not match");
    });
});
test("SetNewPassword.test.tsx Test 5: should display error check password strength when password is less than 7 characters long", async () => {
    render(<SetNewPassword email="test@example.com" />);

    expectElementWithTestIdToBeInDocument(snpfl);

    changeElementWithTestIdWithInput(snpi, "1234567");

    changeElementWithTestIdWithInput(sncpi, "1234567");

    clickElementWithTestId(snpb);

    await waitFor(() => {
        expectElementWithTestIdToHaveErrorMessage(ema, "Please verify your password strength");
    });
});
test("SetNewPassword.test.tsx Test 6: should display error check password strength when password is 7 long and has one uppercase letter but not one lowercase letter", async () => {
    render(<SetNewPassword email="test@example.com" />);

    expectElementWithTestIdToBeInDocument(snpfl);

    changeElementWithTestIdWithInput(snpi, "ABCDEFG");

    changeElementWithTestIdWithInput(sncpi, "ABCDEFG");

    clickElementWithTestId(snpb);

    await waitFor(() => {
        expectElementWithTestIdToHaveErrorMessage(ema, "Please verify your password strength");
    });
});
test("SetNewPassword.test.tsx Test 7: should display error check password strength when password is 7 long and has one lowercase letter but not one uppercase letter", async () => {
    render(<SetNewPassword email="test@example.com" />);

    expectElementWithTestIdToBeInDocument(snpfl);

    changeElementWithTestIdWithInput(snpi, "abcdefg");

    changeElementWithTestIdWithInput(sncpi, "abcdefg");

    clickElementWithTestId(snpb);

    await waitFor(() => {
        expectElementWithTestIdToHaveErrorMessage(ema, "Please verify your password strength");
    });
});
test("SetNewPassword.test.tsx Test 8: should display error check password strength when password is 7 long, has one uppercase, and one lowercase letter but not one number", async () => {
    render(<SetNewPassword email="test@example.com" />);

    expectElementWithTestIdToBeInDocument(snpfl);

    changeElementWithTestIdWithInput(snpi, "Abcdefg");

    changeElementWithTestIdWithInput(sncpi, "Abcdefg");

    clickElementWithTestId(snpb);

    await waitFor(() => {
        expectElementWithTestIdToHaveErrorMessage(ema, "Please verify your password strength");
    });
});
test("SetNewPassword.test.tsx Test 9: should display error check password strength when password is 7 long, has one uppercase, one lowercase, and one number but not a special symbol", async () => {
    render(<SetNewPassword email="test@example.com" />);

    expectElementWithTestIdToBeInDocument(snpfl);

    changeElementWithTestIdWithInput(snpi, "Abcdefg1");

    changeElementWithTestIdWithInput(sncpi, "Abcdefg1");

    clickElementWithTestId(snpb);

    await waitFor(() => {
        expectElementWithTestIdToHaveErrorMessage(ema, "Please verify your password strength");
    });
});
test("SetNewPassword.test.tsx Test 10: should display error missing email or password when email is missing but check password strength is strong because the password is 7 long, has one uppercase, one lowercase, one number, and one special symbol", async () => {
    render(<SetNewPassword email={""} />);

    expectElementWithTestIdToBeInDocument(snpfl);

    changeElementWithTestIdWithInput(snpi, "Abcdefg1@");

    changeElementWithTestIdWithInput(sncpi, "Abcdefg1@");

    clickElementWithTestId(snpb);

    await waitFor(() => {
        expectElementWithTestIdToHaveErrorMessage(ema, "An error occurred: Missing Email or Password");
    });
});
test("SetNewPassword.test.tsx Test 11: should display login page when email is valid and check password strength is strong because the password is 7 long, has one uppercase, one lowercase, one number, and one special symbol", async () => {
    render(<SetNewPassword email={"demostudent5@skillbuilder.edu"} />);

    expectElementWithTestIdToBeInDocument(snpfl);

    changeElementWithTestIdWithInput(snpi, "Abcdefg1@");

    changeElementWithTestIdWithInput(sncpi, "Abcdefg1@");

    clickElementWithTestId(snpb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(lf);
    });
});
