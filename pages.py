from core import *
from functions import *
from migrations import *
from objects import *

@app.route('/')
def index():
    return render_template('index.html')


#log in function; Access User table
@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()

    # login validator
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.email.data).first()
        if user:
            if check_password_hash(user.password, form.password.data):
                login_user(user, remember=form.remember.data)
                # instructor jump to instructor page, student jump to student page
                # if(user.instructor == "1"):
                return redirect(url_for('instructor_project')) # jacky: after login, users are directed to the Rubric page, instead of Overview page

            else:
                return render_template('login.html', msg="password not correct", form=form)
        else:
            return render_template('login.html', msg="user doesn't exist", form=form)

    return render_template('login.html', msg="", form=form)

#sign up function; Access User table
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    form = RegisterForm()

    # signup validator
    if form.validate_on_submit():
        # check if the user and email has existed in the database
        email_is_taken = User.query.filter_by(email=form.email.data).first()
        if email_is_taken:
            return render_template('signup.html', form=form, msg="That email address is already associated with an account")
        else:
            hashed_password = generate_password_hash(form.password.data, method='sha256')
            # In issue 28, we changed username to be email, we saved the username section as we don't need to change the table
            new_user = User(username=form.email.data, email=form.email.data, password=hashed_password)
            db.session.add(new_user)
            db.session.commit()

            # After making sure that the new user is created, the user's private folder can be created by using the user name

            path_to_user_folder = "{}/{}".format(base_directory, new_user.username)
            os.mkdir(path_to_user_folder)

            return redirect(url_for('login'))

    return render_template('signup.html', form=form, msg="")


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


@app.route('/delete_eva/<string:project_id>/<string:evaluation>/<string:group>/<string:grader>/<string:datetime>',
           methods=['GET', 'POST'])
@login_required
def delete_eva(project_id, evaluation, group, grader, datetime):
    project = Permission.query.filter_by(project_id=project_id).first()
    path_to_evaluation_xlsx = "{}/{}/{}/evaluation.xlsx".format(base_directory, current_user.username, project.project)
    evaluation_workbook = openpyxl.load_workbook(path_to_evaluation_xlsx)
    evaluation_worksheet = evaluation_workbook['eva']
    group_worksheet = evaluation_workbook['group']
    allgroups = select_by_col_name('groupid', group_worksheet)
    students_worksheet = evaluation_workbook['students']

    index = int(select_index_by_group_eva_owner_date(evaluation, group, grader, datetime, evaluation_worksheet))
    evaluation_worksheet.delete_rows(index, 1)

    # check whether all group have at least one empty grade in this evaluation
    group_col_in_eva = set(select_by_col_name('group', evaluation_worksheet))
    empty_group = [x for x in allgroups if x not in group_col_in_eva]

    students = get_students_by_group(group_worksheet, students_worksheet)

    for empty in empty_group:
        students_name = []
        # couple is [email, student_name]
        for student_couple in students[str(group)]:
            students_name.append(student_couple[1])
        empty_row = new_row_generator(str(group), students_name, evaluation, evaluation_worksheet)
        evaluation_worksheet.append(empty_row)
    evaluation_workbook.save(path_to_evaluation_xlsx)
    return redirect(url_for("project_profile", project_id=project_id, msg=ManageProjectMessages.NoMessage.path))


@app.route('/delete_project/<string:project_id>', methods=['GET', 'POST'])
@login_required
def delete_project(project_id):
    """
    Delete a project from database
    :param project_id: project id
    :return: rerender current page
    """
    project = Permission.query.filter_by(project_id=project_id).first()
    permission_to_delete = Permission.query.filter_by(project=project.project).all()
    path_to_current_project = "{}/{}/{}".format(base_directory, current_user.username, project.project)
    if os.path.exists(path_to_current_project):
        shutil.rmtree(path_to_current_project)

        # after delete the folder, delete all the permissions that were send from the project
        for permission in permission_to_delete:
            db.session.delete(permission)
            db.session.commit()

        # delete the project in project table
        project_in_database = Project.query.filter_by(project_name=project.project, owner=project.owner).first()
        db.session.delete(project_in_database)
        db.session.commit()
        # FIXME: these messages are not being used
        msg = "project deleted"
    else:
        msg = "the project to be deleted could not be found"

    return redirect(url_for("project_profile_jumptool", project_id=project_id))


