from core import *
# from BackEndFlask.functions import *
# from BackEndFlask.migrations import *
# from BackEndFlask.objects import *
from functions import *
from migrations import *
from objects import *

@app.route(
    '/jump_to_evaluation_page/<string:project_id>/<string:evaluation_name>/<string:metaid>/<string:group>/<string:msg>',
    methods=["GET", "POST"])
@login_required
def jump_to_evaluation_page(project_id, evaluation_name, metaid, group, msg):
    # get project by project_id
    project = Permission.query.filter_by(project_id=project_id).first()
    # prepare the json data and group numbers before it jumps to evaluation page
    path_to_load_project = "{}/{}/{}".format(base_directory, project.owner, project.project)
    myLock = FileLock(path_to_load_project+'.lock', timeout = 5)
    with myLock:
        with open("{}/TW.json".format(path_to_load_project), 'r')as f:
            json_data = json.loads(f.read(), strict=False)
    excelLock = FileLock("{}/evaluation.xlsx".format(path_to_load_project) + '.lock', timeout=5)
    with excelLock:
        eva_workbook = load_workbook("{}/evaluation.xlsx".format(path_to_load_project))
        group_worksheet = eva_workbook['group']
        students_worksheet = eva_workbook['students']
        meta_worksheet = eva_workbook['meta']

        # data of meta groups
        meta_group_map_list = []
        for group_index in range(2, len(list(meta_worksheet.iter_rows())) + 1):
            meta_group_map_list.append(select_map_by_index(group_index, meta_worksheet))
        group_col = [x['groupid'] for x in meta_group_map_list if str(x['metaid']) == str(metaid)]
        # if only click on meta group, by default choose its first group
        if group == "***None***":
            group = group_col[0]
        # check if evaluation exists in the worksheet
        eva_worksheet = eva_workbook['eva']

        # Transform ROWS in worksheet to DICTIONARY
        new_row = {}
        first_row = list(eva_worksheet.iter_rows())[0]
        for tag in first_row:
            new_row[tag.value] = ""

        temp_eva = select_row_by_group_id("eva_name", evaluation_name, eva_worksheet)

        # dictionary contains all data
        eva_to_edit = {}
        # list contains only owners
        owner_list = []

        #first, convert string to time and then pick the latest update which committed by this user.
        previous_max_date = datetime.datetime.min
        active_tab_tuple = ()
        for row in temp_eva:
            if str(group) == str(row['group_id']):
                owner_per_row = str(row['owner'])
                date = str(row['date'])
                date_datetime = datetime.datetime.strptime(date, "%Y-%m-%d_%H-%M-%S")
                # tuple will be unique in this evaluation
                tuple = (owner_per_row, date)
                if owner_per_row == current_user.username and date_datetime > previous_max_date:
                    previous_max_date = date_datetime
                    active_tab_tuple = tuple
                owner_list.append(tuple)
                eva_to_edit[tuple] = row

        if len(active_tab_tuple) == 0:
            active_tab_tuple = owner_list[0]

        students = get_students_by_group(group_worksheet, students_worksheet)
        for temp_group in group_col:
            index = select_index_by_group_eva(evaluation_name, temp_group, eva_worksheet)
            students_attendence = (eva_worksheet.cell(index[0], 5).value).split("|")
            print(students_attendence)
            for temp_student in students[temp_group]:
                if temp_student[1] in students_attendence:
                    students[temp_group][students[temp_group].index(temp_student)].append(1)
                else:
                    students[temp_group][students[temp_group].index(temp_student)].append(0)

        path_to_evaluation_file = "{}/{}/{}/evaluation.xlsx".format(base_directory, project.owner, project.project)
        evaluation_workbook = openpyxl.load_workbook(path_to_evaluation_file)
        evaluation_worksheet = evaluation_workbook['eva']
        meta_worksheet = evaluation_workbook['meta']
        list_of_eva = select_by_col_name('eva_name', evaluation_worksheet)
        set_of_eva = set(list_of_eva)
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
                    if (key != "group_id") and (key != "eva_name") and (key != "owner") and (key != "date") and (
                            key != "students") and (key != "last_updates"):
                        if (value is not None) and (value != " ") and (value != ""):
                            meta = [x[0] for x in list(total.items()) if eva_row["group_id"] in x[1]][0]
                            choosen[meta].add(eva_row["group_id"])
                            notchoosen[meta].discard(eva_row["group_id"])
            for meta in set_of_meta:
                for choosen_i in choosen[meta]:
                    all_groups_choosen.add(choosen_i)
                for notchoosen_j in notchoosen[meta]:
                    all_groups_not_choosen.add(notchoosen_j)
                for all_k in total[meta]:
                    all_groups.add(all_k)
            dic_of_choosen[eva] = [choosen, notchoosen, total, all_groups_choosen, all_groups_not_choosen, all_groups]
        listOfGroups = dic_of_choosen[evaluation_name][0][metaid]
        listOfGroupss = []
        if listOfGroups == set():
            listOfGroups = listOfGroupss
        else:
            for i in listOfGroups:
                listOfGroupss.append(i)
            listOfGroups=listOfGroupss
        return render_template("evaluation_page.html", project=project, json_data=json_data, group=group, metaid=metaid,
                               group_col=group_col, set_of_meta=set_of_meta, msg=msg, evaluation_name=evaluation_name,
                               edit_data=eva_to_edit, owner_list=owner_list, students=students,
                               current_user=current_user.username,
                               active_tab_tuple=active_tab_tuple,
                               listOfGroups = listOfGroups)


