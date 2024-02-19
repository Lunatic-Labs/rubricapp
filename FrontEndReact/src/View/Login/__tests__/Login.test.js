import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../Login.js';

import {
    superAdminPassword,
    demoAdminPassword,
    demoTaInstructorPassword,
    demoStudentPassword
} from '../../../App.js';






test("NOTE: Tests 7-10 will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});

test('Login.test.js Test 1: should render Login Form component', () => {
    render(<Login />);

    expect(screen.getByLabelText('login_form')).toBeInTheDocument();
});


test('Login.test.js Test 2: HelperText should show Email cannot be empty with Email and Password not filled.', async () => {
    render(<Login />);
    fireEvent.click(screen.getByLabelText('loginButton'));

    await waitFor(() => {
        expect(screen.getByLabelText('login_form')).toBeInTheDocument();

        expect(screen.getByLabelText('emailInput').lastChild.innerHTML).toBe("Email cannot be empty");
    });
});


test('Login.test.js Test 3: HelperText should show Email cannot be empty with Password filled, but not Email.', async () => {
    render(<Login />);

    fireEvent.change(screen.getByLabelText('passwordInput').lastChild.firstChild, { target: { value: 'passwordTest123'}});

    fireEvent.click(screen.getByLabelText('loginButton'));

    await waitFor(() => {
        expect(screen.getByLabelText('login_form')).toBeInTheDocument();

        expect(screen.getByLabelText('emailInput').lastChild.innerHTML).toBe("Email cannot be empty");
    });
});


test('Login.test.js Test 4: HelperText should show Password cannot be empty with Email filled, but not Password.', async () => {
    render(<Login />);
    fireEvent.change(screen.getByLabelText('emailInput').lastChild.firstChild, { target: { value: 'test21@test.com'}});

    fireEvent.click(screen.getByLabelText('loginButton'));

    await waitFor(() => {
        expect(screen.getByLabelText('login_form')).toBeInTheDocument();

        expect(screen.getByLabelText('passwordInput').lastChild.innerHTML).toBe("Password cannot be empty");
    });
});


test('Login.test.js Test 5: Error Message Component show error invalid credentials when email is invalid and password is not missing.', async () => {
    render(<Login />);
    fireEvent.change(screen.getByLabelText('emailInput').lastChild.firstChild, { target: { value: 'invalidEmail1@test.com' }});

    fireEvent.change(screen.getByLabelText('passwordInput').lastChild.firstChild, { target: { value: 'testpassword123' }});

    fireEvent.click(screen.getByLabelText('loginButton'));

    await waitFor(() => {
        expect(screen.getByLabelText('login_form')).toBeInTheDocument();

        expect(screen.getByLabelText('errorMessageAlert')).toBeInTheDocument();

        expect(screen.getByLabelText('errorMessageAlert').lastChild.innerHTML).toBe("An error occurred: Invalid Credentials");
    });
});


test('Login.test.js Test 6: Error Message Component should show error unable to verify when email is valid but password is invalid.', async () => {
    render(<Login />);

    fireEvent.change(screen.getByLabelText('emailInput').lastChild.firstChild, { target: { value: 'superadminuser01@skillbuilder.edu' }});

    fireEvent.change(screen.getByLabelText('passwordInput').lastChild.firstChild, { target: { value: 'testpassword123' }});

    fireEvent.click(screen.getByLabelText('loginButton'));

    await waitFor(() => {
        expect(screen.getByLabelText('login_form')).toBeInTheDocument();

        expect(screen.getByLabelText('errorMessageAlert')).toBeInTheDocument();

        expect(screen.getByLabelText('errorMessageAlert').lastChild.innerHTML).toBe("An error occurred: Unable to verify log in information: Please retry");
    });
});


test('Login.test.js Test 7: Should show users page for super admin view using super admin credentials', async () => {
    render(<Login />);
    fireEvent.change(screen.getByLabelText('emailInput').lastChild.firstChild, { target: { value: 'superadminuser01@skillbuilder.edu'}});

    fireEvent.change(screen.getByLabelText('passwordInput').lastChild.firstChild, { target: { value: superAdminPassword}});

    fireEvent.click(screen.getByLabelText('loginButton'));

    await waitFor(() => {
        expect(screen.getByLabelText('superAdminTitle')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText('accountDropdown'));

    fireEvent.click(screen.getByLabelText('logoutButton'));

    await waitFor(() => {
        expect(screen.getByLabelText('login_form')).toBeInTheDocument();
    });
});


test('Login.test.js Test 8: Should show courses page for admin view using demo admin credentials', async () => {
    render(<Login />);
    fireEvent.change(screen.getByLabelText('emailInput').lastChild.firstChild, { target: { value: 'demoadmin02@skillbuilder.edu'}});

    fireEvent.change(screen.getByLabelText('passwordInput').lastChild.firstChild, { target: { value: demoAdminPassword}});

    fireEvent.click(screen.getByLabelText('loginButton'));

    await waitFor(() => {
        expect(screen.getByLabelText('coursesTitle')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText('accountDropdown'));

    fireEvent.click(screen.getByLabelText('logoutButton'));

    await waitFor(() => {
        expect(screen.getByLabelText('login_form')).toBeInTheDocument();
    });
});


test('Login.test.js Test 9: Should show courses page for ta/instructor view using demo ta/instructor credentials', async () => {
    render(<Login />);
    fireEvent.change(screen.getByLabelText('emailInput').lastChild.firstChild, { target: { value: 'demotainstructor03@skillbuilder.edu'}});

    fireEvent.change(screen.getByLabelText('passwordInput').lastChild.firstChild, { target: { value: demoTaInstructorPassword}});

    fireEvent.click(screen.getByLabelText('loginButton'));

    await waitFor(() => {
        expect(screen.getByLabelText('coursesTitle')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText('accountDropdown'));

    fireEvent.click(screen.getByLabelText('logoutButton'));

    await waitFor(() => {
        expect(screen.getByLabelText('login_form')).toBeInTheDocument();
    });
});


test('Login.test.js Test 10: Should show courses page for student view using demo student credentials', async () => {
    render(<Login />);
    fireEvent.change(screen.getByLabelText('emailInput').lastChild.firstChild, { target: { value: 'demostudent4@skillbuilder.edu'}});

    fireEvent.change(screen.getByLabelText('passwordInput').lastChild.firstChild, { target: { value: demoStudentPassword + '4'}});

    fireEvent.click(screen.getByLabelText('loginButton'));

    await waitFor(() => {
        expect(screen.getByLabelText('coursesTitle')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText('accountDropdown'));

    fireEvent.click(screen.getByLabelText('logoutButton'));

    await waitFor(() => {
        expect(screen.getByLabelText('login_form')).toBeInTheDocument();
    });
});


test('Login.test.js Test 11: Should show Set New Password page when clicking Forgot Password Link.', async () => {
    render(<Login/>);
    fireEvent.click(screen.getByLabelText('forgotPasswordButton'));

    await waitFor(() => {
        expect(screen.getByLabelText('validateResetTitle')).toBeInTheDocument();
    });
});
