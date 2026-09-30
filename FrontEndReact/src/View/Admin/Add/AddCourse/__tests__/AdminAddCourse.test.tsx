import { test, expect } from "@jest/globals";
import { render, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "../../../../Login/Login";

import {
    clickElementWithTestId,
    expectElementWithTestIdToBeInDocument,
    changeElementWithTestIdWithInput,
    expectElementWithTestIdToHaveErrorMessage,
    selectComboBoxMenuItem
} from "../../../../../testUtilities";


var lb = "login-submit-button";
var ei = "login-email-input";
var pi = "login-password-input";
var ct = "courses-title";
var ac = "add-course";
var act = "add-course-title";
var cacb = "cancel-add-course-button";
var aosacb = "add-or-save-add-course-button";
var acf = "add-course-form";
var cnami = "course-name-input";
var cnumi = "course-number-input";
var cti = "course-term-input";
var cyi = "course-year-input";
var vcd = "view-course-div";
var ctzd = "Time Zone";
test("NOTE: Tests 1-11 will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});
test("AdminAddCourse.test.tsx Test 1: Should render the AdminAddCourse component given the Add Course button is clicked", async () => {
    render(<Login />);

    changeElementWithTestIdWithInput(ei, "demoadmin02@skillbuilder.edu");

    changeElementWithTestIdWithInput(pi, globalThis.DEMO_ADMIN_PASSWORD);

    clickElementWithTestId(lb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickElementWithTestId(ac);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(act);
    });
});
test("AdminAddCourse.test.tsx Test 2: Should render the course table if the cancel button on the Add Course page is clicked", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickElementWithTestId(ac);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(act);
    });

    clickElementWithTestId(cacb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });
});
test("AdminAddCourse.test.tsx Test 3: HelperText errors should show for each text field when no information is filled", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickElementWithTestId(ac);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(act);
    });

    clickElementWithTestId(aosacb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(acf);

        expectElementWithTestIdToHaveErrorMessage(cnami, "Course Name cannot be empty");

        expectElementWithTestIdToHaveErrorMessage(cnumi, "Course Number cannot be empty");

        expectElementWithTestIdToHaveErrorMessage(cti, "Term cannot be empty");

        expectElementWithTestIdToHaveErrorMessage(cyi, "Year cannot be empty");
    });
});
test("AdminAddCourse.test.tsx Test 4: HelperText error should show for the addCourseName text field when it is left blank while all other information is filled", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickElementWithTestId(ac);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(act);
    });

    changeElementWithTestIdWithInput(cnumi, "CS3423");

    changeElementWithTestIdWithInput(cti, "Fall");

    changeElementWithTestIdWithInput(cyi, "2025");

    clickElementWithTestId(aosacb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(acf);

        expectElementWithTestIdToHaveErrorMessage(cnami, "Course Name cannot be empty");
    });
});
test("AdminAddCourse.test.tsx Test 5: HelperText error should show for the addCourseNumber text field when it is left blank while all other information is filled", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickElementWithTestId(ac);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(act);
    });

    changeElementWithTestIdWithInput(cnami, "Object Oriented Programming");

    changeElementWithTestIdWithInput(cti, "Fall");

    changeElementWithTestIdWithInput(cyi, "2025");

    clickElementWithTestId(aosacb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(acf);

        expectElementWithTestIdToHaveErrorMessage(cnumi, "Course Number cannot be empty");
    });
});
test("AdminAddCourse.test.tsx Test 6: HelperText error should show for the addCourseTerm text field when it is left blank while all other information is filled", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickElementWithTestId(ac);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(act);
    });

    changeElementWithTestIdWithInput(cnami, "Object Oriented Programming");

    changeElementWithTestIdWithInput(cnumi, "CS3423");

    changeElementWithTestIdWithInput(cyi, "2025");

    clickElementWithTestId(aosacb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(acf);

        expectElementWithTestIdToHaveErrorMessage(cti, "Term cannot be empty");
    });
});
test("AdminAddCourse.test.tsx Test 7: HelperText error should show for the addCourseYear text field when it is left blank while all other information is filled", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickElementWithTestId(ac);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(act);
    });

    changeElementWithTestIdWithInput(cnami, "Object Oriented Programming");

    changeElementWithTestIdWithInput(cnumi, "CS3423");

    changeElementWithTestIdWithInput(cti, "Fall");

    clickElementWithTestId(aosacb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(acf);

        expectElementWithTestIdToHaveErrorMessage(cyi, "Year cannot be empty");
    });
});
test("AdminAddCourse.test.tsx Test 8: HelperText error should show for the addCourseYear text field when input is less than 2023", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickElementWithTestId(ac);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(act);
    });

    changeElementWithTestIdWithInput(cnami, "Object Oriented Programming");

    changeElementWithTestIdWithInput(cnumi, "CS3423");

    changeElementWithTestIdWithInput(cti, "Fall");

    changeElementWithTestIdWithInput(cyi, "1");

    clickElementWithTestId(aosacb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(acf);

        expectElementWithTestIdToHaveErrorMessage(cyi, "Year should be at least 2023 or later");
    });
});
test("AdminAddCourse.test.tsx Test 9: HelperText error should show for the addCourseYear text field when input is not a numeric value", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickElementWithTestId(ac);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(act);
    });

    changeElementWithTestIdWithInput(cnami, "Object Oriented Programming");

    changeElementWithTestIdWithInput(cnumi, "CS3423");

    changeElementWithTestIdWithInput(cti, "Fall");

    changeElementWithTestIdWithInput(cyi, "A");

    clickElementWithTestId(aosacb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(acf);

        expectElementWithTestIdToHaveErrorMessage(cyi, "Year must be a numeric value");
    });
});
test("AdminAddCourse.test.tsx Test 10: Filling in valid input and clicking the Add Course button should redirect you to course view page, and should contain the new course you just added", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickElementWithTestId(ac);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(act);
    });

    // The backend has no course-delete endpoint, so this test can't clean up
    // after itself; a unique name per run keeps repeat runs from colliding
    // with a course an earlier run already created.
    var courseName = `Comparative Programming Languages ${Date.now()}`;

    changeElementWithTestIdWithInput(cnami, courseName);

    changeElementWithTestIdWithInput(cnumi, "CS3713");

    changeElementWithTestIdWithInput(cti, "Fall");

    changeElementWithTestIdWithInput(cyi, "2024");

    await selectComboBoxMenuItem(ctzd, "Central Time");

    clickElementWithTestId(aosacb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    },{ timeout: 3000 });

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(vcd);
    });

    await waitFor(() => {
        expect(screen.getByText(courseName)).toBeInTheDocument();
    });
});
test("AdminAddCourse.test.tsx Test 11: HelperText errors should show for the addCourseYear text field when the input year is not numeric", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickElementWithTestId(ac);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(act);
    });

    changeElementWithTestIdWithInput(cnami, "Object Oriented Programming");

    changeElementWithTestIdWithInput(cnumi, "CS3423");

    changeElementWithTestIdWithInput(cti, "A");

    changeElementWithTestIdWithInput(cyi, "A");

    clickElementWithTestId(aosacb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(acf);

        expectElementWithTestIdToHaveErrorMessage(cyi, "Year must be a numeric value");
    });
});