def dumper(obj):
    try:
        return obj.toJSON()
    except:
        return obj.__dict__
@app.route(
    '/evaluation_receiver/<project_id>/<string:evaluation_name>/<string:metaid>/<string:group>/<string:owner>/<string:past_date>',
    methods=["GET", "POST"])
@login_required
def evaluation_page(project_id, evaluation_name, metaid, group, owner, past_date):
    # receive all the data and insert them into xlsx
    # group id, evaluation name, date time is constant
    row_to_insert = []
    group_id = group
    submit_type = request.form['submit_button']
    date = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    row_to_insert.append(group_id)
    row_to_insert.append(evaluation_name)
    # if edit, create a new row with owner = current user
    if submit_type == 'edit':
        row_to_insert.append(current_user.username)
    else:
        row_to_insert.append(owner)
    row_to_insert.append(date)
    student_list = request.form.getlist('student')
    if len(student_list) > 0:
        row_to_insert.append("|".join(student_list))
    else:
        row_to_insert.append(" ")

    # The rest are variables from TW
    # get project by project_id
    project = Permission.query.filter_by(project_id=project_id).first()
    path_to_load_project = "{}/{}/{}".format(base_directory, project.owner, project.project)
    myLock = FileLock(path_to_load_project+'.lock', timeout = 5)
    with myLock:
        with open("{}/TW.json".format(path_to_load_project), 'r')as f:
            json_data = json.loads(f.read(), strict=False)
    for category in json_data['category']:
        category_name = category['name']
        for section in category['section']:
            section_name = section['name']
            section_name = '{}{}|{}|{}'.format(owner, past_date, category_name, section_name)
            if section['type'] == 'radio':
                if submit_type == 'create':
                    value = request.form.get('{}|{}'.format(category_name, section['name']), " ")
                    row_to_insert.append(value)
                else:
                    value = request.form.get(section_name, " ")
                    row_to_insert.append(value)
            elif section['type'] == 'checkbox':
                if submit_type == 'create':
                    value = request.form.getlist('{}|{}'.format(category_name, section['name']))
                    if len(value) != 0:
                        value = '|'.join(value)
                    else:
                        value = " "
                    row_to_insert.append(value)
                else:
                    value = request.form.getlist(section_name)
                    if len(value) != 0:
                        value = '|'.join(value)
                    else:
                        value = " "
                    row_to_insert.append(value)
            else:
                # text don't need to be saved
                print('to be continued')
    path_to_evaluation_file = "{}/evaluation.xlsx".format(path_to_load_project)
    excelLock = FileLock(path_to_evaluation_file + '.lock', timeout=5)
    with excelLock:
        evaluation_workbook = load_workbook(path_to_evaluation_file)
        evaluation_worksheet = evaluation_workbook['eva']
        # change the last update by append the current user according to submit type
        if submit_type == 'update':
            index = int(
                select_index_by_group_eva_owner_date(evaluation_name, group_id, owner, past_date, evaluation_worksheet))
            # delete the old row by index
            last_comment = select_by_col_name('comment', evaluation_worksheet)[index - 2]
            comment = request.form.get('{}{}|comment'.format(owner, past_date), " ")
            if comment != " " and last_comment != " ":
                comment = "{}|{}".format(last_comment, comment)
            else:
                comment = last_comment
            row_to_insert.append(comment)
            last_update = select_by_col_name('last_updates', evaluation_worksheet)[index - 2]
            row_to_insert.append(last_update)
            evaluation_worksheet.delete_rows(index, 1)
            evaluation_worksheet.append(row_to_insert)

        elif submit_type == 'create':
            comment = request.form.get('comment', " ")
            row_to_insert.append(comment)
            last_update = current_user.username
            row_to_insert.append(last_update)
            evaluation_worksheet.append(row_to_insert)

        elif submit_type == 'edit':
            comment = request.form.get('{}{}|comment'.format(owner, past_date), " ")
            row_to_insert.append(comment)
            last_update = current_user.username
            row_to_insert.append(last_update)
            evaluation_worksheet.append(row_to_insert)
        elif submit_type == 'overwrite':
            index = int(
                select_index_by_group_eva_owner_date(evaluation_name, group_id, owner, past_date, evaluation_worksheet))
            last_comment = select_by_col_name('comment', evaluation_worksheet)[index - 2]
            comment = request.form.get('{}{}|comment'.format(owner, past_date), " ")
            if comment != " " and last_comment != " ":
                comment = "{}|{}".format(last_comment, comment)
            else:
                comment = last_comment
            row_to_insert.append(comment)
            last_update = select_by_col_name('last_updates', evaluation_worksheet)[index - 2]
            last_update = "{}|{}".format(last_update, current_user.username)
            row_to_insert.append(last_update)
            evaluation_worksheet.delete_rows(index, 1)
            evaluation_worksheet.append(row_to_insert)

        # save the workbook
        evaluation_workbook.save(path_to_evaluation_file)

        # change the last edit
        evaluation_in_database = Evaluation.query.filter_by(project_name=project.project, project_owner=project.owner,
                                                            eva_name=evaluation_name).first()
        evaluation_in_database.last_edit = current_user.username
        db.session.commit()
        msg = "The grade has been updated successfully"

        return redirect(
            url_for('jump_to_evaluation_page', project_id=project_id, evaluation_name=evaluation_name, metaid=metaid,
                    group=group, owner=owner, msg=msg))


