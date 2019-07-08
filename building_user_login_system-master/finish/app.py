from flask import Flask, render_template, redirect, url_for, request
from flask_bootstrap import Bootstrap
from flask_wtf import FlaskForm 
from wtforms import StringField, PasswordField, BooleanField
from flask_wtf.file import FileField, FileAllowed, FileRequired
from wtforms.validators import InputRequired, Email, Length
from flask_sqlalchemy  import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
# from flask.ext.uploads import UploadSet, JSON,
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
import os
import openpyxl
from openpyxl import load_workbook
from _datetime import datetime
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'Thisissupposedtobesecret!'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///C:/Users/bell7/account.db'
bootstrap = Bootstrap(app)
db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'


# Settings of Directory ======================================================================================================

#SET THE BASE DIRECTORY
os.chdir('D:/EDUsample/Accounts')
base_directory = os.getcwd()

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(15), unique=True)
    email = db.Column(db.String(50), unique=True)
    instructor = db.Column(db.String(2))
    password = db.Column(db.String(80))

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class LoginForm(FlaskForm):
    username = StringField('username', validators=[InputRequired(), Length(min=4, max=15)])
    password = PasswordField('password', validators=[InputRequired(), Length(min=8, max=80)])
    remember = BooleanField('remember me')

class RegisterForm(FlaskForm):
    email = StringField('email', validators=[InputRequired(), Email(message='Invalid email'), Length(max=50)])
    username = StringField('username', validators=[InputRequired(), Length(min=4, max=15)])
    password = PasswordField('password', validators=[InputRequired(), Length(min=8, max=80)])
    instructor = BooleanField('instructor')

class ProjectForm(FlaskForm):
    project_name = StringField('project name', validators=[InputRequired(), Length(min=3, max=10)])
    # group_file = FileField('group file',validators = [FileRequired(),FileAllowed(JSON, 'Json only')]
    group_file = FileField('group file')
    grading_criteria = FileField('grading criteria')

class EvaluationForm(FlaskForm):
    evaluation_name = StringField('evaluation name', validators=[InputRequired(), Length(min=3, max=10)])

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()

    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user:
            if check_password_hash(user.password, form.password.data):
                login_user(user, remember=form.remember.data)
                # instructor jump to instructor page, student jump to student page
                if(user.instructor == "1"):
                    return redirect(url_for('instructor_dashboard'))
                else:
                    return redirect(url_for('student_dashboard'))

        return '<h1>Invalid username or password</h1>'
        #return '<h1>' + form.username.data + ' ' + form.password.data + '</h1>'

    return render_template('login.html', form=form)

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    form = RegisterForm()

    if form.validate_on_submit():
        hashed_password = generate_password_hash(form.password.data, method='sha256')
        new_user = User(username=form.username.data, email=form.email.data, password=hashed_password, instructor=form.instructor.data)
        db.session.add(new_user)
        db.session.commit()

        #After making sure that the new user is created, the user's private folder can be created by using the user name

        path_to_user_folder = "{}/{}".format(base_directory, new_user.username)
        os.mkdir(path_to_user_folder)

        return '<h1>New user has been created!</h1>'
        #return '<h1>' + form.username.data + ' ' + form.email.data + ' ' + form.password.data + '</h1>'

    return render_template('signup.html', form=form)

@app.route('/instructor_dashboard')
@login_required
def instructor_dashboard():
    #Load all projects to instructor_dashboard
    #Find all projects in User's private folder by using current user

    path_to_current_user = "{}/{}".format(base_directory, current_user.username)
    project_list = []
    for project in os.listdir(path_to_current_user):
        project_list.append(project)
    project_len = len(project_list)

    return render_template('instructor_dashboard.html', name=current_user.username, project_list=project_list, project_len = project_len)

@app.route('/instructor_project', methods=["POST","GET"])
@login_required
def instructor_project():
    #Load All project to instructor_project
    #Add a 'create new project' button
    path_to_current_user = "{}/{}".format(base_directory, current_user.username)
    project_list = []
    for project in os.listdir(path_to_current_user):
        project_list.append(project)
    project_len = len(project_list)


    return render_template('instructor_project.html', project_list = project_list, project_len = project_len)

