import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../Login.js';



var lf = 'login_form';
var fpb = 'forgot_password_button';
var vrt = 'validate_reset_title';
var vrbb = 'validate_reset_back_button';
var vrcb = 'validate_reset_confirm_button';
var vrf = 'validate_reset_form';
var vrei = 'validate_reset_email_input';
var ecf = 'enter_code_form';
var vcb = 'verify_code_button';
var ema = 'error_message_alert';
var sci = 'send_code_input';


test('ValidateReset.test.js Test 1: should render Login Form component', () => {
    render(<Login />);

    expect(screen.getByLabelText(lf)).toBeInTheDocument();
});

test('ValidateReset.test.js Test 2: Should show Set New Password page when clicking Forgot Password Link.', async () => {
    render(<Login/>);

    fireEvent.click(screen.getByLabelText(fpb));

    await waitFor(() => {
        expect(screen.getByLabelText(vrt)).toBeInTheDocument();
    });
});

test('ValidateReset.test.js Test 3: Should show Login page when clicking Back button.', async () => {
    render(<Login/>);

    fireEvent.click(screen.getByLabelText(fpb));

    await waitFor(() => {
        expect(screen.getByLabelText(vrt)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText(vrbb));

    await waitFor(() => {
        expect(screen.getByLabelText(lf)).toBeInTheDocument();
    });
});

test('ValidateReset.test.js Test 4: Should show email cannot be empty when email is not passed in.', async () => {
    render(<Login/>);

    fireEvent.click(screen.getByLabelText(fpb));

    await waitFor(() => {
        expect(screen.getByLabelText(vrt)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText(vrcb));

    await waitFor(() => {
        expect(screen.getByLabelText(vrf)).toBeInTheDocument();

        expect(screen.getByLabelText(ema).lastChild.innerHTML).toBe("Email cannot be empty.");
    });
});


test('ValidateReset.test.js Test 5: Should show SetNewPassword page when email is invalid.', async () => {
    render(<Login/>);

    fireEvent.click(screen.getByLabelText(fpb));

    fireEvent.change(screen.getByLabelText(vrei).lastChild.firstChild, { target: { value: 'sdfhdshajkfla' } });

    fireEvent.click(screen.getByLabelText(vrcb));

    await waitFor(() => {
        expect(screen.getByLabelText(ecf)).toBeInTheDocument();
    });
});

test('ValidateReset.test.js Test 6: Should show SetNewPassword page when email is valid.', async () => {
    render(<Login/>);

    fireEvent.click(screen.getByLabelText(fpb));

    fireEvent.change(screen.getByLabelText(vrei).lastChild.firstChild, { target: { value: 'demoadmin02@skillbuilder.edu' } });

    fireEvent.click(screen.getByLabelText(vrcb));

    await waitFor(() => {
        expect(screen.getByLabelText(ecf)).toBeInTheDocument();
    });
});


test('ValidateReset.test.js Test 7: Should show make sure your code is correct when no code is entered.', async () => {
    render(<Login/>);

    fireEvent.click(screen.getByLabelText(fpb));

    fireEvent.change(screen.getByLabelText(vrei).lastChild.firstChild, { target: { value: 'sdfhdshajkfla' } });

    fireEvent.click(screen.getByLabelText(vrcb));

    fireEvent.click(screen.getByLabelText(vcb));

    await waitFor(() => {
        expect(screen.getByLabelText(ecf)).toBeInTheDocument();

        expect(screen.getByLabelText(ema).lastChild.innerHTML).toBe("Make sure your code is correct.");
    });
});

test('ValidateReset.test.js Test 8: Should show an error occurred please verify your code when an incorrect code is entered.', async () => {
    render(<Login/>);

    fireEvent.click(screen.getByLabelText(fpb));

    fireEvent.change(screen.getByLabelText(vrei).lastChild.firstChild, { target: { value: 'sdfhdshajkfla' } });

    fireEvent.click(screen.getByLabelText(vrcb));

    let children = screen.getByLabelText(sci).children;

    let length = children.length;
    let code = 'abcdef';

    for(let index = 0; index < length; index++) {
        fireEvent.change(children[index].firstChild.firstChild, { target: { value: code[index] } });
    }

    fireEvent.click(screen.getByLabelText(vcb));

    await waitFor(() => {
        expect(screen.getByLabelText(ecf)).toBeInTheDocument();

        expect(screen.getByLabelText(ema).lastChild.innerHTML).toBe("An error occurred: Please verify your code.");
    });
});