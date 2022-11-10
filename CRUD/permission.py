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
        return redirect(url_for("project_profile", project_id=project_id, msg=ManageProjectMessages.Failed.path))\
    