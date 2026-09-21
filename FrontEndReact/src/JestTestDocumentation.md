This document will talk about the implementation and functionality of Jest Tests used for Skillbuilder.

# What to know

Our testing utilities are contained in `testUtilities.ts`

`data-testid` - is an attribute that exists only so tests can find and interact with specific elements.
Tests select elements by `data-testid` rather than `aria-label`: `aria-label` is read aloud by screen
readers, so it should hold a human-readable name (e.g. "Edit course"), not a test hook like `editCourseIconButton`.

When adding a test hook to a component, use a kebab-case `data-testid` (e.g. `data-testid="courses-title"`).
For MUI `Select` components, pass it through `SelectDisplayProps` so it lands on the clickable combobox element.

Here is what the following functions do:

`clickElementWithTestId()` - Finds an element by its `data-testid` and clicks on it.

`clickFirstElementWithTestId()` - Finds all elements with the given `data-testid` and clicks on the first one.

`clickFirstEnabledElementWithTestId()` - Finds all elements with the given `data-testid` and clicks on the first one that is not disabled.

`expectElementWithTestIdToBeInDocument()` - Checks if an element with the given `data-testid` exists on the web page.

`expectEnabledElementWithTestIdToExist()` - Checks that at least one element with the given `data-testid` is not disabled.

`expectElementWithTestIdToHaveErrorMessage()` - Checks if an element with the given `data-testid` contains an
error message matching the provided text.

`changeElementWithTestIdWithInput()` - Enters text into a field identified by its `data-testid`.

`changeElementWithTestIdWithCode()` - Enters a sequence of characters (such as a code) into the multiple
input fields inside the element identified by the `data-testid`.

`selectDropdownOptionWithTestId()` - Opens the dropdown identified by its `data-testid` and picks the option with the given text.

`selectComboBoxMenuItem()` - Opens the combobox with the given accessible name (its visible label) and picks the option with the given text.

# Testing functions we use from React Testing Library

`await waitFor()` is a utility function used from the `@testing-library/react` where the purpose is to wait until the provided function has been successfully completed without throwing an error. It is useful for waiting for asynchronous updates in the user interface, such as elements appearing after an action.

In some of the test files, you will see that you can pass options to `waitFor`, such as `{ timeout: 3000 }`, which sets the maximum time to wait before throwing an error if the condition is not met. In this case, it will wait up to 3000 milliseconds (3 seconds).

# Set up

1. You will need to run Docker for jest tests to work so make sure Docker is running successfully before proceeding to the next step. Otherwise, tests will not be able to run successfully.

2. In the `FrontEndReact` directory, locate the `.env` and change the `VITE_API_URL` port
to 5050. Make sure to change it back to 5000 after you finish running tests/make any
implementation changes.

3. After you have docker running, open up a new terminal and change your directory to `FrontEndReact`

4. Run the following command in the `FrontEndReact` directory:
    `npm test examplefile.test.tsx`

5. The tests should successfully run and display the results of the tests that are ran.

# How the jest tests work.

To get an idea on how jest tests works, I am going to walk through an example.

Here is test 1 for `AdminAddCourse.test.tsx`

```javascript
test("AdminAddCourse.test.tsx Test 1: Should render the AdminAddCourse component given the Add Course button is clicked", async () => {
    render(<Login />);

    changeElementWithTestIdWithInput(ei, "demoadmin02@skillbuilder.edu");

    changeElementWithTestIdWithInput(pi, demoAdminPassword);

    clickElementWithTestId(lb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickElementWithTestId(ac);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(act);
    });
});
```

To see more information on where the variables are declared, refer to `AdminAddCourse.test.tsx`.

Step to step explanation:

`render(<Login />)` - It renders the login component to begin the test.

`changeElementWithTestIdWithInput(ei, "demoadmin02@skillbuilder.edu")` - Enters the provided email into the input field identified by the `data-testid` stored in `ei`.

`changeElementWithTestIdWithInput(pi, demoAdminPassword)` - Enters the admin password into the input field identified by the `data-testid` stored in `pi`.

`clickElementWithTestId(lb)` - Clicks the button identified by the `data-testid` stored in `lb` (Login button).

`expectElementWithTestIdToBeInDocument(ct)` - Waits until the element with `data-testid` stored in `ct` is present on the page, then verifies it exists. (Course Title)

`clickElementWithTestId(ac)` - Clicks the button identified by the `data-testid` stored in `ac` (Add Course button).

`expectElementWithTestIdToBeInDocument(act)` - Waits until the element with `data-testid` stored in `act` is present on the page, then verifies it exists. (Add Course Title)
