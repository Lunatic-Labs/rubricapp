Below are the instructions for how to get OAuth2 working on the AWS instance using Gmail's API.

* Note: This requires a machine with a web browser and Python3.

# Preliminary

This involves two steps, the first is getting a refresh token on your local
machine, the second is uploading it to the server.

# Dependences

## Python Specific

First the requirements:
1. google-auth
2. google-auth-oauthlib
3. google-auth-httplib2
4. google-api-python-client

These dependences are needed on both local and the server.

## Google Cloud Console

A google cloud console project must be set up of type _web client_.

Visit the following: https://console.cloud.google.com/welcome

If needed, create a new project with an appropriate name.
Once this is done, click "API and Services", then "OAuth Consent Screen".
Select the _User Type_ to be _External_. Fill out all the boxes that it
requires. You can skip the _Scopes_ section. For _Test Users_, put all
emails of users that you know will be testing with it.

Navigate to _Credentials_ and click "CREATE CREDENTIALS" and OAuth Client ID.
Under application type, click _Web application_ then give it an appropriate name.
Then, in _Authorized redirect URIs_, add the URL of the website you are planning
on using this on i.e., https://skill-builder.net, as well as http://localhost:8080/
for generating the token on your local computer.

Finally, download the JSON OAuth client and save it as `credentials.json`.

# Generating the Refresh Token

After installing the required dependences (don't forget to source the virtual
environment if using one), move `credentials.json` to your CWD and evaluate the following Python code:

```py
import os

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow

def get_gmail_credentials():
    SCOPES = [
        "https://www.googleapis.com/auth/gmail.compose",
        "https://www.googleapis.com/auth/gmail.readonly",
    ]

    creds = None
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=8080, access_type='offline', prompt='consent')
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
    return creds
```

This should open a web browser where it will prompt you to log in.
Once this is done, a file called `token.json` will now be created
in your CWD.

# Transfering the Token to the Server

There are many different ways of transfering a file, but this is
what I currently use:

```bash
scp -i <path/to/pem/file> ./token.json <server@IP:/home/ubuntu>
```

SSH into the server and put the token somewhere safe *(DO NOT put it
in the repo and version control it)*.
