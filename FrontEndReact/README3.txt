#This documentation should help guide you and future developers in the process of testing. This is a compilation of the research we have done and some guidelines you can follow to help fast track development. We've done the best we can to streamline these instructions so that they are easy to follow and more importantly easy to understand.



##our current process and what we need.

-We need to get an understanding of how to install Jest
  --to-do
    -install Jest
    -keep file structure in the "__tests__" folder, the same as "src" folder

-Keep test files seperate from original files but find a way to link the two and explain this in the documentation
  --to-do
    -learn how to make tests that are linked to the original
    -if files are kept seperate from the tests, keep them in the original file structure so it's understood where they should be located in the mirroring component.

-streamline the testing process and include tips so that it can be a simple five minute install and setup anyone else can understand in a README
  --to-do
    -use the navbar.js to get the initial values and states in order to test specific pages.
    -test AdminAddAssesmentTask.js, test the screen by setting the inital values from the navbar and testing to see if AdminAddTask properly displays upon user click.
    -may need the previous .js file to further define, will investigate.