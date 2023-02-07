from core import *
from functions import *
from migrations import *
from objects import *

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

@app.route('/delete_project/<string:project_id>', methods=['GET', 'POST'])
@login_required
def delete_project(project_id):
    """
    Delete a project from database
    :param project_id: project id
    :return: rerender current page
    """
    project = Permission.query.filter_by(project_id=project_id).first()
    path_to_evaluation_xlsx = "{}/{}/{}/evaluation.xlsx".format(base_directory, current_user.username, project.project)

    # delete all evaluations associated with the project
    evaluations = Evaluation.query.filter_by(project_owner=current_user.username,
                                                            project_name=project.project).all()
    for evaluation in evaluations:
        db.session.delete(evaluation)
        db.session.commit()


    #delete all email sending recoreds asscioated with the project
    record_existence = EmailSendingRecord.query.filter_by(project_name=project.project,
                                                          project_owner=current_user.username).all()
    for record in record_existence:
        db.session.delete(record)
        db.session.commit()

    #delete evaluation excel
    if os.path.exists(path_to_evaluation_xlsx):
        shutil.rmtree(path_to_evaluation_xlsx)


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
