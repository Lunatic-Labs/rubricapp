from core import *
from functions import *
from migrations import *
from objects import *

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