@app.route('/update_permission/<string:project_id>/<string:project_id_full>', methods=["GET", "POST"])
@login_required
def update_permission(project_id, project_id_full):
    try:
        submit = request.form['submit']
        if submit == 'update':
            authority = request.form['authority']
            query = Permission.query.filter_by(project_id=project_id).first()
            query.status = authority
            db.session.commit()
            msg = ManageProjectMessages.UpdatedAuthority.path
        else:
            query = Permission.query.filter_by(project_id=project_id).first()
            db.session.delete(query)
            db.session.commit()
            msg = ManageProjectMessages.DeletedPerm.path
    except Exception as e:
        msg = ManageProjectMessages.FailedUpAuth.path

    return redirect(url_for("project_profile", project_id=project_id_full, msg=msg))


@app.route('/create_permission/<string:project_id>', methods=["GET", "POST"])
@login_required
def create_permission(project_id):
    """
    This is being used in project_profile.html, which creates permission to a another user to share the rubric. The func-
    ction first search the typed in username, if the user exist, it creates a permission in Permission table, otherwise
    it returns to current page with error messages displayed
    :param project_id: current project id
    :return: It depends on the validity of typed in username
    """
    try:
        username = request.form.get('username', " ")
        authority = "overwrite"
        pending_authority = "pending|{}".format(authority)
        account_user = User.query.filter_by(username=username).first()
        if username != current_user.username:
            if account_user is not None:
                    # create permission:
                project = Permission.query.filter_by(project_id=project_id).first()
                permission_projectid = "{}{}{}{}".format(current_user.username, username, project.project, authority)
                permission_existed = Permission.query.filter_by(project_id=permission_projectid).first()
                if permission_existed:
                    return redirect(url_for("project_profile", project_id=project_id, msg="Permission existed!"))
                else:
                    new_permission = Permission(project_id=permission_projectid, owner=current_user.username, shareTo=username,
                                                project=project.project, status=pending_authority)
                    db.session.add(new_permission)
                    db.session.commit()

                    return redirect(url_for("project_profile", project_id=project_id, msg=ManageProjectMessages.Created.path))
            else:
                return redirect(url_for("project_profile", project_id=project_id, msg=ManageProjectMessages.UserNotFound.path))
        else:
            return redirect(url_for("project_profile", project_id=project_id, msg=ManageProjectMessages.NotYourself.path))

    except:
        return redirect(url_for("project_profile", project_id=project_id, msg=ManageProjectMessages.Failed.path))


@app.route('/instructor_project', methods=["POST", "GET"])
@login_required
def instructor_project():
    """
    Load All project and shared project from database for the current user
    :return: a rendered template with all the projects the current user has
    """
    list_of_all_projects = Permission.query.filter_by(shareTo=current_user.username).all()
    list_of_personal_projects = Permission.query.filter_by(owner=current_user.username,
                                                           shareTo=current_user.username).all()
    list_of_shared_project = []
    for project in list_of_all_projects:
        flag = True
        for personal_project in list_of_personal_projects:
            if project.project_id == personal_project.project_id:
                flag = False
        if flag:
            list_of_shared_project.append(project)

    list_of_personal_project_database = {}
    list_of_shared_project_database = {}
    # load the description of project
    for personal_project in list_of_personal_projects:
        project_in_project_db = Project.query.filter_by(project_name=personal_project.project,
                                                        owner=personal_project.owner).first()
        list_of_personal_project_database[project_in_project_db.project_name] = project_in_project_db
    for shared_project in list_of_shared_project:
        project_in_project_db = Project.query.filter_by(project_name=shared_project.project,
                                                        owner=shared_project.owner).first()
        list_of_shared_project_database[project_in_project_db.project_name] = project_in_project_db
    return render_template('instructor_project.html', personal_project_list=list_of_personal_projects,
                           shared_project_list=list_of_shared_project,
                           list_of_personal_project_database=list_of_personal_project_database,
                           list_of_shared_project_database=list_of_shared_project_database)