@app.route(
    '/evaluation_commit/<project_id>/<string:evaluation_name>/<string:metaid>/<string:group>/<string:owner>/<string:past_date>/<string:category>',
    methods=["POST"])
@login_required
def evaluation_commit(project_id, evaluation_name, metaid, group, owner, past_date, category):
    try:
        # receive all the data and insert them into xlsx
        # group id, evaluation name, date time is constant
        row_to_insert = []
        group_id = group
        #date = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        # The rest are variables from TW
        # get project by project_id
        project = Permission.query.filter_by(project_id=project_id).first()
        path_to_load_project = "{}/{}/{}".format(base_directory, project.owner, project.project)
        myLock = FileLock(path_to_load_project+'.lock', timeout = 5)
        with myLock:
            with open("{}/TW.json".format(path_to_load_project), 'r')as f:
                json_data = json.loads(f.read(), strict=False)
        category_to_commit = [x for x in json_data['category'] if x['name'] == category][0]
        category_name = category_to_commit['name']
        for section in category_to_commit['section']:
            section_name = section['name']
            section_name = '{}{}|{}|{}'.format(owner, past_date, category_name, section_name)
            if section['type'] == 'radio':
                value = request.form.get(section_name, " ")
                row_to_insert.append(value)
            elif section['type'] == 'checkbox':
                value = request.form.getlist(section_name)
                if len(value) != 0:
                    value = '|'.join(value)
                else:
                    value = " "
                row_to_insert.append(value)
            else:
                # text don't need to be saved
                print('to be continued')
        path_to_evaluation_file = "{}/evaluation.xlsx".format(path_to_load_project)
        excelLock = FileLock(path_to_evaluation_file + '.lock', timeout=5)
        with excelLock:
            evaluation_workbook = load_workbook(path_to_evaluation_file)
            evaluation_worksheet = evaluation_workbook['eva']
            # change the last update by append the current user according to submit type

            index = int(
                select_index_by_group_eva_owner_date(evaluation_name, group_id, owner, past_date, evaluation_worksheet))

            last_update = select_by_col_name('last_updates', evaluation_worksheet)[index - 2]
            if last_update != current_user.username:
                last_update = "{}|{}".format(last_update, current_user.username)
            # count the index of category
            # 1,2,3 unchanged
            #evaluation_worksheet.cell(index, 4).value = date
            start_point = 6 + (list(x['name'] for x in json_data['category']).index(category))*len(row_to_insert)

            for i in range(0, len(row_to_insert)):
                # f.write(str(index) + " " + str(i) + str(row_to_insert[i]) + '\n')
                evaluation_worksheet.cell(index, start_point + i).value = row_to_insert[i]


            # save the workbook
            evaluation_workbook.save(path_to_evaluation_file)

            # change the last edit
            evaluation_in_database = Evaluation.query.filter_by(project_name=project.project, project_owner=project.owner,
                                                                eva_name=evaluation_name).first()
            evaluation_in_database.last_edit = current_user.username
            db.session.commit()
            msg = "The grade has been updated successfully"

            return jsonify({'success': 'success'})
    except Exception as e:
        return jsonify({'error': e})