@app.route('/create_project', methods=["POST","GET"])
@login_required
def create_project():
    #Request from file by WTF
    #Create a new project folder under 'path_to_current_user'
    #save files in new folder and build a evaluation doc depending on json file
    form = ProjectForm()

    if form.validate_on_submit():
        #create project folder
        path_to_current_user_project = "{}/{}/{}".format(base_directory, current_user.username, form.project_name.data)
        os.mkdir(path_to_current_user_project)
        #save group file and grading criteria
        path_to_file_stored = "{}/".format(path_to_current_user_project)
        group_file_filename = "group.xlsx"
        form.group_file.data.save(path_to_file_stored + group_file_filename)
        grading_criteria_filename = "json.json"
        form.grading_criteria.data.save(path_to_file_stored + grading_criteria_filename)
        #creating evaluation doc based on grading criteria json file

        #copy group sheet to evaluation doc
        path_to_group_file = "{}/group.xlsx".format(path_to_current_user_project)
        group_file_workbook = load_workbook(path_to_group_file)
        group_file_worksheet = group_file_workbook['Sheet1']
        path_to_evaluation = "{}/evaluation.xlsx".format(path_to_current_user_project)
        evaluation_workbook = openpyxl.Workbook()
        evaluation_group = evaluation_workbook.create_sheet('group')
        copy_all_worksheet(evaluation_group, group_file_worksheet)
        #create EVA depending on the json file
        evaluation_eva = evaluation_workbook.create_sheet('eva')
        #open json file and load json
        path_to_json_file="{}/json.json".format(path_to_current_user_project)
        with open(path_to_json_file, 'r')as f:
            json_data = json.loads(f.read(), strict=False)
        # The group id, eva_name, date are defults
        tags_to_append = ['group_id', 'eva_name', 'date']
        for category in json_data['category']:
            category_name = (category['name'])
            for value in category:
                if value != "name":
                    value_to_append = "{}|{}".format(category_name, value)
                    tags_to_append.append(value_to_append)
        evaluation_eva.append(tags_to_append)

        evaluation_workbook.save(path_to_evaluation)

        return redirect(url_for("instructor_project"))



    return render_template('create_project.html', form = form)


def copy_all_worksheet(copy_to, copy_from):
    for row in range(0, len(list(copy_from.iter_rows()))):
        for col in range(0, len(list(copy_from.iter_cols()))):
            copy_to.cell(row=row+1, column=col+1).value = copy_from.cell(row=row+1, column=col+1).value

@app.route('/load_project/<string:project_name>',methods=["GET"])
@login_required
def load_project(project_name, msg=""):
    path_to_evaluation_xlsx = "{}/{}/{}/evaluation.xlsx".format(base_directory, current_user.username, project_name)
    evaluation_workbook = openpyxl.load_workbook(path_to_evaluation_xlsx)
    evaluation_worksheet = evaluation_workbook['eva']
    list_of_eva = select_by_col_name('eva_name', evaluation_worksheet)
    set_of_eva = set(list_of_eva)
    return render_template("project.html", project_name=project_name, data_of_eva_set=set_of_eva, msg=msg)

# @app.route('/create_new_evaluation/<string:project_name>')
# @login_required
# def create_new_evaluation(project_name):
#     return render_template('create_new_evaluation.html', project_name=project_name)

@app.route('/create_evaluation/<string:project_name>', methods=['GET', 'POST'])
@login_required
def create_evaluation(project_name):
    #load group columns and evaluation worksheet
    evaluation_name = request.form['evaluation_name']
    path_to_load_project = "{}/{}/{}".format(base_directory, current_user.username, project_name)
    path_to_evaluation_file = "{}/evaluation.xlsx".format(path_to_load_project)
    eva_workbook = load_workbook(path_to_evaluation_file)
    group_worksheet = eva_workbook['group']
    eva_worksheet = eva_workbook['eva']

    group_col = []
    for col_item in list(group_worksheet.iter_cols())[0]:
        if col_item.value != "groupid":
            group_col.append(col_item.value)

    #create a empty row for each group in the new evaluation
    for group in group_col:
        row_to_insert = new_row_generator(str(group), evaluation_name, eva_worksheet)
        print(row_to_insert)
        eva_worksheet.append(row_to_insert)
    eva_workbook.save(path_to_evaluation_file)
    msg = "New Evaluation has been created successfully"
    return redirect(url_for('jump_to_evaluation_page', project_name=project_name, evaluation_name=evaluation_name, msg=msg))

