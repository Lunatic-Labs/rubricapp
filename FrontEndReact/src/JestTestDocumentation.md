This document will talk about the implementation and functionality of Jest Tests used for Skillbuilder.

# What to know

Our testing utilities are contained in `testUtilities.js`

`aria-label` - is an attribute that defines a string value that can be used to name an element,
as long as the element's role does not prohibit naming. It is useful for our tests to find and
interact with specific elements.

Here is what the following functions do:

`clickElementWithAriaLabel()` - Finds an element by its `aria-label` and clicks on it. If multiple elements 
have the same `aria-label`, it only clicks the first one found.

`clickFirstElementWithAriaLabel()` - Finds all elements with the given `aria-label` and clicks on the first one.

`expectElementWithAriaLabelToBeInDocument()` - Checks if an element with the given `aria-label` exists on the web page.

`expectElementWithAriaLabelToHaveErrorMessage()` - Checks if an element with the given `aria-label` contains an 
error message matching the provided text.

`changeElementWithAriaLabelWithInput()` - Enters text into a field identified by its `aria-label`.

`changeElementWithAriaLabelWithCode()` - Enters a sequence of characters (such as a code) into multiple 
input fields identified by the same `aria-label`.

# Testing functions we use from React Testing Library

`await waitFor()` is a utility function used from the `@testing-library/react` where the purpose is to wait until the provided function has been successfully completed without throwing an error. It is useful for waiting for asynchronous updates in the user interface, such as elements appearing after an action.

In some of the test files, you will see that you can pass options to `waitFor`, such as `{ timeout: 3000 }`, which sets the maximum time to wait before throwing an error if the condition is not met. In this case, it will wait up to 3000 milliseconds (3 seconds).

# Set up

1. You will need to run Docker for jest tests to work so make sure Docker is running successfully before proceeding to the next step. Otherwise, tests will not be able to run successfully.

2. In the `FrontEndReact` directory, locate the `.env` and change the `REACT_APP_API_URL` port 
to 5000. Make sure to change it back to 5000 after you finish running tests/make any
implementation changes.

3. After you have docker running, open up a new terminal and change your directory to `FrontEndReact`

4. Run the following command in the `FrontEndReact` directory:
    `npm test examplefile.test.js`

5. The tests should successfully run and display the results of the tests that are ran.

# How the jest tests work.

To get an idea on how jest tests works, I am going to walk through an example.

Here is test 1 for `AdminAddCourse.test.js`

```javascript
test("AdminAddCourse.test.js Test 1: Should render the AdminAddCourse component given the Add Course button is clicked", async () => {
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
```

To see more information on where the variables are declared, refer to `AdminAddCourse.test.js`.

Step to step explanation:

`render(<Login />)` - It renders the login component to begin the test.

`changeElementWithAriaLabelWithInput(ei, "demoadmin02@skillbuilder.edu")` - Enters the provided email into the input field identified by the `aria-label` stored in `ei`.

`changeElementWithAriaLabelWithInput(pi, demoAdminPassword)` - Enters the admin password into the input field identified by the `aria-label` stored in `pi`.

`clickElementWithAriaLabel(lb)` - Clicks the button identified by the `aria-label` stored in `lb` (Login button).

`expectElementWithAriaLabelToBeInDocument(ct)` - Waits until the element with `aria-label` stored in `ct` is present on the page, then verifies it exists. (Course Title)

`clickElementWithAriaLabel(ac)` - Clicks the button identified by the `aria-label` stored in `ac` (Add Course button).

`expectElementWithAriaLabelToBeInDocument(act)` - Waits until the element with `aria-label` stored in `act` is present on the page, then verifies it exists. (Add Course Title)