@app.route(
    '/attendence_commit/<project_id>/<string:evaluation_name>/<string:metaid>/<string:group>',
    methods=["POST"])
@login_required
def attendence_commit(project_id, evaluation_name, metaid, group):
    project = Permission.query.filter_by(project_id=project_id).first()
    path_to_load_project = "{}/{}/{}".format(base_directory, project.owner, project.project)
    path_to_evaluation_file = "{}/evaluation.xlsx".format(path_to_load_project)
    attendence = request.form.getlist("student")
    if len(attendence) != 0:
        attendence_string = "|".join(attendence)
    else:
        attendence_string = " "
    excelLock = FileLock(path_to_evaluation_file + '.lock', timeout=5)
    with excelLock:
        evaluation_workbook = load_workbook(path_to_evaluation_file)
        evaluation_worksheet = evaluation_workbook['eva']
        # change the last update by append the current user according to submit type

        #change attendency in every row which belongs to that group
        list_of_index = select_index_by_group_eva(evaluation_name, group, evaluation_worksheet)
        for index in list_of_index:
            evaluation_worksheet.cell(index, 5).value = attendence_string

        # save the workbook
        evaluation_workbook.save(path_to_evaluation_file)

        # change the last edit
        evaluation_in_database = Evaluation.query.filter_by(project_name=project.project, project_owner=project.owner,
                                                            eva_name=evaluation_name).first()
        evaluation_in_database.last_edit = current_user.username
        db.session.commit()
        msg = "The grade has been updated successfully"

        return jsonify({'success': 'success'})

@app.route('/download_page/<string:project_id>/<string:evaluation_name>/<string:group>/<string:type>/<string:show_score>',
           methods=['GET', 'POST'])
@login_required
# send all grades in the given evaluation
def download_page(project_id, evaluation_name, group, type, show_score):
    """
    Creating an grade report on top of the download_page.html template, it is used in sendEmail function to create grade
    reports for each group
    :param project_id: current project id
    :param evaluation_name: current name of evaluation
    :param group: current group id
    :param type:
    :param show_score: whether or not displaying the score
    :return: creating a html grade report
    """
    # get project by project_id
    project = Permission.query.filter_by(project_id=project_id).first()
    path_to_load_project = "{}/{}/{}".format(base_directory, project.owner, project.project)
    path_to_evaluation_file = "{}/evaluation.xlsx".format(path_to_load_project)
    eva_workbook = load_workbook(path_to_evaluation_file)
    group_worksheet = eva_workbook['group']
    eva_worksheet = eva_workbook['eva']
    students_worksheet = eva_workbook['students']
    myLock = FileLock(path_to_load_project+'.lock', timeout = 5)
    with myLock:
        with open("{}/TW.json".format(path_to_load_project), 'r')as f:
            json_data = json.loads(f.read(), strict=False)
    if type == "normal":
        temp_eva = select_row_by_group_id("eva_name", evaluation_name, eva_worksheet)
        temp_eva_in_group = [x for x in temp_eva if x['group_id'] == group]

        students_in_one_group = get_students_by_group(group_worksheet, students_worksheet)[group]
        msg = "Downloaded grade group{}".format(group)

        return render_template("download_page.html", project=project, json_data=json_data, group=group, msg=msg,
                               evaluation_name=evaluation_name, students=students_in_one_group,
                               grades=temp_eva_in_group, show_score=show_score)


