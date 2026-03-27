from core import app, db
from models.user import update_password
from models.user import User
from sqlalchemy  import select
import secrets
import string

def rand_password() -> string:
    PASSWORD_LENGTH = 35
    choices = string.ascii_letters + string.digits
    password = "".join(secrets.choice(choices) for i in range(PASSWORD_LENGTH))
    return password

def save_demo_user_email_password(email: string, password:string) -> None:
    with open("NewDemoUserPasswords.txt", 'a') as out:
        print(f"{email} = {password}", file=out)
    

def change_demo_passwords() -> None:
    demo_user_emails = [
        'demoadmin02@skillbuilder.edu', 'demostudent10@skillbuilder.edu', 
        'demostudent11@skillbuilder.edu', 'demostudent12@skillbuilder.edu', 
        'demostudent13@skillbuilder.edu', 'demostudent4@skillbuilder.edu', 
        'demostudent5@skillbuilder.edu', 'demostudent6@skillbuilder.edu', 
        'demostudent7@skillbuilder.edu', 'demostudent8@skillbuilder.edu', 
        'demostudent9@skillbuilder.edu', 'demotainstructor03@skillbuilder.edu', 
        'superadminuser01@skillbuilder.edu', 'testadmin01@skillbuilder.edu', 
        'testadmin02@skillbuilder.edu', 'testadmin03@skillbuilder.edu', 
        'testadmin04@skillbuilder.edu', 'testadmin05@skillbuilder.edu', 
        'testadmin06@skillbuilder.edu', 'testadmin07@skillbuilder.edu', 
        'testadmin08@skillbuilder.edu', 'testadmin09@skillbuilder.edu', 
        'testadmin10@skillbuilder.edu', 'testadmin11@skillbuilder.edu', 
        'testadmin12@skillbuilder.edu', 'testadmin13@skillbuilder.edu', 
        'testadmin14@skillbuilder.edu', 'testadmin15@skillbuilder.edu', 
        'testadmin16@skillbuilder.edu', 'testadmin17@skillbuilder.edu', 
        'testadmin18@skillbuilder.edu', 'testadmin19@skillbuilder.edu', 
        'testadmin20@skillbuilder.edu'
    ]
    for email in demo_user_emails:
        stmt = select(User.user_id).where(User.email == email)
        result = db.session.execute(stmt)
        user_id = result.one()
        new_password = rand_password()
        update_password(user_id, new_password)
        save_demo_user_email_password(email, new_password)

if __name__ == "__main__":
    with app.app_context():
        print("Changing demo user passwords.")
        try:
            change_demo_passwords()
            print("Finished changing demo user passwords.")
        except Exception as e:
            print(f"Failed to change any or all demo user passwords: {e}")
        