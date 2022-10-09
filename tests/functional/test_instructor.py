"""
The tests will be for the following code:

# home page
    @app.route('/instructor_dashboard')
    @login_required
    def instructor_dashboard():
        # Load all projects to instructor_dashboard
        # Find all projects in User's private folder by using current user

        path_to_current_user = "{}/{}".format(base_directory,
                                            current_user.username)
        project_list = [x.project for x in Permission.query.filter_by(
            owner=current_user.username, shareTo=current_user.username).all()]
        project_len = len(project_list)

        return render_template('instructor_dashboard.html', name=current_user.username, project_list=project_list,
                            project_len=project_len)

"""

def test_instruction_dashboard(test_client):
    """
    GIVEN a Flask application configured for testing
    WHEN the '/' page is requested (GET)
    THEN check that the response is valid
    """
    response = test_client.get('/')
    assert response.status_code == 200