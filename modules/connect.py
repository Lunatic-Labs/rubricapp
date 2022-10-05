from flask import Blueprint

connect = Blueprint('create_app', __name__)

def create_app(config_filename=None):

    # file directory
    # requirement of two arguments: file address of app.py and fire address of root directory.
    if len(sys.argv) > 1:
        files_dir = sys.argv[1]
    elif platform.node() in ['rubric.cs.uiowa.edu', 'rubric-dev.cs.uiowa.edu']:
        files_dir = "/var/www/wsgi-scripts/rubric"
    else:
        print(
            "Requires argument: path to put files and database (suggestion is `pwd` when already in directory containing app.py)")
        sys.exit(1)

    print (files_dir)

    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'Thisissupposedtobesecret!'
    if platform.node() in ['rubric.cs.uiowa.edu', 'rubric-dev.cs.uiowa.edu']:
        dbpass = None
        with open("{}/dbpass".format(files_dir), 'r') as f:
            dbpass = f.readline().rstrip()

        dbuser = None
        with open("{}/dbuser".format(files_dir), 'r') as f:
            dbuser = f.readline().rstrip()

        app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://{0}:{1}@127.0.0.1/rubric'.format(
            dbuser, dbpass)
    else:
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///{}/account.db'.format(
            files_dir)

    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    initialize_extensions(app)
    