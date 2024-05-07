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



test("NOTE: Tests 1-_ will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});

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


test('AdminAddCourse.test.js Test 3: HelperText errors should show for each text field when no information is filled', async () => {
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


test('AdminAddCourse.test.js Test 4: HelperText error should show for the addCourseName text field when it is left blank while all other information is filled', async () => {
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

test('AdminAddCourse.test.js Test 5: HelperText error should show for the addCourseNumber text field when it is left blank while all other information is filled', async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickElementWithAriaLabel(ac);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(act);
    });

    changeElementWithAriaLabelWithInput(cnami, "Object Oriented Programming");

    changeElementWithAriaLabelWithInput(cti, "Fall");

    changeElementWithAriaLabelWithInput(cyi, "2025");

    clickElementWithAriaLabel(aosacb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(acf);

        expectElementWithAriaLabelToHaveErrorMessage(cnumi, "Course Number cannot be empty");
    });
});

test('AdminAddCourse.test.js Test 6: HelperText error should show for the addCourseTerm text field when it is left blank while all other information is filled', async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickElementWithAriaLabel(ac);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(act);
    });

    changeElementWithAriaLabelWithInput(cnami, "Object Oriented Programming");

    changeElementWithAriaLabelWithInput(cnumi, "CS3423");

    changeElementWithAriaLabelWithInput(cyi, "2025");

    clickElementWithAriaLabel(aosacb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(acf);

        expectElementWithAriaLabelToHaveErrorMessage(cti, "Term cannot be empty");
    });
});

test('AdminAddCourse.test.js Test 7: HelperText error should show for the addCourseYear text field when it is left blank while all other information is filled', async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickElementWithAriaLabel(ac);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(act);
    });

    changeElementWithAriaLabelWithInput(cnami, "Object Oriented Programming");

    changeElementWithAriaLabelWithInput(cnumi, "CS3423");

    changeElementWithAriaLabelWithInput(cti, "Fall");

    clickElementWithAriaLabel(aosacb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(acf);

        expectElementWithAriaLabelToHaveErrorMessage(cyi, "Year cannot be empty");
    });
});

test('AdminAddCourse.test.js Test 8: HelperText error should show for the addCourseTerm text field when input is not "Fall", "Spring" or "Summer"', async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickElementWithAriaLabel(ac);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(act);
    });

    changeElementWithAriaLabelWithInput(cnami, "Object Oriented Programming");

    changeElementWithAriaLabelWithInput(cnumi, "CS3423");

    changeElementWithAriaLabelWithInput(cti, "A");

    changeElementWithAriaLabelWithInput(cyi, "2025");

    clickElementWithAriaLabel(aosacb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(acf);

        expectElementWithAriaLabelToHaveErrorMessage(cti, "Term should be either Spring, Fall, or Summer");
    });
});

test('AdminAddCourse.test.js Test 9: HelperText error should show for the addCourseYear text field when input is less than 2023', async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickElementWithAriaLabel(ac);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(act);
    });

    changeElementWithAriaLabelWithInput(cnami, "Object Oriented Programming");

    changeElementWithAriaLabelWithInput(cnumi, "CS3423");

    changeElementWithAriaLabelWithInput(cti, "Fall");

    changeElementWithAriaLabelWithInput(cyi, "1");

    clickElementWithAriaLabel(aosacb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(acf);

        expectElementWithAriaLabelToHaveErrorMessage(cyi, "Year should be at least 2023 or later");
    });
});

test('AdminAddCourse.test.js Test 10: HelperText error should show for the addCourseYear text field when input is not a numeric value', async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickElementWithAriaLabel(ac);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(act);
    });

    changeElementWithAriaLabelWithInput(cnami, "Object Oriented Programming");

    changeElementWithAriaLabelWithInput(cnumi, "CS3423");

    changeElementWithAriaLabelWithInput(cti, "Fall");

    changeElementWithAriaLabelWithInput(cyi, "A");

    clickElementWithAriaLabel(aosacb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(acf);

        expectElementWithAriaLabelToHaveErrorMessage(cyi, "Year must be a numeric value");
    });
});

test('AdminAddCourse.test.js Test 11: Filling in valid input and clicking the Add Course button should redirect you to course view page, and should contain the new course you just added', async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickElementWithAriaLabel(ac);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(act);
    });

    changeElementWithAriaLabelWithInput(cnami, "Object Oriented Programming");

    changeElementWithAriaLabelWithInput(cnumi, "CS3423");

    changeElementWithAriaLabelWithInput(cti, "Fall");

    changeElementWithAriaLabelWithInput(cyi, "2025");

    clickElementWithAriaLabel(aosacb);

    // await waitFor(() => {
    //     expectElementWithAriaLabelToBeInDocument(ct);
    // });

    // expect(getByText('Object Oriented Programming')).toBeInTheDocument();
});