# download xlsx file or html file
@app.route('/download/<string:project_id>/<string:evaluation_name>/<string:current_time>', methods=['GET', 'POST'])
@login_required
def download(project_id, evaluation_name, current_time):
    project = Permission.query.filter_by(project_id=project_id).first()
    path_to_load_project = "{}/{}/{}".format(base_directory, current_user.username, project.project)
    path_to_evaluation_file = "{}/evaluation.xlsx".format(path_to_load_project)
    eva_workbook = load_workbook(path_to_evaluation_file)
    group_worksheet = eva_workbook['group']
    eva_worksheet = eva_workbook['eva']
    students_worksheet = eva_workbook['students']
    students = get_students_by_group(group_worksheet, students_worksheet)
    myLock = FileLock(path_to_load_project+'.lock', timeout = 5)
    with myLock:
        with open("{}/TW.json".format(path_to_load_project), 'r')as f:
            json_data = json.loads(f.read(), strict=False)
    group_col = []
    for col_item in list(group_worksheet.iter_cols())[0]:
        if col_item.value != "groupid":
            group_col.append(col_item.value)
    filename = "{}_{}_{}.xlsx".format(project.project, evaluation_name, current_time)
    if evaluation_name == "all_eva":
        try:
            return send_file(path_to_evaluation_file, attachment_filename=filename, as_attachment=True)
            # msg = "Successfully downloaded"
            # return redirect(url_for("project_profile_jumptool", project_id=project_id, msg=msg))
        except Exception as e:
            print(str(e))
    else:
        # response = urllib.request.urlopen(url_for('jump_to_evaluation_page', project_name=project_name, evaluation_name=evaluation_name))
        # html = response.read()
        # print(html)
        new_row = {}
        first_row = list(eva_worksheet.iter_rows())[0]
        for tag in first_row:
            new_row[tag.value] = ""
        # grab the data that used for this evaluation
        owner = request.form['owner']
        temp_eva = select_row_by_group_id("eva_name", evaluation_name, eva_worksheet)
        eva_to_edit = {}
        for group in group_col:
            for row in temp_eva:
                if str(group) == str(row['group_id']) and str(owner) == str(row['owner']):
                    eva_to_edit[str(group)] = row
        # store the data to a html file and send out(download)
        msg = ""
        path_to_html = "{}/{}_{}.html".format(path_to_load_project, project.project, evaluation_name)
        # remove the old file in case duplicated file existence
        if os.path.exists(path_to_html):
            os.remove(path_to_html)
        myLock = FileLock(path_to_html+'.lock', timeout = 5)
        with myLock:
            with open(path_to_html, 'w') as f:
                f.write(render_template("evaluation_page.html", project=project, json_data=json_data, group_col=group_col,
                                        msg=msg, evaluation_name=evaluation_name, edit_data=eva_to_edit, owner=owner,
                                        students=students))
        return send_file(path_to_html, as_attachment=True)

@app.route('/downloadRubric/<string:type>/<string:name>/<string:owner>', methods= ['GET', 'POST'])
@login_required
def downloadRubric(type, name, owner):
    if type == "default":
        path_to_default_json = "{}/{}/{}".format(home_directory, "Default", name)
        return send_file(path_to_default_json, attachment_filename=name, as_attachment=True)

