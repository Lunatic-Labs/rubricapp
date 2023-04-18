from core import *
# from BackEndFlask.functions import *
# from BackEndFlask.migrations import *
# from BackEndFlask.objects import *
from functions import *
from migrations import *
from objects import *

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