@app.route('/jump_to_evaluation_page/<string:project_name>/<string:evaluation_name>', methods=["GET", "POST"])
@login_required
def jump_to_evaluation_page(project_name, evaluation_name, msg=""):
    #prepare the json data and group numbers before it jumps to evaluation page
    path_to_load_project = "{}/{}/{}".format(base_directory, current_user.username, project_name)
    with open ("{}/json.json".format(path_to_load_project), 'r')as f:
        json_data = json.loads(f.read(), strict=False)
    eva_workbook = load_workbook("{}/evaluation.xlsx".format(path_to_load_project))
    group_worksheet = eva_workbook['group']

    #data of groups
    group_col = []
    for col_item in list(group_worksheet.iter_cols())[0]:
        if col_item.value != "groupid":
            group_col.append(col_item.value)

    #check if evaluation exists in the worksheet
    eva_worksheet = eva_workbook['eva']

    #Transform ROWS in worksheet to DICTIONARY
    new_row = {}
    first_row = list(eva_worksheet.iter_rows())[0]
    for tag in first_row:
        new_row[tag.value] = ""

    temp_eva = select_row_by_group_id("eva_name", evaluation_name, eva_worksheet)
    eva_to_edit = {}
    for group in group_col:
        for row in temp_eva:
            if str(group) == str(row['group_id']):
                eva_to_edit[str(group)] = row
    return render_template("evaluation_page.html",  project_name=project_name, json_data=json_data, group_col=group_col, msg=msg, evaluation_name=evaluation_name, edit_data=eva_to_edit)



# @app.route('/evaluation_page', methods=['GET', 'POST'])
# @login_required
# def evaluation_page():
#     return render_template("evaluation_page.html")



@app.route('/evaluation_receiver/<string:project_name>/<string:evaluation_name>/<string:group_div>', methods=["GET", "POST"])
@login_required
def evaluation_page(project_name, evaluation_name, group_div):
    #receive all the data and insert them into xlsx
    #group id, evaluation name, date time is constant
    row_to_insert = []
    group_id = group_div
    date = datetime.today().strftime('%d/%m/%Y')
    row_to_insert.append(group_id)
    row_to_insert.append(evaluation_name)
    row_to_insert.append(date)
    #The rest are variables from TW
    path_to_load_project = "{}/{}/{}".format(base_directory, current_user.username, project_name)
    with open("{}/json.json".format(path_to_load_project), 'r')as f:
        json_data = json.loads(f.read(), strict=False)
    for category in json_data['category']:
        category_name = category['name']
        ratings_name = '{}|Ratings'.format(category_name)
        oc_name = '{}|Observable Characteristics'.format(category_name)
        sg_name = '{}|Suggestions'.format(category_name)
        Ratings = request.form.get(ratings_name, " ")
        row_to_insert.append(Ratings)
        Observable_Characteristics = request.form.getlist(oc_name)
        if len(Observable_Characteristics) != 0:
            Observable_Characteristics_str = ';'.join(Observable_Characteristics)
        else:
            Observable_Characteristics_str = " "
        row_to_insert.append(Observable_Characteristics_str)
        Suggestions = request.form.getlist(sg_name)
        if len(Suggestions) != 0:
            Suggestions_str = ';'.join(Suggestions)
        else:
            Suggestions_str = " "
        row_to_insert.append(Suggestions_str)


    #After everything enrolls, insert the row to evaluation worksheet
    path_to_evaluation_file = "{}/evaluation.xlsx".format(path_to_load_project)
    evaluation_workbook = load_workbook(path_to_evaluation_file)
    evaluation_worksheet = evaluation_workbook['eva']
    #detect if the evaluation exists in the table
    #if so, remove the old data
    old_eva = select_by_col_name("eva_name", evaluation_worksheet)
    if evaluation_name in old_eva:
        index = select_index_by_group_eva(evaluation_name, group_div, evaluation_worksheet)
        evaluation_worksheet.delete_rows(index, 1)
    evaluation_worksheet.append(row_to_insert)
    evaluation_workbook.save(path_to_evaluation_file)
    msg = "The grade has been updated successfully"
    return redirect( url_for('jump_to_evaluation_page', project_name=project_name, evaluation_name=evaluation_name, msg=msg) )

