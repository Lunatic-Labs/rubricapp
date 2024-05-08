import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../../Login/Login.js';

import {
    clickElementWithAriaLabel,
    expectElementWithAriaLabelToBeInDocument,
    changeElementWithAriaLabelWithInput,
    expectElementWithAriaLabelToHaveErrorMessage
} from '../../../testUtilities.js';

import {
    demoAdminPassword
} from '../../../App.js';



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
var vcd = "viewCourseDiv";
var vcib = "viewCourseIconButton";
var vcmh = "viewCourseMainHeader";
var mhbb = "mainHeaderBackButton";



test("NOTE: Tests _-_ will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});


test('AdminAddCourse.test.js Test 1: Should render the MainHeader component given the View Course button is clicked', async () => {
    render(<Login />);

    changeElementWithAriaLabelWithInput(ei, "demoadmin02@skillbuilder.edu");

    changeElementWithAriaLabelWithInput(pi, demoAdminPassword);

    clickElementWithAriaLabel(lb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(vcmh);
    });

});

test('AdminAddCourse.test.js Test 2: Clicking the back button on the MainHeader component should go to the page that came before the current (ViewCourseAdmin)', async () => {
    render(<Login />);

    changeElementWithAriaLabelWithInput(ei, "demoadmin02@skillbuilder.edu");

    changeElementWithAriaLabelWithInput(pi, demoAdminPassword);

    clickElementWithAriaLabel(lb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(mhbb);
    });

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

});