@app.route('/create_project', methods=["POST", "GET"])
@login_required
def create_project():
    """
    # Request from file by WTF
    # Create a new project folder under 'path_to_current_user'
    # save files in new folder and build a evaluation doc depending on json file

    :return:
    """

    path_to_current_user = "{}/{}".format(base_directory, current_user.username)
    path_to_student_file = "{}/student.xlsx".format(path_to_current_user)
    path_to_json_file = "{}/TW.json".format(path_to_current_user)
    form = ProjectForm()
    try:
        if form.validate_on_submit():
            # create project folder
            path_to_current_user_project = "{}/{}/{}".format(base_directory, current_user.username, form.project_name.data)
            os.mkdir(path_to_current_user_project)

            path_to_student_file_stored = "{}/student.xlsx".format(path_to_current_user_project)
            shutil.move(path_to_student_file, path_to_student_file_stored)
            path_to_json_file_stored = "{}/TW.json".format(path_to_current_user_project)
            shutil.move(path_to_json_file, path_to_json_file_stored)
            # creating evaluation doc based on grading criteria json file

            # copy student sheet to evaluation doc
            student_file_workbook = openpyxl.load_workbook(path_to_student_file_stored)
            student_file_worksheet = student_file_workbook['Sheet1']

            # create group file depending on student file
            list_of_group = select_by_col_name('group', student_file_worksheet)
            set_of_group = set(list_of_group)

            # Fixing a bug where a None element was found. Is this safe?
            set_of_group.discard(None)

            # create a group workbook
            path_to_group_file = "{}/group.xlsx".format(path_to_current_user_project)
            group_workbook = openpyxl.Workbook()
            group_file_worksheet = group_workbook.create_sheet('Sheet1')
            meta_file_worksheet = group_workbook.create_sheet('Sheet2')
            # all student information map
            student_map_list = []
            for student_index in range(2, len(list(student_file_worksheet.iter_rows())) + 1):
                student_map_list.append(select_map_by_index(student_index, student_file_worksheet))
            # insert group columns
            group_file_worksheet.cell(1, 1).value = 'groupid'
            meta_file_worksheet.cell(1, 1).value = 'groupid'
            meta_file_worksheet.cell(1, 2).value = 'metaid'
            start_index = 2
            max_num_students_pergroup = 0
            for group in set_of_group:
                group_file_worksheet.cell(start_index, 1).value = group
                student_emails = [x['Email'] for x in student_map_list if x['group'] == group]
                if len(student_emails) > max_num_students_pergroup:
                    max_num_students_pergroup = len(student_emails)
                meta_file_worksheet.cell(start_index, 1).value = group
                meta_group = [x['meta'] for x in student_map_list if x['group'] == group][0]
                meta_file_worksheet.cell(start_index, 2).value = meta_group
                for insert_index in range(2, len(student_emails) + 2):
                    group_file_worksheet.cell(start_index, insert_index).value = student_emails[insert_index - 2]
                start_index += 1
            for index in range(1,max_num_students_pergroup+1):
                group_file_worksheet.cell(1, 1+index).value = ("student" + str(index))
            group_workbook.save(path_to_group_file)

            path_to_evaluation = "{}/evaluation.xlsx".format(path_to_current_user_project)
            evaluation_workbook = openpyxl.Workbook()
            evaluation_group = evaluation_workbook.create_sheet('group')
            evaluation_meta = evaluation_workbook.create_sheet('meta')
            evaluation_student = evaluation_workbook.create_sheet('students')
            copy_all_worksheet(evaluation_group, group_file_worksheet)
            copy_all_worksheet(evaluation_meta, meta_file_worksheet)
            copy_all_worksheet(evaluation_student, student_file_worksheet)
            # create EVA depending on the json file
            evaluation_eva = evaluation_workbook.create_sheet('eva')
            # open json file and load json
            myLock = FileLock(path_to_json_file_stored+'.lock', timeout = 5)
            with myLock:
                with open(path_to_json_file_stored, 'r')as f:
                    json_data = json.loads(f.read(), strict=False)
            # The group id, eva_name, date are defults
            tags_to_append = ['group_id', 'eva_name', 'owner', 'date', 'students']
            for category in json_data['category']:
                category_name = (category['name'])
                for section in category['section']:
                    # instructors don't care about the text value, the text values will only be send to students.
                    if section['type'] != 'text':
                        value_to_append = "{}|{}".format(category_name, section['name'])
                        tags_to_append.append(value_to_append)
            tags_to_append.append("comment")
            tags_to_append.append("last_updates")
            evaluation_eva.append(tags_to_append)

            evaluation_workbook.save(path_to_evaluation)

            # create permission to owener himself
            project_id = "{}{}{}{}".format(current_user.username, current_user.username, form.project_name.data, 'full')
            self_permission = Permission(project_id=project_id, owner=current_user.username, shareTo=current_user.username,
                                         project=form.project_name.data, status='full')
            db.session.add(self_permission)
            db.session.commit()

            # create the project in database
            project_to_add = Project(project_name=form.project_name.data, project_status='public',
                                     owner=current_user.username, description=form.project_description.data)
            db.session.add(project_to_add)
            db.session.commit()

            return redirect(url_for("instructor_project"))


        else:
            if os.path.exists(path_to_student_file):
                os.remove(path_to_student_file)
            if os.path.exists(path_to_json_file):
                os.remove(path_to_json_file)
            return render_template('create_project.html', form=form, alert="")

    except Exception as e:
        if os.path.exists(path_to_student_file):
            os.remove(path_to_student_file)
        if os.path.exists(path_to_json_file):
            os.remove(path_to_json_file)
        return render_template("create_project.html", form=form, alert=e)


