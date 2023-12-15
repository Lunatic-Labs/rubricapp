import yagmail 
import random, string
try: 
    from models.hidden import PASSWORD
except:
    print("## need to add models/hidden.py and set PASSWORD before sending emails")

def send_new_user_email(address: str, password: str): 
    subject = "Welcome to Skillbuilder!"
    message = f'''Your password is <b>{password}</b>. You will need to choose a new password after logging in for the first time.
                
                Cheers,
                The Skillbuilder Team'''
    send_email(address, subject, message)

def send_email(address: str, subject: str,  content: str): 
    yag = yagmail.SMTP("skillbuilder02", PASSWORD)
    yag.send(address, subject, content)

def generate_random_password(length: int): 
    letters = string.ascii_letters + string.digits
    return ''.join(random.choice(letters) for i in range(length))