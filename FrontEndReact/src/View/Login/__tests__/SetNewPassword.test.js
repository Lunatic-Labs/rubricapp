import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SetNewPassword from '../SetNewPassword.js';



var snpfl = 'setNewPasswordFormLabel';
var snpb = 'setNewPasswordButton';
var ema = 'errorMessageAlert';
var snpi = 'setNewPasswordInput';
var sncpi = 'setNewPasswordConfirmInput';
var lf = 'loginForm';


test("NOTE: Test 11 will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});


test('SetNewPassword.test.js Test 1: should render SetNewPassword Form component', () => {
    render(<SetNewPassword />);

    expect(screen.getByLabelText(snpfl)).toBeInTheDocument();
});


test('SetNewPassword.test.js Test 2: should display error password cannot be empty when no password or confirm password are entered', async () => {
    render(<SetNewPassword />);

    expect(screen.getByLabelText(snpfl)).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText(snpb));

    await waitFor(() => {
        expect(screen.getByLabelText(ema).lastChild.innerHTML).toBe("Password cannot be empty");
    });
});


test('SetNewPassword.test.js Test 3: should display error confirm password cannot be empty when password is filled but not confirm password', async () => {
    render(<SetNewPassword />);

    expect(screen.getByLabelText(snpfl)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(snpi).lastChild.firstChild, { target: { value: 'sdfhdshajkfla' } });

    fireEvent.click(screen.getByLabelText(snpb));

    await waitFor(() => {
        expect(screen.getByLabelText(ema).lastChild.innerHTML).toBe("Confirm Password cannot be empty");
    })
});


test('SetNewPassword.test.js Test 4: should display error passwords to not match', async () => {
    render(<SetNewPassword />);

    expect(screen.getByLabelText(snpfl)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(snpi).lastChild.firstChild, { target: { value: 'passwordonedoesnotmatch' } });

    fireEvent.change(screen.getByLabelText(sncpi).lastChild.firstChild, { target: { value: 'passwordshouldmatch' } });

    fireEvent.click(screen.getByLabelText(snpb));

    await waitFor(() => {
        expect(screen.getByLabelText(ema).lastChild.innerHTML).toBe("Passwords do not match");
    });
});


test('SetNewPassword.test.js Test 5: should display error check password strength when password is less than 7 characters long', async () => {
    render(<SetNewPassword />);

    expect(screen.getByLabelText(snpfl)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(snpi).lastChild.firstChild, { target: { value: '1234567' } });

    fireEvent.change(screen.getByLabelText(sncpi).lastChild.firstChild, { target: { value: '1234567' } });

    fireEvent.click(screen.getByLabelText(snpb));

    await waitFor(() => {
        expect(screen.getByLabelText(ema).lastChild.innerHTML).toBe("Please verify your password strength");
    });
});


test('SetNewPassword.test.js Test 6: should display error check password strength when password is 7 long and has one uppercase letter but not one lowercase letter', async () => {
    render(<SetNewPassword />);

    expect(screen.getByLabelText(snpfl)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(snpi).lastChild.firstChild, { target: { value: 'ABCDEFG' } });

    fireEvent.change(screen.getByLabelText(sncpi).lastChild.firstChild, { target: { value: 'ABCDEFG' } });

    fireEvent.click(screen.getByLabelText(snpb));

    await waitFor(() => {
        expect(screen.getByLabelText(ema).lastChild.innerHTML).toBe("Please verify your password strength");
    });
});


test('SetNewPassword.test.js Test 7: should display error check password strength when password is 7 long and has one lowercase letter but not one uppercase letter', async () => {
    render(<SetNewPassword />);

    expect(screen.getByLabelText(snpfl)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(snpi).lastChild.firstChild, { target: { value: 'abcdefg' } });

    fireEvent.change(screen.getByLabelText(sncpi).lastChild.firstChild, { target: { value: 'abcdefg' } });

    fireEvent.click(screen.getByLabelText(snpb));

    await waitFor(() => {
        expect(screen.getByLabelText(ema).lastChild.innerHTML).toBe("Please verify your password strength");
    });
});


test('SetNewPassword.test.js Test 8: should display error check password strength when password is 7 long, has one uppercase, and one lowercase letter but not one number', async () => {
    render(<SetNewPassword />);

    expect(screen.getByLabelText(snpfl)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(snpi).lastChild.firstChild, { target: { value: 'Abcdefg' } });

    fireEvent.change(screen.getByLabelText(sncpi).lastChild.firstChild, { target: { value: 'Abcdefg' } });

    fireEvent.click(screen.getByLabelText(snpb));

    await waitFor(() => {
        expect(screen.getByLabelText(ema).lastChild.innerHTML).toBe("Please verify your password strength");
    });
});


test('SetNewPassword.test.js Test 9: should display error check password strength when password is 7 long, has one uppercase, one lowercase, and one number but not a special symbol', async () => {
    render(<SetNewPassword />);

    expect(screen.getByLabelText(snpfl)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(snpi).lastChild.firstChild, { target: { value: 'Abcdefg1' } });

    fireEvent.change(screen.getByLabelText(sncpi).lastChild.firstChild, { target: { value: 'Abcdefg1' } });

    fireEvent.click(screen.getByLabelText(snpb));

    await waitFor(() => {
        expect(screen.getByLabelText(ema).lastChild.innerHTML).toBe("Please verify your password strength");
    });
});


test('SetNewPassword.test.js Test 10: should display error missing email or password when email is missing but check password strength is strong because the password is 7 long, has one uppercase, one lowercase, one number, and one special symbol', async () => {
    render(<SetNewPassword email={""} />);

    expect(screen.getByLabelText(snpfl)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(snpi).lastChild.firstChild, { target: { value: 'Abcdefg1@' } });

    fireEvent.change(screen.getByLabelText(sncpi).lastChild.firstChild, { target: { value: 'Abcdefg1@' } });

    fireEvent.click(screen.getByLabelText(snpb));

    await waitFor(() => {
        expect(screen.getByLabelText(ema).lastChild.innerHTML).toBe("An error occurred: Missing Email or Password");
    });
});


test('SetNewPassword.test.js Test 11: should display login page when email is valid and check password strength is strong because the password is 7 long, has one uppercase, one lowercase, one number, and one special symbol', async () => {
    render(<SetNewPassword email={"demostudent5@skillbuilder.edu"} />);

    expect(screen.getByLabelText(snpfl)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(snpi).lastChild.firstChild, { target: { value: 'Abcdefg1@' } });

    fireEvent.change(screen.getByLabelText(sncpi).lastChild.firstChild, { target: { value: 'Abcdefg1@' } });

    fireEvent.click(screen.getByLabelText(snpb));

    await waitFor(() => {
        expect(screen.getByLabelText(lf)).toBeInTheDocument();
    });
});