# @app.route('/instructor_grade/<string:project_name>', methods=['GET','POST'])
# @login_required
# def instuctor_grade(project_name):
#     path_to_evaluation_xlsx = "{}/{}/{}/evaluation.xlsx".format(base_directory, current_user.username, project_name)
#     evaluation_workbook = openpyxl.load_workbook(path_to_evaluation_xlsx)
#     evaluation_worksheet = evaluation_workbook['eva']
#     list_of_eva = select_by_col_name('eva_name', evaluation_worksheet)
#     set_of_eva = set(list_of_eva)
#     return render_template('instructor_grade.html', project_name=project_name, data_of_eva_set=set_of_eva)

# @app.route('/instructor_evaluations/<string:project_name>', methods=['GET','POST'])
# @login_required
# def instructor_evaluations(project_name):
#     path_to_evaluation_xlsx = "{}/{}/{}/evaluation.xlsx".format(base_directory, current_user.username, project_name)
#     evaluation_workbook = openpyxl.load_workbook(path_to_evaluation_xlsx)
#     evaluation_worksheet = evaluation_workbook['eva']
#     list_of_eva = select_by_col_name('eva_name', evaluation_worksheet)
#     set_of_eva = set(list_of_eva)
#     return render_template("instructor_evaluations.html", project_name=project_name, data_of_eva_set=set_of_eva)

@app.route('/SendEmail/<string:project_name>/<string:evaluation_name>', methods=['GET','POST'])
@login_required
def SendEmail(project_name, evaluation_name):
    path_to_load_project = "{}/{}/{}".format(base_directory, current_user.username, project_name)
    path_to_evaluation_file = "{}/evaluation.xlsx".format(path_to_load_project)
    eva_workbook = load_workbook(path_to_evaluation_file)
    group_worksheet = eva_workbook['group']
    eva_worksheet = eva_workbook['eva']
    # data of groups
    group_col = []
    for col_item in list(group_worksheet.iter_cols())[0]:
        if col_item.value != "groupid":
            group_col.append(col_item.value)

    list_of_eva = select_by_col_name('eva_name', eva_worksheet)
    set_of_eva = set(list_of_eva)

    #send data by group
    for group in group_col:
        students_email = select_students_by_group(group, group_worksheet)
        index_of_group = int(select_index_by_group_eva(evaluation_name, group, eva_worksheet))
        grade_map = select_map_by_index(index_of_group, group_worksheet)
        for email in students_email:
            msg = sendmail(current_user.email, current_user.password, email, "{}|{}".format(project_name, evaluation_name), str(grade_map))

    return redirect(url_for('load_project', project_name=project_name, data_of_eva_set=set_of_eva, msg=msg ))

@app.route('/student_dashboard')
@login_required
def student_dashboard():
    return render_template('student_dashboard.html', name=current_user.username)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))

def sendmail(from_email, password, to_email, subject, message):
    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(message, 'plain'))
    try:
        server = smtplib.SMTP(host='smtp-mail.outlook.com', port=587)
        server.starttls()
        server.login(from_email, password)
        server.send_message(from_email, to_email, msg.as_string())
        server.quit()
        return "successfully"
    except Exception as e:
        print('Something went wrong' + str(e))
        return "Something went wrong"

