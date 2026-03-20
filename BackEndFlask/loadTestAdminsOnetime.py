
from core import app, db
from models.user import create_user, get_user_by_email


def load_test_admins():
   
    admin_names = [
        {"first": "Alice", "last": "Anderson"},
        {"first": "Bob", "last": "Brown"},
        {"first": "Carol", "last": "Clark"},
        {"first": "David", "last": "Davis"},
        {"first": "Emma", "last": "Evans"},
        {"first": "Frank", "last": "Franklin"},
        {"first": "Grace", "last": "Green"},
        {"first": "Henry", "last": "Harris"},
        {"first": "Iris", "last": "Ingram"},
        {"first": "Jack", "last": "Jackson"},
        {"first": "Karen", "last": "Knight"},
        {"first": "Leo", "last": "Lewis"},
        {"first": "Monica", "last": "Mitchell"},
        {"first": "Nathan", "last": "Nelson"},
        {"first": "Olivia", "last": "Oliver"},
        {"first": "Peter", "last": "Parker"},
        {"first": "Quinn", "last": "Quinn"},
        {"first": "Rachel", "last": "Roberts"},
        {"first": "Steven", "last": "Stewart"},
        {"first": "Tina", "last": "Taylor"},
    ]

    for index, admin in enumerate(admin_names, start=1):
        admin_number = str(index).zfill(2)  # Format as 01, 02, ..., 20
        email = f"testadmin{admin_number}@skillbuilder.edu"

        # Skip creation if the user already exists to make this script idempotent.
        if get_user_by_email(email) is not None:
            print(f"Already exists: {email}")
            continue

        create_user({
            "first_name": admin["first"],
            "last_name": admin["last"],
            "email": email,
            "password": f"test_admin{admin_number}",
            "lms_id": 100 + index,  # Offset to avoid collision with demo users
            "consent": None,
            "owner_id": 1,  # Same owner as demo admin (for shared visibility testing)
            "role_id": 3    # Admin role
        }, validate_emails=False)

        print(f"Created {email}")


if __name__ == "__main__":
    with app.app_context():
        print("Loading 20 test admins...")
        load_test_admins()
        print("Successfully loaded 20 test admins!")
