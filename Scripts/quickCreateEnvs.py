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

def findRepoRoot(root = "rubricapp"):
    path = pathlib.Path(__file__).resolve()
    while path.name != root:
        if path.name == path:
            print("ERROR: Could not find rubricapp/ directory. Run it from within rubricapp/ or its sub-directories")
            sys.exit(1)
        path = path.parent
    return path


def main():
    root_dir = findRepoRoot()
    root_env = root_dir / ".env"
    backend_env = root_dir / "BackEndFlask" / ".env"
    frontend_env = root_dir / "FrontEndReact" / ".env"
    
    mysqlHost = "skillbuilder"
    mysqlPassword = gen_password()
    mysqlRootPassword = gen_password()

    if not root_env.exists():
        root_env.write_text(
            "REDIS_HOST=redis\n"
            "REDIS_LIMITER=redis-limiter\n"
            "FLASK_DEBUG=1\n"
            "MYSQL_HOST=mysql\n"
            f"MYSQL_USER={mysqlHost}\n"
            "MYSQL_DATABASE=local\n"
            f"MYSQL_PASSWORD={mysqlPassword}\n"
            f"MYSQL_ROOT_PASSWORD={mysqlRootPassword}\n"
        )
    
    if not frontend_env.exists():
        frontend_env.write_text(
            "REACT_APP_API_URL=http://127.0.0.1:5000/api\n"
            "REACT_APP_SUPER_ADMIN_PASSWORD=@super_admin_password123\n"
            "REACT_APP_DEMO_ADMIN_PASSWORD=demo_admin\n"
            "REACT_APP_DEMO_TA_INSTRUCTOR_PASSWORD=demo_ta\n"
            "REACT_APP_DEMO_STUDENT_PASSWORD=demo_student\n"
        )

    if not backend_env.exists():
        backend_env.write_text(
            "FRONT_END_URL=http://127.0.0.1:3000\n"
            "SUPER_ADMIN_PASSWORD=@super_admin_password123\n"
            "DEMO_ADMIN_PASSWORD=demo_admin\n"
            "DEMO_TA_INSTRUCTOR_PASSWORD=demo_ta\n"
            "DEMO_STUDENT_PASSWORD=demo_student\n"
            f"SECRET_KEY={gen_password()}\n"
            "MYSQL_HOST=localhost:3306\n"
            f"MYSQL_USER={mysqlHost}\n"
            f"MYSQL_PASSWORD={mysqlPassword}\n"
            f"MYSQL_DATABASE=rubricapp\n"
        )



main()