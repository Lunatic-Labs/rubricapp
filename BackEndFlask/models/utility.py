import yagmail 
import random, string
try: 
    from BackEndFlask.models.hidden import PASSWORD
except:
    print("## need to add models/hidden.py and set PASSWORD before sending emails")

def send_new_user_email(address: str, password: str): 
    subject = "Welcome to Skillbuilder!"
    message = f'''Your password is <b>{password}</b>. You will need to choose a new password after logging in for the first time.
                
                Cheers,
                The Skillbuilder Team'''
    send_email(address, subject, message)

def send_email(address: str, subject: str,  content: str): 
    try: 
        yag = yagmail.SMTP("skillbuilder02", PASSWORD)
        yag.send(address, subject, content) 
    except:
        print("There was an error sending an email! Make sure you have specified the password in Models/hidden.py")

def generate_random_password(length: int): 
    letters = string.ascii_letters + string.digits
    return ''.join(random.choice(letters) for i in range(length))