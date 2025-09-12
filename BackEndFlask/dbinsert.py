#!/usr/local/bin/python3

from core import app, db
from models.user import create_user
import argparse
import sys


def insert_student(fname, lname, email, password, lms_id):
    print("Inserting new student:")
    print(f"  fname: {fname}")
    print(f"  lname: {lname}")
    print(f"  email: {email}")
    print(f"  password: {password}")
    print(f"  lms_id: {lms_id}")

    with app.app_context():
        create_user({
            "first_name": fname,
            "last_name": lname,
            "email": email,
            "password": password,
            "lms_id": lms_id,
            "consent": None,
            "owner_id": 2,
            "role_id": 5
        })


def insert_admin(fname, lname, email, password):
    print("Inserting new admin:")
    print(f"  fname: {fname}")
    print(f"  lname: {lname}")
    print(f"  email: {email}")
    print(f"  password: {password}")

    with app.app_context():
        create_user({
            "first_name": fname,
            "last_name": lname,
            "email": email,
            "password": password,
            "lms_id": 1,
            "consent": None,
            "owner_id": 1,
            "role_id": 3
        })


def main():
    parser = argparse.ArgumentParser(description="Insert user information into the database.")

    parser.add_argument("--new-student", action="store_true", help="Indicates that a new student is being added")
    parser.add_argument("--fname", type=str, help="First name of the user", required=False)
    parser.add_argument("--lname", type=str, help="Last name of the user", required=False)
    parser.add_argument("--email", type=str, help="Email of the user", required=False)
    parser.add_argument("--password", type=str, help="Password of the user", required=False)
    parser.add_argument("--lms", type=str, help="LMS ID of the student", required=False)

    parser.add_argument("--new-admin", action="store_true", help="Indicates that a new admin is being added")

    args = parser.parse_args()

    if not args.new_student and not args.new_admin:
        print("Error: You must specify either --new-student or --new-admin.")
        sys.exit(1)

    if args.new_student:
        if not (args.fname and args.lname and args.email and args.password and args.lms):
            print("Error: Missing required fields for student (fname, lname, email, password, lms).")
            sys.exit(1)
        insert_student(args.fname, args.lname, args.email, args.password, args.lms)

    if args.new_admin:
        if not (args.fname and args.lname and args.email and args.password):
            print("Error: Missing required fields for admin (fname, lname, email, password).")
            sys.exit(1)
        insert_admin(args.fname, args.lname, args.email, args.password)


if __name__ == "__main__":
    main()