# def jump_to_evaluation_page(project_id, evaluation_name, group, msg):
@app.route('/sendEmail/<string:project_id>/<string:evaluation_name>/<string:show_score>', methods=['GET', 'POST'])
@login_required
def sendEmail(project_id, evaluation_name, show_score):
    """
    This function sends emails to students, part of it uses threadpool to accelerate the process, parameters are passed
    from project_profile.html
    :param project_id: current project's id, it is used to locate the current project in Permission table
    :param evaluation_name: current evaluation name
    :param show_score: a option which user can choose to send out the grade report with scores displayed or not
    :return: return to current page
    """
    project = Permission.query.filter_by(project_id=project_id).first()
    path_to_load_project = "{}/{}/{}".format(base_directory, project.owner, project.project)
    path_to_evaluation_file = "{}/evaluation.xlsx".format(path_to_load_project)
    eva_workbook = load_workbook(path_to_evaluation_file)
    group_worksheet = eva_workbook['group']
    eva_worksheet = eva_workbook['eva']
    students_worksheet = eva_workbook['students']
    with open("{}/TW.json".format(path_to_load_project), 'r')as f:
        json_data = json.loads(f.read(), strict=False)
    # data of groups

    group_col = []
    for col_item in list(group_worksheet.iter_cols())[0]:
        if col_item.value != "groupid":
            group_col.append(col_item.value)
    from_email = "Rubric@uiowa.edu"
    students_emails = select_by_col_name("Email", students_worksheet)
    total_num_of_email = len(students_emails)


    record_existence = EmailSendingRecord.query.filter_by(project_name=project.project,
                                    project_owner=current_user.username, eva_name=evaluation_name).first()
    if record_existence is None:
        new_record = EmailSendingRecord(project_name=project.project,
                                        project_owner=current_user.username,
                                        eva_name=evaluation_name)
        db.session.add(new_record)
        db.session.commit()
    current_record = EmailSendingRecord.query.filter_by(project_name=project.project,
                                                        project_owner=current_user.username,
                                                        eva_name=evaluation_name).first()
    current_record.num_of_finished_tasks = 0
    current_record.num_of_tasks = total_num_of_email
    db.session.commit()
    # Tried to add the process of building up htmls into threadpool, failed.
    # with ThreadPoolExecutor(max_workers=10) as executor_building_html:
    #     for group in group_col:
    #         students_email = select_students_by_group(group, group_worksheet)
    #         # grade_of_group = select_row_by_group_id(group)
    #         # students_in_one_group = get_students_by_group(group_worksheet, students_worksheet)
    #         # load download_page.html and store it to 'part' which will be attached to message in mail
    #         file_name = "{}_{}_{}.html".format(project.project, evaluation_name, group)
    #         path_to_html = "{}/{}".format(path_to_load_project, file_name)
    #         if os.path.exists(path_to_html):
    #             os.remove(path_to_html)
    #         with open(path_to_html, 'w') as f:
    #             executor_building_html.submit(f.write(download_page(project.project_id, evaluation_name, group, "normal", show_score)))
    #
    # with ThreadPoolExecutor(max_workers=10) as executor_sending:
    #     for group in group_col:
    #         students_email = select_students_by_group(group, group_worksheet)
    #         file_name = "{}_{}_{}.html".format(project.project, evaluation_name, group)
    #         path_to_html = "{}/{}".format(path_to_load_project, file_name)
    #         if os.path.exists(path_to_html):
    #             os.remove(path_to_html)
    #         task_status = executor_sending.submit(send_emails_to_students, group, project, evaluation_name, from_email,
    #                                               path_to_html, students_email, current_record)

    with ThreadPoolExecutor(max_workers=10) as executor_sending:
        for group in group_col:
            students_email = select_students_by_group(group, group_worksheet)
            file_name = "{}_{}_{}.html".format(project.project, evaluation_name, group)
            path_to_html = "{}/{}".format(path_to_load_project, file_name)
            if os.path.exists(path_to_html):
                os.remove(path_to_html)
            with open(path_to_html, 'w') as f:
                f.write(download_page(project.project_id, evaluation_name, group, "normal", show_score))

            task_status = executor_sending.submit(send_emails_to_students, group, project, evaluation_name, from_email, path_to_html, students_email, current_record)
    db.session.commit()
    return redirect(url_for('project_profile', project_id=project_id, msg=ManageProjectMessages.NoMessage.path))
    # we expect no response from the server
    # return redirect(url_for('project_profile', project_id=project_id, msg=msg))


