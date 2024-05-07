import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../../../../Login/Login.js';

import {
    clickElementWithAriaLabel,
    expectElementWithAriaLabelToBeInDocument,
    changeElementWithAriaLabelWithInput,
    expectElementWithAriaLabelToHaveErrorMessage
} from '../../../../../testUtilities.js';

import {
    demoAdminPassword
} from '../../../../../App.js';



var lb = 'loginButton';
var ei = 'emailInput';
var pi = 'passwordInput';
var ct = 'coursesTitle';
var ac = 'addCourse';
var act = 'addCourseTitle';
var cacb = 'cancelAddCourseButton';
var aosacb = 'addOrSaveAddCourseButton';
var acf = 'addCourseForm';
var cnami = 'courseNameInput';
var cnumi = 'courseNumberInput';
var cti = 'courseTermInput';
var cyi = 'courseYearInput';




test('AdminAddCourse.test.js Test 1: Should render the AdminAddCourse component given the Add Course button is clicked', async () => {
    render(<Login />);

    changeElementWithAriaLabelWithInput(ei, "demoadmin02@skillbuilder.edu");

    changeElementWithAriaLabelWithInput(pi, demoAdminPassword);

    clickElementWithAriaLabel(lb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickElementWithAriaLabel(ac);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(act);
    });

});


test('AdminAddCourse.test.js Test 2: Should render the course table if the cancel button on the Add Course page is clicked', async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickElementWithAriaLabel(ac);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(act);
    });

    clickElementWithAriaLabel(cacb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });
});


test('AdminAddCourse.test.js Test 3: HelperText should show for each text field when no information is filled', async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickElementWithAriaLabel(ac);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(act);
    });

    clickElementWithAriaLabel(aosacb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(acf);

        expectElementWithAriaLabelToHaveErrorMessage(cnami, "Course Name cannot be empty");

        expectElementWithAriaLabelToHaveErrorMessage(cnumi, "Course Number cannot be empty");

        expectElementWithAriaLabelToHaveErrorMessage(cti, "Term cannot be empty");

        expectElementWithAriaLabelToHaveErrorMessage(cyi, "Year cannot be empty");
    });
});


test('AdminAddCourse.test.js Test 4: HelperText should show for the addCourseName text field when it is left blank while all other information is filled', async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickElementWithAriaLabel(ac);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(act);
    });

    changeElementWithAriaLabelWithInput(cnumi, "CS3423");

    changeElementWithAriaLabelWithInput(cti, "Fall");

    changeElementWithAriaLabelWithInput(cyi, "2025");

    clickElementWithAriaLabel(aosacb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(acf);

        expectElementWithAriaLabelToHaveErrorMessage(cnami, "Course Name cannot be empty");
    });
});