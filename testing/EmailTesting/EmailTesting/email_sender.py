import smtplib
from email.message import EmailMessage

# Using free gmail server to send emails to dispostable.com

email_address = ""
email_password = ""
marker = "Testing1"
# msg = EmailMessage()
# msg['Subject'] = "This is a test!"
# msg['From'] = email_address
# msg['To'] = "jian-zheng@uiowa.edu"
# msg.set_content("It is due today!!")

# files = ['homework.pdf']
# for file in files:
#     with open(file, 'rb') as f:
#         file_data = f.read()
#         file_name = f.name
#     msg.add_attachment(file_data, maintype='application', subtype='octet-stream', filename=file_name)

with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
    smtp.login(email_address, email_password)
    for i in range(0, 20):
        msg = EmailMessage()
        msg['Subject'] = "{}".format(marker)
        msg['From'] = email_address
        msg['To'] = "rubricapp-a" + str(i) + "@dispostable.com"
        msg.set_content("It is due today!!")
        smtp.send_message(msg)
        print("Sent to "+msg['To']+"\n")