def copy_all_worksheet(copy_to, copy_from):
    for row in range(0, len(list(copy_from.iter_rows()))):
        for col in range(0, len(list(copy_from.iter_cols()))):
            copy_to.cell(row=row + 1, column=col + 1).value = copy_from.cell(row=row + 1, column=col + 1).value


@app.route('/create_project_by_share/<string:project_id>', methods=["POST", "GET"])
@login_required
def create_project_by_share(project_id):
    """

    :param project_id:
    :return:
    """
    new_project_name = request.form['project_name']
    duplicate_project_name = Project.query.filter_by(project_name=new_project_name, owner=current_user.username).first()
    if duplicate_project_name is not None:
        return redirect(url_for('account', msg="This rubric name has been used before"))
    path_to_current_user_project = "{}/{}/{}".format(base_directory, current_user.username, new_project_name)
    # copy json file:
    project = Permission.query.filter_by(project_id=project_id).first()
    if project is not None:
        owner = project.owner
        project_name = project.project
        path_to_json_file = "{}/{}/{}/TW.json".format(base_directory, owner, project_name)#use project name and project owner info to locate the path of json
        path_to_json_file_stored = "{}/TW.json".format(path_to_current_user_project)
        if os.path.exists(path_to_json_file):
            os.mkdir(path_to_current_user_project)
            shutil.copy2(path_to_json_file, path_to_json_file_stored)
        else:
            return redirect('account', msg="the rubric you were trying to copy has been deleted")
    else:
        return redirect('account', msg="the rubric you were trying to copy has been deleted")

    new_project_desc = request.form['project_desc']
    student_file = request.files['student_file']
    path_to_student_file_stored = "{}/student.xlsx".format(path_to_current_user_project)
    student_file.save(path_to_student_file_stored)

    #check if the student file is valid:
    student_file_workbook = load_workbook(path_to_student_file_stored)
    student_file_worksheet = student_file_workbook['Sheet1']
    find_Student = True if 'Student' in [x.value for x in list(student_file_worksheet.iter_rows())[0]] else False
    find_Email = True if 'Email' in [x.value for x in list(student_file_worksheet.iter_rows())[0]] else False
    find_group = True if 'group' in [x.value for x in list(student_file_worksheet.iter_rows())[0]] else False
    find_meta_group = True if 'meta' in [x.value for x in list(student_file_worksheet.iter_rows())[0]] else False

    if find_Student is False:
        return redirect('account', msg="no Student column in student file!")
    if find_Email is False:
        return redirect('account', msg="no Email column in student file!")
    if find_group is False:
        return redirect('account', msg="no group column in student file!")
    if find_meta_group is False:
        return redirect('account', msg="no meta group column in student file!")

    #create project:
    # create group file depending on student file
    list_of_group = select_by_col_name('group', student_file_worksheet)
    set_of_group = set(list_of_group)

    # Fixing a bug where a None element was found. Is this safe?
    set_of_group.discard(None)

    # create a group workbook
    path_to_group_file = "{}/group.xlsx".format(path_to_current_user_project)
    group_workbook = openpyxl.Workbook()
    group_file_worksheet = group_workbook.create_sheet('Sheet1')
    meta_file_worksheet = group_workbook.create_sheet('Sheet2')
    # all student information map
    student_map_list = []
    for student_index in range(2, len(list(student_file_worksheet.iter_rows())) + 1):
        student_map_list.append(select_map_by_index(student_index, student_file_worksheet))
    # insert group columns
    group_file_worksheet.cell(1, 1).value = 'groupid'
    meta_file_worksheet.cell(1, 1).value = 'groupid'
    meta_file_worksheet.cell(1, 2).value = 'metaid'
    start_index = 2
    for group in set_of_group:
        group_file_worksheet.cell(start_index, 1).value = group
        student_emails = [x['Email'] for x in student_map_list if x['group'] == group]
        meta_file_worksheet.cell(start_index, 1).value = group
        meta_group = [x['meta'] for x in student_map_list if x['group'] == group][0]
        meta_file_worksheet.cell(start_index, 2).value = meta_group
        for insert_index in range(2, len(student_emails) + 2):
            group_file_worksheet.cell(start_index, insert_index).value = student_emails[insert_index - 2]
        start_index += 1
    group_workbook.save(path_to_group_file)

    path_to_evaluation = "{}/evaluation.xlsx".format(path_to_current_user_project)
    evaluation_workbook = openpyxl.Workbook()
    evaluation_group = evaluation_workbook.create_sheet('group')
    evaluation_meta = evaluation_workbook.create_sheet('meta')
    evaluation_student = evaluation_workbook.create_sheet('students')
    copy_all_worksheet(evaluation_group, group_file_worksheet)
    copy_all_worksheet(evaluation_meta, meta_file_worksheet)
    copy_all_worksheet(evaluation_student, student_file_worksheet)
    # create EVA depending on the json file
    evaluation_eva = evaluation_workbook.create_sheet('eva')
    # open json file and load json
    myLock = FileLock(path_to_json_file_stored+'.lock', timeout = 5)
    with myLock:
        with open(path_to_json_file_stored, 'r')as f:
            json_data = json.loads(f.read(), strict=False)
    # The group id, eva_name, date are defults
    tags_to_append = ['group_id', 'eva_name', 'owner', 'date', 'students']
    for category in json_data['category']:
        category_name = (category['name'])
        for section in category['section']:
            # instructors don't care about the text value, the text values will only be send to students.
            if section['type'] != 'text':
                value_to_append = "{}|{}".format(category_name, section['name'])
                tags_to_append.append(value_to_append)
    tags_to_append.append("comment")
    tags_to_append.append("last_updates")
    evaluation_eva.append(tags_to_append)

    evaluation_workbook.save(path_to_evaluation)

    # create permission to owner himself
    project_id = "{}{}{}{}".format(current_user.username, current_user.username, new_project_name, 'full')
    self_permission = Permission(project_id=project_id, owner=current_user.username, shareTo=current_user.username,
                                 project=new_project_name, status='full')
    db.session.add(self_permission)
    db.session.commit()

    # create the project in database
    project_id = "{}{}".format(current_user.username, new_project_name)
    project_to_add = Project(project_name=new_project_name, project_status='public',
                             owner=current_user.username, description=new_project_desc)
    db.session.add(project_to_add)
    db.session.commit()

    return redirect(url_for("instructor_project"))


