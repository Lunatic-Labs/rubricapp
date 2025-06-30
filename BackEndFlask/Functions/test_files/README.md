# Testing

> This directory holds all test Pytests for the backend and all the utility functions for them.

## Contents
- 'email_mock.py': Contains the mock objects that get implemented at runtime to allow email functions to run.
- 'email_test_util.py': Contains consts used for email implementations.
- 'test_[]': Any file with that pattern holds the pytests that cover what the name implies.
- 'PopulationFunctions.py': Contains functions to populate the database.

## How to use
Assuming all the dependencies are properly installed, calling the pytests should trigger all tests to run.
To test email functionality, I recommend creating an email test since that is the only place where email functions
run like normal in a local enviroment due to the overrides. *test_018_test_add_user_route* in 'test_emails.py' is
a good example of the near full capacity of all the utility functions. It demonstrates how to call the db instance,
call a route with context, how to use the email constants, and then how to check that the mock objects were 
properly used. 

## Detailed explanation for email tests
- Open *test_018_test_add_user_route* in 'test_emails.py'
- *undecorated_func* is the function that is being called by the route. There are many *_wrapped_* there to remove
the decorator functions that maybe annoying like the token checks.
- Then, a check is run to ensure the db does not have the test user in the db. From this example you can see how
the db instance is being passed around in the pytests.
- The third chunck shows how to call the route and pass it a json.
- The following shows the utility of MockUtil. It is used in many similar ways as assert except the main difference
is that it has a bit more power and more debug potential for pytests.

## NOTES
- Please do not use lower numbers in the function signiture than what the email functions use. Pytests runs tests
in alphabetical order, so the email tests are named like that to ensure that they are the first ones running. It
is prefered that the email tests run first since they are in charge of replacing runtime email objects and 
ensuring that all the email overrides are running as expected.