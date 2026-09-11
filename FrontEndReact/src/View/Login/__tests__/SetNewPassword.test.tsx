import { test, describe, expect, afterEach, jest } from "@jest/globals";
import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Cookies from "universal-cookie";
import SetNewPassword from "../SetNewPassword";

import {
    clickElementWithAriaLabel,
    expectElementWithAriaLabelToBeInDocument,
    expectElementWithAriaLabelToHaveErrorMessage,
    changeElementWithAriaLabelWithInput
} from "../../../testUtilities";



var snpfl = "setNewPasswordFormLabel";
var snpb = "setNewPasswordButton";
var ema = "errorMessageAlert";
var snpi = "setNewPasswordInput";
var sncpi = "setNewPasswordConfirmInput";
test("SetNewPassword.test.tsx Test 1: should render SetNewPassword Form component", () => {
    render(<SetNewPassword email="test@example.com" />);

    expectElementWithAriaLabelToBeInDocument(snpfl);
});
test("SetNewPassword.test.tsx Test 2: should display error password cannot be empty when no password or confirm password are entered", async () => {
    render(<SetNewPassword email="test@example.com" />);

    expectElementWithAriaLabelToBeInDocument(snpfl);

    clickElementWithAriaLabel(snpb);

    await waitFor(() => {
        expectElementWithAriaLabelToHaveErrorMessage(ema, "Password cannot be empty");
    });
});
test("SetNewPassword.test.tsx Test 3: should display error confirm password cannot be empty when password is filled but not confirm password", async () => {
    render(<SetNewPassword email="test@example.com" />);

    expectElementWithAriaLabelToBeInDocument(snpfl);

    changeElementWithAriaLabelWithInput(snpi, "sdfhdshajkfla");

    clickElementWithAriaLabel(snpb);

    await waitFor(() => {
        expectElementWithAriaLabelToHaveErrorMessage(ema, "Confirm Password cannot be empty");
    })
});
test("SetNewPassword.test.tsx Test 4: should display error passwords to not match", async () => {
    render(<SetNewPassword email="test@example.com" />);

    expectElementWithAriaLabelToBeInDocument(snpfl);

    changeElementWithAriaLabelWithInput(snpi, "passwordonedoesnotmatch");

    changeElementWithAriaLabelWithInput(sncpi, "passwordshouldmatch");

    clickElementWithAriaLabel(snpb);

    await waitFor(() => {
        expectElementWithAriaLabelToHaveErrorMessage(ema, "Passwords do not match");
    });
});
test("SetNewPassword.test.tsx Test 5: should display error check password strength when password is less than 7 characters long", async () => {
    render(<SetNewPassword email="test@example.com" />);

    expectElementWithAriaLabelToBeInDocument(snpfl);

    changeElementWithAriaLabelWithInput(snpi, "1234567");

    changeElementWithAriaLabelWithInput(sncpi, "1234567");

    clickElementWithAriaLabel(snpb);

    await waitFor(() => {
        expectElementWithAriaLabelToHaveErrorMessage(ema, "Please verify your password strength");
    });
});
test("SetNewPassword.test.tsx Test 6: should display error check password strength when password is 7 long and has one uppercase letter but not one lowercase letter", async () => {
    render(<SetNewPassword email="test@example.com" />);

    expectElementWithAriaLabelToBeInDocument(snpfl);

    changeElementWithAriaLabelWithInput(snpi, "ABCDEFG");

    changeElementWithAriaLabelWithInput(sncpi, "ABCDEFG");

    clickElementWithAriaLabel(snpb);

    await waitFor(() => {
        expectElementWithAriaLabelToHaveErrorMessage(ema, "Please verify your password strength");
    });
});
test("SetNewPassword.test.tsx Test 7: should display error check password strength when password is 7 long and has one lowercase letter but not one uppercase letter", async () => {
    render(<SetNewPassword email="test@example.com" />);

    expectElementWithAriaLabelToBeInDocument(snpfl);

    changeElementWithAriaLabelWithInput(snpi, "abcdefg");

    changeElementWithAriaLabelWithInput(sncpi, "abcdefg");

    clickElementWithAriaLabel(snpb);

    await waitFor(() => {
        expectElementWithAriaLabelToHaveErrorMessage(ema, "Please verify your password strength");
    });
});
test("SetNewPassword.test.tsx Test 8: should display error check password strength when password is 7 long, has one uppercase, and one lowercase letter but not one number", async () => {
    render(<SetNewPassword email="test@example.com" />);

    expectElementWithAriaLabelToBeInDocument(snpfl);

    changeElementWithAriaLabelWithInput(snpi, "Abcdefg");

    changeElementWithAriaLabelWithInput(sncpi, "Abcdefg");

    clickElementWithAriaLabel(snpb);

    await waitFor(() => {
        expectElementWithAriaLabelToHaveErrorMessage(ema, "Please verify your password strength");
    });
});
test("SetNewPassword.test.tsx Test 9: should display error check password strength when password is 7 long, has one uppercase, one lowercase, and one number but not a special symbol", async () => {
    render(<SetNewPassword email="test@example.com" />);

    expectElementWithAriaLabelToBeInDocument(snpfl);

    changeElementWithAriaLabelWithInput(snpi, "Abcdefg1");

    changeElementWithAriaLabelWithInput(sncpi, "Abcdefg1");

    clickElementWithAriaLabel(snpb);

    await waitFor(() => {
        expectElementWithAriaLabelToHaveErrorMessage(ema, "Please verify your password strength");
    });
});
test("SetNewPassword.test.tsx Test 10: should display error missing email or code when a reset code is present but email is missing, and check password strength is strong because the password is 7 long, has one uppercase, one lowercase, one number, and one special symbol", async () => {
    render(<SetNewPassword email={""} code={"123456"} />);

    expectElementWithAriaLabelToBeInDocument(snpfl);

    changeElementWithAriaLabelWithInput(snpi, "Abcdefg1@");

    changeElementWithAriaLabelWithInput(sncpi, "Abcdefg1@");

    clickElementWithAriaLabel(snpb);

    await waitFor(() => {
        expectElementWithAriaLabelToHaveErrorMessage(ema, "An error occurred: Missing Email or Code");
    });
});
test("SetNewPassword.test.tsx Test 11: should display a session-expired error when no code is provided (first-login flow) and no access token cookie exists", async () => {
    render(<SetNewPassword email={"demostudent5@skillbuilder.edu"} />);

    expectElementWithAriaLabelToBeInDocument(snpfl);

    changeElementWithAriaLabelWithInput(snpi, "Abcdefg1@");

    changeElementWithAriaLabelWithInput(sncpi, "Abcdefg1@");

    clickElementWithAriaLabel(snpb);

    await waitFor(() => {
        expectElementWithAriaLabelToHaveErrorMessage(ema, "Your session has expired. Please log in again.");
    });
});

