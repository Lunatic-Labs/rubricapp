# WARNING: This script should NOT be used in production. This exists to generate all the envs for local builds.
# NOTE: This script will only generate/populate the files if they do not already exist.

import sys
import random
import string
import pathlib

def gen_password(length=35):
    options = string.ascii_letters + string.digits
    password = ''.join(random.choice(options) for i in range(length))
    return password

def main():
    cwd = "rubricapp"

    if pathlib.Path.cwd().name != cwd:
        print("ERROR: The current workind directory must be /rubricapp")
        sys.exit(1)

    root_dir = pathlib.Path(__file__).resolve().parent
    root_env = root_dir / ".env"
    backend_env = root_dir / "BackEndFlask" / ".env"
    frontend_env = root_dir / "FrontEndReact" / ".env"

    if not root_env.exists():
        root_env.write_text(
            "REDIS_HOST=redis\n"
            "REDIS_LIMITER=redis-limiter\n"
            "FLASK_DEBUG=1\n"
            "MYSQL_HOST=mysql\n"
            "MYSQL_USER=skillbuilder\n"
            "MYSQL_DATABASE=local\n"
            f"MYSQL_PASSWORD={gen_password()}\n"
            f"MYSQL_ROOT_PASSWORD={gen_password()}\n"
        )
    
    if not frontend_env.exists():
        frontend_env.write_text(
            "REACT_APP_API_URL=http://127.0.0.1:5000/api\n"
            "REACT_APP_SUPER_ADMIN_PASSWORD=@super_admin_password123\n"
            "REACT_APP_DEMO_ADMIN_PASSWORD=demo_admin\n"
            "REACT_APP_DEMO_TA_INSTRUCTOR_PASSWORD=demo_ta\n"
            "REACT_APP_DEMO_STUDENT_PASSWORD=demo_student\n"
        )





main()