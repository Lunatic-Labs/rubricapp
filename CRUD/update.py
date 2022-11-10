from core import *
from functions import *
from migrations import *
from objects import *

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