def send_emails_to_students(group, project, evaluation_name, from_email, path_to_html, students_email, current_record):
    """
    It was extracted from "sendEmail" function so that threadpool can be easily applied, it interacts with the server
    and send out emails, and it prints debugging messages at last
    :param group: current group name
    :param project: current project name
    :param evaluation_name: current evaluation name
    :param from_email: defined in sendEmail function
    :param path_to_html: it points to the grade report html file of the current group, all group memebers share the same
    html grade report
    :param students_email: a list of emails of students in current group
    :param current_record: sending record (row) in the EmailSendingRecord database, contains three parameters
    :return: X
    """
    subject = "grade: project{}, evaluation{}, group{}".format(project.project, evaluation_name, group)
    try:
        index = 0;
        for email in students_email:
            # create an instance of message
            if email is not None:
                subject += str(index)
                index += 1
                myLock = FileLock(path_to_html+'.lock')
                with open(path_to_html, "r") as file_to_html:
                    subprocess.call(["mail", "-s", subject, "-r", from_email, "-a", path_to_html, email])
                    dateTimeObj = datetime.datetime.now()
                    timestampStr = dateTimeObj.strftime("%d-%b-%Y (%H:%M:%S.%f)")
                    current_record.num_of_finished_tasks += 1
                    print("Sent the email to " + email + " at " + timestampStr)
    except Exception as e:
        print('Something went wrong' + str(e))
        msg = ""
        msg += str(e)
        msg += "\n"
        # remove the html file after sending email
        # in case of duplicated file existence
    print("Number of finished tasks is: " + str(current_record.num_of_finished_tasks))
    print("sent to email: " + current_record.last_email)
    if os.path.exists(path_to_html):
        os.remove(path_to_html)
        # if os.path.exists(path_to_pdf):
        #    os.remove(path_to_pdf)
    # return redirect(url_for('project_profile', project_id=project_id, msg="success"))
    # db.session.commit()


@app.route('/account/<string:msg>', methods=['GET', 'POST'])
@login_required
def account(msg):
    #if msg is success, msg = ""
    if msg == "success":
        msg = ""

    #load default json files
    json_list = DefaultRubric.query.all()
    json_data_of_all_default_rubric = {}
    for json_file in json_list:
        path_to_this_json = "{}/{}/{}".format(home_directory, "Default", json_file.json_name)
        with open(path_to_this_json, 'r') as file:
            json_data_of_current_json_file = json.loads(file.read(), strict=False)
        json_data_of_all_default_rubric[json_file.json_name] = json_data_of_current_json_file
    return render_template('account.html', msg=msg, default_json_list=json_list, json_data_of_all_default_rubric=json_data_of_all_default_rubric)


@app.route('/search_project', methods=['POST'])
@login_required
def search_project():
    """
    In the account.html, user will active this function when they search rubric by rubric name
    :return: a list of rubric that has the typed name
    """
# flag_project = True
    #load default json files
    json_list = DefaultRubric.query.all()
    json_data_of_all_default_rubric = {}
    for json_file in json_list:
        path_to_this_json = "{}/{}/{}".format(home_directory, "Default", json_file.json_name)
        with open(path_to_this_json, 'r') as file:
            json_data_of_current_json_file = json.loads(file.read(), strict=False)
        json_data_of_all_default_rubric[json_file.json_name] = json_data_of_current_json_file

    #search project
    project_name = request.form.get('project_name')
    project_items = Project.query.filter_by(project_name = project_name).first()
    if project_items:
        list_of_project = Project.query.filter_by(project_name=project_name).all()
        json_data_of_all_project = {}
        for project in list_of_project:
            path_to_this_project_json = "{}/{}/{}/TW.json".format(base_directory, project.owner, project.project_name)
            with open(path_to_this_project_json, 'r') as file:
                json_data_of_curr_project = json.loads(file.read(), strict=False)
            json_data_of_all_project[project.project_name + project.owner] = json_data_of_curr_project
        return render_template('account.html', msg="", list_of_projects = list_of_project, json_data = json_data_of_all_project, default_json_list=json_list, json_data_of_all_default_rubric=json_data_of_all_default_rubric)
    else:
        return render_template('account.html', msg="can't find this rubirc", project_name=project_name)


