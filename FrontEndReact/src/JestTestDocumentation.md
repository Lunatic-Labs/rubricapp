This document will talk about the implementation and functionality of Jest Tests used for Skillbuilder.

# What to know

Our testing utilities are contained in `testUtilities.js`

Here is what the following functions do:

`clickElementWithAriaLabel()` - Finds an element by its `aria-label` and clicks on it. If multiple elements 
have the same `aria-label`, it only clicks the first one found.
`clickFirstElementWithAriaLabel()` - Finds all elements with the given `aria-label` and clicks on the first one.
`expectElementWithAriaLabelToBeInDocument()` - Checks if an element with the given `aria-label` exists on the web page.
`expectElementWithAriaLabelToHaveErrorMessage()` - Checks if an element with the given `aria-label` contains an 
error message matching the provided text.
`changeElementWithAriaLabelWithInput()` - Enters text into a field identified by its aria-label
`changeElementWithAriaLabelWithCode()` - Enters a sequence of characters (such as a code) into multiple 
input fields identified by the same `aria-label`.


# Set up

1. Make sure Docker is running successfully.
2. 