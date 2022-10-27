from core import *
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