@app.route('/search_account', methods=['GET', 'POST'])
@login_required
def search_account():
    """
    search by username
    :return: a list of project the user has
    """
    #load default json files
    json_list = DefaultRubric.query.all()
    json_data_of_all_default_rubric = {}
    for json_file in json_list:
        path_to_this_json = "{}/{}/{}".format(home_directory, "Default", json_file.json_name)
        with open(path_to_this_json, 'r') as file:
            json_data_of_current_json_file = json.loads(file.read(), strict=False)
        json_data_of_all_default_rubric[json_file.json_name] = json_data_of_current_json_file

    #search by account
    account_username = request.form.get('account_username')
    account_user = User.query.filter_by(username=account_username).first()
    if account_user is not None:
        list_of_all_projects = Permission.query.filter_by(shareTo=account_username).all()
        list_of_personal_projects = Permission.query.filter_by(owner=account_username,
                                                               shareTo=account_username).all()
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
        # load json data
        json_data = {}
        project_eva = {}
        for personal_project in list_of_personal_projects:
            project_in_project_db = Project.query.filter_by(project_name=personal_project.project,
                                                            owner=personal_project.owner).first()
            list_of_personal_project_database[project_in_project_db.project_name] = project_in_project_db
            evaluations = Evaluation.query.filter_by(project_name=personal_project.project).all()
            evaluations_names = [x.eva_name for x in evaluations]
            project_eva[personal_project.project] = evaluations_names
            path_to_this_project_json = "{}/{}/{}/TW.json".format(base_directory, personal_project.owner, personal_project.project)
            json_data[personal_project.project_id] = {}
            myLock = FileLock(path_to_this_project_json+'.lock', timeout = 5)
            with myLock:
                with open(path_to_this_project_json, 'r')as f:
                    this_json_data = json.loads(f.read(), strict=False)
                    json_data [personal_project.project_id] = this_json_data
        for shared_project in list_of_shared_project:
            project_in_project_db = Project.query.filter_by(project_name=shared_project.project,
                                                            owner=shared_project.owner).first()
            list_of_shared_project_database[project_in_project_db.project_name] = project_in_project_db
            evaluations = Evaluation.query.filter_by(project_name=personal_project.project).all()
            evaluations_names = [x.eva_name for x in evaluations]
            project_eva[personal_project.project] = evaluations_names
            json_data[shared_project.project_id] = {}
            path_to_this_project_json = "{}/{}/{}/TW.json".format(base_directory, shared_project.owner, shared_project.project)
            myLock = FileLock(path_to_this_project_json+'.lock', timeout = 5)
            with myLock:
                with open(path_to_this_project_json, 'r')as f:
                    this_json_data = json.loads(f.read(), strict=False)
                    json_data [shared_project.project_id] = this_json_data
        return render_template('account.html', msg="", personal_project_list=list_of_personal_projects,
                           shared_project_list=list_of_shared_project,
                           list_of_personal_project_database=list_of_personal_project_database,
                           list_of_shared_project_database=list_of_shared_project_database, project_eva=project_eva, json_data=json_data, default_json_list=json_list, json_data_of_all_default_rubric=json_data_of_all_default_rubric, flag_2=False)
    else:
        msg = "Can't find this user"
        return render_template('account.html', msg=msg)


@app.route('/notification_receiver/<string:notification_id>', methods=['GET', 'POST'])
@login_required
def notification_receiver(notification_id):
    response = request.form['response']
    notification = Notification.query.filter_by(notification_id=notification_id).first()
    permission = Permission.query.filter_by(project_id=notification.appendix).first()
    authority = permission.status.split('|')[1]
    if response == 'Decline':
        db.session.delete(permission)
        db.session.commit()
    else:
        permission.status = authority
        db.session.commit()
    notification.status = 'read'
    db.session.commit()
    return redirect(url_for('account'))


@app.route('/student_dashboard')
@login_required
def student_dashboard():
    return render_template('student_dashboard.html', name=current_user.username)


@app.route('/logout')
@login_required
def logout():
    session.pop("user", None)
    logout_user()
    return redirect(url_for('index'))