// Tests 1-11 all cover refusals. The two below cover the other half: a change
// the backend accepts. Both stub the network, because the forgot-password path
// needs a reset code that only reaches the user by email, and the authenticated
// path needs a session this suite has no way to establish.
describe("SetNewPassword success paths", () => {
    const originalFetch = global.fetch;

    const jsonResponse = (body: any) => Promise.resolve({
        ok: true,
        status: 200,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(body)
    });

    afterEach(() => {
        if (originalFetch) { global.fetch = originalFetch; }

        const cookies = new Cookies();

        cookies.remove('access_token');
        cookies.remove('refresh_token');
        cookies.remove('user');
    });

    test("SetNewPassword.test.tsx Test 12: should return to the login form when a reset code is accepted", async () => {
        global.fetch = jest.fn(() => jsonResponse({
            success: true,
            content: { password: ["Successfully set new password for user 1!"] }
        })) as any;

        render(<SetNewPassword email={"demostudent5@skillbuilder.edu"} code={"123456"} />);

        changeElementWithAriaLabelWithInput(snpi, "Abcdefg1@");

        changeElementWithAriaLabelWithInput(sncpi, "Abcdefg1@");

        clickElementWithAriaLabel(snpb);

        await waitFor(() => {
            expectElementWithAriaLabelToBeInDocument("loginForm");
        });

        const requestedUrl = String((global.fetch as jest.Mock).mock.calls[0][0]);

        expect(requestedUrl).toContain("/password");
    });

    test("SetNewPassword.test.tsx Test 13: should store the replacement tokens the backend returns on an authenticated change", async () => {
        const cookies = new Cookies();

        cookies.set('access_token', 'stale_access_token', { sameSite: 'strict' });
        cookies.set('refresh_token', 'stale_refresh_token', { sameSite: 'strict' });
        cookies.set('user', { user_id: 1 }, { sameSite: 'strict' });

        // A successful change renders the logged-in app, which immediately loads
        // its own resources. Those are answered with a plain failure so they stay
        // out of the way of what this test is actually asserting.
        global.fetch = jest.fn((url: any) => {
            if (String(url).includes("/password/change")) {
                return jsonResponse({
                    success: true,
                    content: { password: ["Successfully set new password for user 1!"] },
                    headers: {
                        access_token: "replacement_access_token",
                        refresh_token: "replacement_refresh_token"
                    }
                });
            }

            return jsonResponse({ success: false, message: "not mocked" });
        }) as any;

        render(<SetNewPassword email={"demostudent5@skillbuilder.edu"} />);

        changeElementWithAriaLabelWithInput(snpi, "Abcdefg1@");

        changeElementWithAriaLabelWithInput(sncpi, "Abcdefg1@");

        clickElementWithAriaLabel(snpb);

        // Changing a password retires the caller's own tokens, so the session
        // only survives if the replacements are stored.
        await waitFor(() => {
            expect(cookies.get('access_token')).toBe("replacement_access_token");
        });

        expect(cookies.get('refresh_token')).toBe("replacement_refresh_token");

        const requestedUrl = String((global.fetch as jest.Mock).mock.calls[0][0]);

        expect(requestedUrl).toContain("/password/change");
    });
});