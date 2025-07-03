from deprecated import deprecated

import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from dotenv import load_dotenv
load_dotenv(dotenv_path="sendgrid.env")

@deprecated(reason="This file was just to send the inital data for the turtorial but is good to see how their api works")
def this_should_only_be_used_once():
    message = Mail(
        from_email='avera-espinoza@acm.org',
        to_emails='avera-espinoza@acm.org',
        subject='Sending with Twilio SendGrid is Fun',
        html_content='<strong>and easy to do anywhere, even with Python</strong>')
    try:
        sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
        # sg.set_sendgrid_data_residency("eu")
        # uncomment the above line if you are sending mail using a regional EU subuser
        response = sg.send(message)
        print(response.status_code)
        print(response.body)
        print(response.headers)
    except Exception as e:
        print(e.message)
        with open("ap.txt", "w") as out:
            print(e.message, file=out)
