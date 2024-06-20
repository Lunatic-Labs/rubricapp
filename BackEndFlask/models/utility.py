import sys
import yagmail 
import random, string
from models.logger import logger
from controller.Routes.RouteExceptions import EmailFailureException

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

def send_reset_code_email(address: str, code: str): 
    subject = "Skillbuilder - Reset your password"
    message = f'''Your reset code is <b>{code}</b>.
                
                Cheers,
                The Skillbuilder Team'''

    send_email(address, subject, message)

def email_students_feedback_is_ready_to_view(students: list, notification_message : str):
    for student in students:
        subject = "Skillbuilder - Your Feedback is ready to view!"

        message = f'''Greetings {student.first_name} {student.last_name},

                    Your skill development assessment is available to view and act upon. Please log in to SkillBuilder and look in Your Completed Assessments.

                    Message from Professor:
                    {notification_message}

                    Cheers,
                    The Skillbuilder Team
        '''

        send_email(student.email, subject, message)

def send_email(address: str, subject: str,  content: str): 
    try: 
        yag = yagmail.SMTP("skillbuilder02", PASSWORD)
        yag.send(address, subject, content) 
    except:
        raise EmailFailureException

def generate_random_password(length: int): 
    letters = string.ascii_letters + string.digits

    return ''.join(random.choice(letters) for i in range(length))

def error_log(f):
    ''' 
    Custom decorator to automatically log errors and than raise
    them.

    Use as a decorator: @error_log above functions you want to have
    error logging
    '''
    def wrapper(*args, **kwargs):
        try:
            return f(*args, *kwargs)

        except BaseException as e:
            logger.error(f"{e.__traceback__.tb_frame.f_code.co_filename} { e.__traceback__.tb_lineno} Error Type: {type(e).__name__} Message: {e}")
            raise e

    return wrapper