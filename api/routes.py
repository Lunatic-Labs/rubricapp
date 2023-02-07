from api import bp
from core import db
from flask import request
from migrations import User

@bp.route('/student', methods=["POST", "GET"])
def addStudent():
    print("/api/student POST recieved!!!")
    if request.method == "POST":
        studentName = request.form.get('studentName')
        studentEmail = request.form.get('Email')
        studentID = request.form.get('LastName')
        new_user = User(username=studentName, email=studentEmail, password=studentID, role="test", University="test",description="test" )
        db.session.add(new_user)
        db.session.commit()
        return { "POST": "success!!!"}
    return { "GET": "success!!!"}