@app.route('/create_project_by_share_name_and_owner/<string:type>/<string:project_name>/<string:project_owner>', methods=["POST", "GET"])
@login_required
def create_project_by_share_name_and_owner(type, project_name, project_owner):

    new_project_name = request.form['project_name']
    duplicate_project_name = Project.query.filter_by(project_name=new_project_name, owner=current_user.username).first()
    if duplicate_project_name is not None:
        msg = "This rubric name has been used before"
    path_to_current_user_project = "{}/{}/{}".format(base_directory, current_user.username, new_project_name)
    if type == "Share":
        path_to_json_file = "{}/{}/{}/TW.json".format(base_directory, project_owner, project_name)#jacky: use project name and project owner info to locate the path of json?
    else:
        path_to_json_file = "{}/{}/{}".format(home_directory, "Default", project_name)
    path_to_json_file_stored = "{}/TW.json".format(path_to_current_user_project)
    if os.path.exists(path_to_json_file):
        os.mkdir(path_to_current_user_project)
        shutil.copy2(path_to_json_file, path_to_json_file_stored)
    else:
        return redirect(url_for('account', msg="the rubric you were trying to copy has been deleted"))
    new_project_desc = request.form['project_desc']
    student_file = request.files['student_file']
    path_to_student_file_stored = "{}/student.xlsx".format(path_to_current_user_project)
    student_file.save(path_to_student_file_stored)

    #check if the student file is valid:
    student_file_workbook = load_workbook(path_to_student_file_stored)
    student_file_worksheet = student_file_workbook['Sheet1']
    find_Student = True if 'Student' in [x.value for x in list(student_file_worksheet.iter_rows())[0]] else False
    find_Email = True if 'Email' in [x.value for x in list(student_file_worksheet.iter_rows())[0]] else False
    find_group = True if 'group' in [x.value for x in list(student_file_worksheet.iter_rows())[0]] else False
    find_meta_group = True if 'meta' in [x.value for x in list(student_file_worksheet.iter_rows())[0]] else False

    if find_Student is False:
        return redirect('account', msg="no Student column in student file!")
    if find_Email is False:
        return redirect('account', msg="no Email column in student file!")
    if find_group is False:
        return redirect('account', msg="no group column in student file!")
    if find_meta_group is False:
        return redirect('account', msg="no meta group column in student file!")

    #create project:
    # create group file depending on student file
    list_of_group = select_by_col_name('group', student_file_worksheet)
    set_of_group = set(list_of_group)
    # create a group workbook
    path_to_group_file = "{}/group.xlsx".format(path_to_current_user_project)
    group_workbook = openpyxl.Workbook()
    group_file_worksheet = group_workbook.create_sheet('Sheet1')
    meta_file_worksheet = group_workbook.create_sheet('Sheet2')
    # all student information map
    student_map_list = []
    for student_index in range(2, len(list(student_file_worksheet.iter_rows())) + 1):
        student_map_list.append(select_map_by_index(student_index, student_file_worksheet))
    # insert group columns
    group_file_worksheet.cell(1, 1).value = 'groupid'
    meta_file_worksheet.cell(1, 1).value = 'groupid'
    meta_file_worksheet.cell(1, 2).value = 'metaid'
    start_index = 2
    for group in set_of_group:
        group_file_worksheet.cell(start_index, 1).value = group
        student_emails = [x['Email'] for x in student_map_list if x['group'] == group]
        meta_file_worksheet.cell(start_index, 1).value = group
        meta_group = [x['meta'] for x in student_map_list if x['group'] == group][0]
        meta_file_worksheet.cell(start_index, 2).value = meta_group
        for insert_index in range(2, len(student_emails) + 2):
            group_file_worksheet.cell(start_index, insert_index).value = student_emails[insert_index - 2]
        start_index += 1
    group_workbook.save(path_to_group_file)

    path_to_evaluation = "{}/evaluation.xlsx".format(path_to_current_user_project)
    evaluation_workbook = openpyxl.Workbook()
    evaluation_group = evaluation_workbook.create_sheet('group')
    evaluation_meta = evaluation_workbook.create_sheet('meta')
    evaluation_student = evaluation_workbook.create_sheet('students')
    copy_all_worksheet(evaluation_group, group_file_worksheet)
    copy_all_worksheet(evaluation_meta, meta_file_worksheet)
    copy_all_worksheet(evaluation_student, student_file_worksheet)
    # create EVA depending on the json file
    evaluation_eva = evaluation_workbook.create_sheet('eva')
    # open json file and load json
    myLock = FileLock(path_to_json_file_stored+'.lock', timeout = 5)
    with myLock:
        with open(path_to_json_file_stored, 'r')as f:
            json_data = json.loads(f.read(), strict=False)
    # The group id, eva_name, date are defults
    tags_to_append = ['group_id', 'eva_name', 'owner', 'date', 'students']
    for category in json_data['category']:
        category_name = (category['name'])
        for section in category['section']:
            # instructors don't care about the text value, the text values will only be send to students.
            if section['type'] != 'text':
                value_to_append = "{}|{}".format(category_name, section['name'])
                tags_to_append.append(value_to_append)
    tags_to_append.append("comment")
    tags_to_append.append("last_updates")
    evaluation_eva.append(tags_to_append)

    evaluation_workbook.save(path_to_evaluation)

    # create permission to owener himself
    project_id = "{}{}{}{}".format(current_user.username, current_user.username, new_project_name, 'full')
    self_permission = Permission(project_id=project_id, owner=current_user.username, shareTo=current_user.username,
                                 project=new_project_name, status='full')
    db.session.add(self_permission)
    db.session.commit()

    # create the project in database
    # project_id = "{}{}".format(current_user.username, new_project_name)
    project_to_add = Project(project_name=new_project_name, project_status='public',
                             owner=current_user.username, description=new_project_desc)
    db.session.add(project_to_add)
    db.session.commit()

    return redirect(url_for("instructor_project"))

