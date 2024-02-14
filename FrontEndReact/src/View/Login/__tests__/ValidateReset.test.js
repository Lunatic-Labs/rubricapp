import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../Login.js';






test('ValidateReset.test.js Test 1: should render Login Form component', () => {
    render(<Login />);

    expect(screen.getByLabelText('login_form')).toBeInTheDocument();
});

test('ValidateReset.test.js Test 2: Should show Set New Password page when clicking Forgot Password Link.', async () => {
    render(<Login/>);
    fireEvent.click(screen.getByLabelText('forgot_password_button'));

    await waitFor(() => {
        expect(screen.getByLabelText('validate_reset_title')).toBeInTheDocument();
    });
});

test('ValidateReset.test.js Test 3: Should show Login page when clicking Back button.', async () => {
    render(<Login/>);
    fireEvent.click(screen.getByLabelText('forgot_password_button'));

    await waitFor(() => {
        expect(screen.getByLabelText('validate_reset_title')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText('validate_reset_back_button'));

    await waitFor(() => {
        expect(screen.getByLabelText('login_form')).toBeInTheDocument();
    });
});

test('ValidateReset.test.js Test 4: Should show email cannot be empty when email is not passed in.', async () => {
    render(<Login/>);
    fireEvent.click(screen.getByLabelText('forgot_password_button'));

    await waitFor(() => {
        expect(screen.getByLabelText('validate_reset_title')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText('validate_reset_confirm_button'));

    await waitFor(() => {
        expect(screen.getByLabelText('validate_reset_form')).toBeInTheDocument();

        expect(screen.getByLabelText('validate_reset_email_input').lastChild.textContent).toBe("Email cannot be empty");
    });
});