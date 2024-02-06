import {
    render,
    screen,
    waitFor,
    fireEvent
} from '@testing-library/react';

import '@testing-library/jest-dom';
import AdminAddCourse from '../AddCourse/AdminAddCourse.js';
import Login from '../Login.js';

import {
    demo_admin_password
} from '../../../App.js';

test('show add course feauture', async () => {
    render(<Login />);
    render(<AdminAddCourse />);
    fireEvent.change(screen.getByLabelText('email_input'), { target: { value: 'demoadmin02@skillbuilder.edu'}});
    fireEvent.change(screen.getByLabelText('password_input'), { target: { value: demo_admin_password}});
    fireEvent.click(screen.getByLabelText('login_button'));

    await waitFor(() => {
        expect(screen.getByLabelText('courses_title')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('addCourseTitle'), { target: { value: 'Add Course'}});
    await waitFor(() => {
        expect(screen.getByLabelText('Add Course')).toBeInTheDocument();
    });
    fireEvent.change(screen.getByLabelText('Course Name'), { target: { value: 'demoadmin02@skillbuilder.edu'}});

});


