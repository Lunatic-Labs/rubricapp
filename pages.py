from core import *
from functions import *
from migrations import *
from objects import *

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get("email")
        user = User.query.filter_by(username=email).first()
        if user:
            password = request.form.get("password")
            if check_password_hash(user.password, password):
                rememberMe = request.form.get("rememberMe")
                login_user(user, remember=rememberMe)
                return redirect(url_for('instructor_project'))
            else:
                return render_template("newlogin.html", msg="password not correct")
        else:
            return render_template("newlogin.html", msg="user doesn't exist")
    return render_template("newlogin.html", msg="")

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        newEmail = request.form.get("newEmail")
        user = User.query.filter_by(username=newEmail).first()
        if not user:
            newPassword = request.form.get("newPassword")
            checkPassword = request.form.get("checkPassword")
            if newPassword==checkPassword:
                hashPassword = generate_password_hash(newPassword, method='sha256')
                newUser = User(username=newEmail, email=newEmail, password=hashPassword)
                db.session.add(newUser)
                db.session.commit()
                pathToUserFile = "{}/{}".format(base_directory, newUser.username)
                os.mkdir(pathToUserFile)
                return redirect(url_for('login'))
            else:
                return render_template("newsignup.html", msg="Passwords must match")
        else:
            return render_template("newsignup.html", msg="That email address is already associated with an account")
    return render_template("newsignup.html", msg="")

#log in function; Access User table
# @app.route('/login', methods=['GET', 'POST'])
# def login():
    # form = LoginForm()

    # # login validator
    # if form.validate_on_submit():
    #     user = User.query.filter_by(username=form.email.data).first()
    #     if user:
    #         if check_password_hash(user.password, form.password.data):
    #             login_user(user, remember=form.remember.data)
    #             # instructor jump to instructor page, student jump to student page
    #             # if(user.instructor == "1"):
    #             return redirect(url_for('instructor_project')) # jacky: after login, users are directed to the Rubric page, instead of Overview page
    #         else:
    #             return render_template('login.html', msg="password not correct", form=form)
    #             # print("password not correct")
    #             # # return render_template('newlogin.html', msg="password not correct", form=form)
    #             # return render_template('newlogin.html')
    #     else:
    #         return render_template('login.html', msg="user doesn't exist", form=form)
    #         # print("user doesn't exist")
    #         # return render_template('newlogin.html', msg="user doesn't exist", form=form)

    # return render_template('login.html', msg="", form=form)
    # # print("login page reached for the first time")
    # # # return render_template('newlogin.html', msg="", form=form)
    # # return render_template('newlogin.html')

# #sign up function; Access User table
# @app.route('/signup', methods=['GET', 'POST'])
# def signup():
#     form = RegisterForm()

#     # signup validator
#     if form.validate_on_submit():
#         # check if the user and email has existed in the database
#         email_is_taken = User.query.filter_by(email=form.email.data).first()
#         if email_is_taken:
#             return render_template('signup.html', form=form, msg="That email address is already associated with an account")
#         else:
#             hashed_password = generate_password_hash(form.password.data, method='sha256')
#             # In issue 28, we changed username to be email, we saved the username section as we don't need to change the table
#             new_user = User(username=form.email.data, email=form.email.data, password=hashed_password)
#             db.session.add(new_user)
#             db.session.commit()

#             # After making sure that the new user is created, the user's private folder can be created by using the user name

#             path_to_user_folder = "{}/{}".format(base_directory, new_user.username)
#             os.mkdir(path_to_user_folder)

#             return redirect(url_for('login'))

#     return render_template('signup.html', form=form, msg="")


# home page
@app.route('/instructor_dashboard')
@login_required
def instructor_dashboard():
    # Load all projects to instructor_dashboard
    # Find all projects in User's private folder by using current user

    path_to_current_user = "{}/{}".format(base_directory, current_user.username)
    project_list = [x.project for x in Permission.query.filter_by(owner=current_user.username, shareTo=current_user.username).all()]
    project_len = len(project_list)

    return render_template('instructor_dashboard.html', name=current_user.username, project_list=project_list,
                           project_len=project_len)

# Manage Rubrics: showing all private rubric;
@app.route('/project_profile_jumptool', methods=["POST", "GET"])
@login_required
def project_profile_jumptool():
    # a jump tool before load project
    # display the information of projects (title and desc) and its recent evaluations

    path_to_current_user = "{}/{}".format(base_directory, current_user.username)
    # list of evaluation & list of groups relating to one project
    project_set_map = {}
    # search projects in database by username
    project_list = Permission.query.filter_by(owner=current_user.username, shareTo=current_user.username).all()
    project_information_map = {}
    for project in project_list:
        path_to_evaluation_file = "{}/{}/{}/evaluation.xlsx".format(base_directory, current_user.username,
                                                                    project.project)
        evaluation_workbook = openpyxl.load_workbook(path_to_evaluation_file)
        evaluation_worksheet = evaluation_workbook['eva']
        group_worksheet = evaluation_workbook['group']
        group_col = []
        for col_item in list(group_worksheet.iter_cols())[0]:
            if col_item.value != "groupid":
                group_col.append(col_item.value)
        set_of_eva = Evaluation.query.filter_by(project_name=project.project, project_owner=current_user.username).all()
        project_set_map[project.project] = (group_col, set_of_eva)
        project_information_map[project.project] = Project.query.filter_by(project_name=project.project,
                                                                           owner=project.owner).first()

    return render_template("project_profile_jumptool.html", project_list=project_list, project_set_map=project_set_map,
                           project_information_map=project_information_map)