#select all elements by the column name
def select_by_col_name(col_name, worksheet):
    first_row = list(worksheet.iter_rows())[0]
    index_of_col = -1
    for variables in first_row:
        if variables.value == col_name:
            index_of_col = first_row.index(variables)
    if index_of_col == -1:
        return "col_name unmatched"
    else:
        col = list(worksheet.iter_cols())[index_of_col]
        data_by_col = []
        for data in range(1, len(col)):
            data_by_col.append(col[data].value)
        return data_by_col

#index is the row index in xsl
def select_map_by_index(index, worksheet):
    list_of_rows = list(worksheet.iter_rows())
    # row_to_return = []
    # for item in list_of_rows[index-1]:
    #     row_to_return.append(item.value)
    row_selected = list_of_rows[index-1]
    tags = list_of_rows[0]
    map_to_return = {}
    for tag_index in range(0, len(tags)):
        tag_value = tags[tag_index].value
        map_to_return[tag_value] = row_selected[tag_index].value
    print(map_to_return)
    return map_to_return

#index is the row index in xsl
def select_row_by_index(index, worksheet):
    list_of_rows = list(worksheet.iter_rows())
    row_to_return = []
    for item in list_of_rows[index-1]:
        row_to_return.append(item.value)
    return row_to_return
    
#group_id and eva_name are primary key in eva worksheet
def select_index_by_group_eva(eva_name, group_id, worksheet):
    evaluation_list = select_by_col_name("eva_name", worksheet)
    group_list = select_by_col_name("group_id", worksheet)
    for index in range(0, len(evaluation_list)):
        if evaluation_list[index] == eva_name and group_list[index] == group_id:
            return index + 2
    return "nothing find"

def select_row_by_group_id(col_name, col_value, worksheet):
    #we suppose that the return rows are multiple
    rows_selected = []
    rows_in_worksheet = list(worksheet.iter_rows())
    # index in data_by_col == index in row
    data_by_col = select_by_col_name(col_name, worksheet)
    for index_data in range(0, len(data_by_col)):
        if data_by_col[index_data] == col_value:
            map_to_append = {}
            #tranfer the item to item.value
            for item in rows_in_worksheet[index_data+1]:
                #create a map contains keys-values : like "group_id" = 1
                index_of_item = rows_in_worksheet[index_data+1].index(item)
                tag_of_item = rows_in_worksheet[0][index_of_item].value
                map_to_append[tag_of_item] = item.value
            #record each row by its group_id
            #for example : 1:{group_id = 1, date= x/y/z, eva_name = eva3, .....}.
            rows_selected.append(map_to_append)
    #if nothing matched, return the empty array;
    print(rows_selected)
    return rows_selected

#select all students in the group
#implement in group worksheet
def select_students_by_group(group, worksheet):
    students = []
    groups = select_by_col_name("groupid", worksheet)
    index_of_group = groups.index(group)+2
    row_by_index = list(worksheet.iter_rows())[index_of_group-1]
    #the first element in row_by_index is groupid
    for student in row_by_index[1:]:
        students.append(student.value)
    return students
        
#generate an empty map with group name and evaluation name
def new_map_generator(group, eva_name, worksheet):
    map_to_return = {}
    tags_of_item = list(worksheet.iter_rows())[0]
    for tag in tags_of_item:
        if tag.value == 'group_id':
            map_to_return[tag.value] = group
        elif tag.value == 'eva_name':
            map_to_return[tag.value] = eva_name
        else:
            map_to_return[tag.value] = ''

    return map_to_return
def new_row_generator(group, eva_name, worksheet):
    row_to_return =[]
    tags_of_item = list(worksheet.iter_rows())[0]
    for tag in tags_of_item:
        if tag.value == 'group_id':
            row_to_return.append(group)
        elif tag.value == 'eva_name':
            row_to_return.append(eva_name)
        elif tag.value == 'date':
            date = datetime.today().strftime('%d/%m/%Y')
            row_to_return.append(date)
        else:
            row_to_return.append(" ")
    return row_to_return
#After login===============================================================================================================================

if __name__ == '__main__':
    app.run(debug=True)
