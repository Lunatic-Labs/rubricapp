This document will talk about the implementation and functionality of Jest Tests used for Skillbuilder.

# What to know

Our testing utilities are contained in `testUtilities.js`

`aria-label`  - is an attribute that defines a string value that can be used to name an element,
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


# Set up

1. Make sure Docker is running successfully.

2. In the `FrontEndReact` directory, locate the `.env` and change the `REACT_APP_API_URL` port 
to 5050. Make sure to change it back to 5000 after you finish running tests/make any
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