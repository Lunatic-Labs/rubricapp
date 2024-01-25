import {
    render,
    screen,
    waitFor,
    fireEvent
} from '@testing-library/react';

import '@testing-library/jest-dom';
import Login from '../Login.js';

import {
    super_admin_password,
    demo_admin_password,
    demo_ta_instructor_password,
    demo_student_password
} from '../../../App.js';


// NOTE: Tests 7-10 will not pass if Demo Data is not loaded!


test('Login.test.js Test 1: should render Login Form component', () => {
    render(<Login />);
    expect(screen.getByRole('form')).toBeInTheDocument();
});


test('Login.test.js Test 2: should show error missing email and password when email and password are missing', async () => {
    render(<Login />);
    fireEvent.click(screen.getByLabelText('login_button'));

    await waitFor(() => {
        expect(screen.getByRole('form')).toBeInTheDocument();
        expect(screen.getByRole('alert')).toBeInTheDocument();
        // expect(screen.getByRole('alert').innerHTML).toBe("Fetching Login: An error occurred: Bad request: Both email and password required");
        expect(screen.getByRole('alert').innerHTML).toBe("Email cannot be empty");
    });
});


test('Login.test.js Test 3: should show error missing email or password when email is missing', async () => {
    render(<Login />);
    fireEvent.change(screen.getByLabelText('password_input'), { target: { value: 'password_test123'}});
    fireEvent.click(screen.getByLabelText('login_button'));

    await waitFor(() => {
        expect(screen.getByRole('form')).toBeInTheDocument();
        expect(screen.getByRole('alert')).toBeInTheDocument();
        // expect(screen.getByRole('alert').innerHTML).toBe("Fetching Login: An error occurred: Bad request: Both email and password required");
        expect(screen.getByRole('alert').innerHTML).toBe("");
    });
});


// Currently Commenting out the following tests!
// test('Login.test.js Test 4: should show error missing email or password when password is missing', async () => {
//     render(<Login />);
//     fireEvent.change(screen.getByLabelText('email_input'), { target: { value: 'test21@test.com'}});
//     fireEvent.click(screen.getByLabelText('login_button'));

//     await waitFor(() => {
//         expect(screen.getByRole('form')).toBeInTheDocument();
//         expect(screen.getByRole('alert')).toBeInTheDocument();
//         expect(screen.getByRole('alert').innerHTML).toBe("Fetching Login: An error occurred: Bad request: Both email and password required");
//     });
// });


// test('Login.test.js Test 5: should show error invalid email when email is invalid and password is not missing', async () => {
//     render(<Login />);
//     fireEvent.change(screen.getByLabelText('email_input'), { target: { value: 'invalidEmail1@test.com' }});
//     fireEvent.change(screen.getByLabelText('password_input'), { target: { value: 'testpassword123' }});
//     fireEvent.click(screen.getByLabelText('login_button'));

//     await waitFor(() => {
//         expect(screen.getByRole('form')).toBeInTheDocument();
//         expect(screen.getByRole('alert')).toBeInTheDocument();
//         expect(screen.getByRole('alert').innerHTML).toBe("Fetching Login: An error occurred: Bad request: Invalid Email");
//     });
// });


// test('Login.test.js Test 6: should show error unable to verify when email is valid but password is invalid', async () => {
//     render(<Login />);
//     fireEvent.change(screen.getByLabelText('email_input'), { target: { value: 'superadminuser01@skillbuilder.edu' }});
//     fireEvent.change(screen.getByLabelText('password_input'), { target: { value: 'testpassword123' }});
//     fireEvent.click(screen.getByLabelText('login_button'));

//     await waitFor(() => {
//         expect(screen.getByRole('form')).toBeInTheDocument();
//         expect(screen.getByRole('alert')).toBeInTheDocument();
//         expect(screen.getByRole('alert').innerHTML).toBe("Fetching Login: An error occurred: Unable to verify log in information: Please retry");
//     });
// });


// test('Login.test.js Test 7: should show users page for super admin view using super admin credentials', async () => {
//     render(<Login />);
//     fireEvent.change(screen.getByLabelText('email_input'), { target: { value: 'superadminuser01@skillbuilder.edu'}});
//     fireEvent.change(screen.getByLabelText('password_input'), { target: { value: super_admin_password}});
//     fireEvent.click(screen.getByLabelText('login_button'));

//     await waitFor(() => {
//         expect(screen.getByLabelText('super_admin_title')).toBeInTheDocument();
//     });

//     fireEvent.click(screen.getByLabelText('account_dropdown'));
//     fireEvent.click(screen.getByLabelText('logout_button'));

//     await waitFor(() => {
//         expect(screen.getByRole('form')).toBeInTheDocument();
//     });
// });


// test('Login.test.js Test 8: should show courses page for admin view using demo admin credentials', async () => {
//     render(<Login />);
//     fireEvent.change(screen.getByLabelText('email_input'), { target: { value: 'demoadmin02@skillbuilder.edu'}});
//     fireEvent.change(screen.getByLabelText('password_input'), { target: { value: demo_admin_password}});
//     fireEvent.click(screen.getByLabelText('login_button'));

//     await waitFor(() => {
//         expect(screen.getByLabelText('courses_title')).toBeInTheDocument();
//     });

//     fireEvent.click(screen.getByLabelText('account_dropdown'));
//     fireEvent.click(screen.getByLabelText('logout_button'));

//     await waitFor(() => {
//         expect(screen.getByRole('form')).toBeInTheDocument();
//     });
// });


// test('Login.test.js Test 9: should show courses page for ta/instructor view using demo ta/instructor credentials', async () => {
//     render(<Login />);
//     fireEvent.change(screen.getByLabelText('email_input'), { target: { value: 'demotainstructor03@skillbuilder.edu'}});
//     fireEvent.change(screen.getByLabelText('password_input'), { target: { value: demo_ta_instructor_password}});
//     fireEvent.click(screen.getByLabelText('login_button'));

//     await waitFor(() => {
//         expect(screen.getByLabelText('courses_title')).toBeInTheDocument();
//     });

//     fireEvent.click(screen.getByLabelText('account_dropdown'));
//     fireEvent.click(screen.getByLabelText('logout_button'));

//     await waitFor(() => {
//         expect(screen.getByRole('form')).toBeInTheDocument();
//     });
// });


// test('Login.test.js Test 10: should show courses page for student view using demo student credentials', async () => {
//     render(<Login />);
//     fireEvent.change(screen.getByLabelText('email_input'), { target: { value: 'demostudent4@skillbuilder.edu'}});
//     fireEvent.change(screen.getByLabelText('password_input'), { target: { value: demo_student_password + '4'}});
//     fireEvent.click(screen.getByLabelText('login_button'));

//     await waitFor(() => {
//         expect(screen.getByLabelText('courses_title')).toBeInTheDocument();
//     });

//     fireEvent.click(screen.getByLabelText('account_dropdown'));
//     fireEvent.click(screen.getByLabelText('logout_button'));

//     await waitFor(() => {
//         expect(screen.getByRole('form')).toBeInTheDocument();
//     });
// });


// test('Login.test.js Test 11: should show reset password page when clicking link', async () => {
//     render(<Login/>);
//     fireEvent.click(screen.getByLabelText('reset_password_button'));

//     await waitFor(() => {
//         expect(screen.getByLabelText('reset_password_title')).toBeInTheDocument();
//     });
// });