@app.route('/load_project/<string:project_id>/<string:msg>', methods=["GET"])
@login_required
def load_project(project_id, msg):
    # get project by project_id
    project = Permission.query.filter_by(project_id=project_id).first()
    path_to_evaluation_xlsx = "{}/{}/{}/evaluation.xlsx".format(base_directory, project.owner, project.project)
    evaluation_workbook = openpyxl.load_workbook(path_to_evaluation_xlsx)
    meta_worksheet = evaluation_workbook['meta']
    set_of_eva = Evaluation.query.filter_by(project_name=project.project, project_owner=project.owner).all()
    set_of_meta = set(select_by_col_name('metaid', meta_worksheet))

    return render_template("project.html", project=project, data_of_eva_set=set_of_eva, set_of_meta=set_of_meta,
                           msg=msg, useremail=current_user.email)

@app.route('/create_evaluation/<string:project_id>', methods=['GET', 'POST'])
@login_required
def create_evaluation(project_id):
    # get project by id
    project = Permission.query.filter_by(project_id=project_id).first()
    # load group columns and evaluation worksheet
    evaluation_name = request.form['evaluation_name']
    evaluation_name_find_in_db = Evaluation.query.filter_by(project_owner=current_user.username,
                                                            project_name=project.project,
                                                            eva_name=evaluation_name).first()
    # give each new evaluation a default value of sending record
    record_existence = EmailSendingRecord.query.filter_by(project_name=project.project,
                                                          project_owner=current_user.username,
                                                          eva_name=evaluation_name).first()
    if record_existence is None:
        new_record = EmailSendingRecord(project_name=project.project,
                                        project_owner=current_user.username,
                                        eva_name=evaluation_name,
                                        num_of_tasks=0,
                                        num_of_finished_tasks=0)
        db.session.add(new_record)
        db.session.commit()

    if evaluation_name_find_in_db is None:
        evaluation_desc = request.form.get('evaluation_description', " ")
        path_to_load_project = "{}/{}/{}".format(base_directory, current_user.username, project.project)
        path_to_evaluation_file = "{}/evaluation.xlsx".format(path_to_load_project)
        eva_workbook = load_workbook(path_to_evaluation_file)
        group_worksheet = eva_workbook['group']
        eva_worksheet = eva_workbook['eva']
        meta_worksheet = eva_workbook['meta']
        students_worksheet = eva_workbook['students']

        group_col = []
        for col_item in list(group_worksheet.iter_cols())[0]:
            if col_item.value != "groupid":
                group_col.append(col_item.value)

        # get all students by students
        students = get_students_by_group(group_worksheet, students_worksheet)
        # create a empty row for each group in the new evaluation
        for group in group_col:
            students_name = []
            # couple is [email, student_name]
            for student_couple in students[str(group)]:
                students_name.append(student_couple[1])
            row_to_insert = new_row_generator(str(group), students_name, evaluation_name, eva_worksheet)
            eva_worksheet.append(row_to_insert)
        eva_workbook.save(path_to_evaluation_file)

        # create evaluation in database:
        evaluation_to_add = Evaluation(eva_name=evaluation_name, project_name=project.project,
                                       project_owner=project.owner, owner=current_user.username,
                                       description=evaluation_desc)
        db.session.add(evaluation_to_add)
        db.session.commit()
        msg = "New Evaluation has been created successfully"

        set_of_meta = set(select_by_col_name('metaid', meta_worksheet))
        return redirect(
            url_for('jump_to_evaluation_page', project_id=project.project_id, evaluation_name=evaluation_name, metaid=set_of_meta.pop(), group="***None***", msg=msg))

    else:
        print(evaluation_name_find_in_db)
        return redirect(url_for('load_project', project_id=project_id, msg="The evaluation_name has been used before"))