# Manage Rubrics: show single rubric and its evaluation grading status(graded group, ungraded group, grade table, )
@app.route('/project_profile/<string:project_id>/<string:msg>', methods=["POST", "GET"])
@login_required
def project_profile(project_id, msg):
    """
    It controls the project_profile.html page, it collects a list of all the evaluations and get them displayed on the web
    page
    :param project_id: project id
    :param msg: it is used to make sure the page is correctly loaded, if not, the error message will be displayed in the
    error box in the web page
    :return: a rendered web page with dictionaries map the info of current project
    """
    # show each grade in this project and divided into eva s
    project = Permission.query.filter_by(project_id=project_id).first()

    list_of_shareTo_permission = [x for x in
                                  Permission.query.filter_by(project=project.project, owner=current_user.username).all()
                                  if x.shareTo != current_user.username]

    path_to_evaluation_file = "{}/{}/{}/evaluation.xlsx".format(base_directory, current_user.username, project.project)
    evaluation_workbook = openpyxl.load_workbook(path_to_evaluation_file)
    evaluation_worksheet = evaluation_workbook['eva']
    group_worksheet = evaluation_workbook['group']
    meta_worksheet = evaluation_workbook['meta']
    list_of_eva = select_by_col_name('eva_name', evaluation_worksheet)
    set_of_eva = set(list_of_eva)
    # get all groups and its owners
    dic_of_eva = {}

    dic_of_choosen = {}
    set_of_meta = set(select_by_col_name('metaid', meta_worksheet))

    meta_group_map_list = []
    for group_index in range(2, len(list(meta_worksheet.iter_rows())) + 1):
        meta_group_map_list.append(select_map_by_index(group_index, meta_worksheet))

    for eva in set_of_eva:
        all_groups_choosen = set()
        all_groups_not_choosen = set()
        all_groups = set()
        choosen = {}
        for meta in set_of_meta:
            choosen[meta] = set()
        total = {}
        notchoosen = {}
        for meta in set_of_meta:

            notchoosen[meta] = set([x['groupid'] for x in meta_group_map_list if str(x['metaid']) == str(meta)])
            total[meta] = set([x['groupid'] for x in meta_group_map_list if str(x['metaid']) == str(meta)])
        # update 9/13: simple profile
        dic_of_eva[eva] = []
        temp_eva = select_row_by_group_id("eva_name", eva, evaluation_worksheet)
        for eva_row in temp_eva:
            dic_of_eva[eva].append(eva_row)
            for (key, value) in eva_row.items():
                if (key != "group_id") and (key != "eva_name") and (key != "owner") and (key != "date") and (key != "students") and (key != "last_updates"):
                    if (value is not None) and (value != " ") and (value != ""):
                        metaid = [x[0] for x in list(total.items()) if eva_row["group_id"] in x[1]][0]
                        choosen[metaid].add(eva_row["group_id"])
                        notchoosen[metaid].discard(eva_row["group_id"])
        for meta in set_of_meta:
            for choosen_i in choosen[meta]:
                all_groups_choosen.add(choosen_i)
            for notchoosen_j in notchoosen[meta]:
                all_groups_not_choosen.add(notchoosen_j)
            for all_k in total[meta]:
                all_groups.add(all_k)
        dic_of_choosen[eva] = (choosen, notchoosen, total, all_groups_choosen, all_groups_not_choosen, all_groups)

    tags = [x.value for x in list(evaluation_worksheet.iter_rows())[0]]

    # group management
    management_groups = []
    rows_got_from_group_worksheet = list(group_worksheet.iter_rows())
    for row in rows_got_from_group_worksheet:
        management_groups.append([x.value for x in row])

    records = EmailSendingRecord.query.filter_by(project_name=project.project, project_owner=current_user.username).all()
    if records is not None:
        sending_info_dict = {}
        for record in records:
            sending_info_dict[record.eva_name] = [record.num_of_tasks, record.num_of_finished_tasks]
        print(sending_info_dict)
    else:
        sending_info_dict = {}

    permission_message = ManageProjectMessages.lookup(msg)

    return render_template("project_profile.html", dic_of_eva=dic_of_eva, meta_list=set_of_meta,
                           list_of_shareTo_permission=list_of_shareTo_permission, management_groups=management_groups,
                           tags=tags, project=project, set_of_eva=list(set_of_eva), dic_of_choosen=dic_of_choosen,
                           msg=permission_message.message, msg_type=permission_message.type,
                           sending_info_dict=sending_info_dict)


@app.route('/management_group/<string:project_id>', methods=['GET', 'POST'])
@login_required
def managment_group(project_id):
    project = Permission.query.filter_by(project_id=project_id).first()
    path_to_evaluation_xlsx = "{}/{}/{}/evaluation.xlsx".format(base_directory, current_user.username, project.project)
    evaluation_workbook = openpyxl.load_workbook(path_to_evaluation_xlsx)
    group_worksheet = evaluation_workbook['group']
    for row_index in range(1, len(list(group_worksheet.iter_rows()))):
        for col_index in range(1, len(list(group_worksheet.iter_cols()))):
            student_email = request.form.get((list(group_worksheet.iter_cols())[0][row_index].value + str(col_index)),
                                             " ")

            # group management detector
            # if the given value is None, inserted should also be None
            if student_email == " " or student_email == "None":
                group_worksheet.cell(row_index + 1, col_index + 1).value = None
            else:
                group_worksheet.cell(row_index + 1, col_index + 1).value = student_email
    evaluation_workbook.save(path_to_evaluation_xlsx)
    return redirect(url_for("project_profile", project_id=project_id, msg=ManageProjectMessages.NoMessage.path))