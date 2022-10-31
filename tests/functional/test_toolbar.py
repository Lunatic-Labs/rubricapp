def test_instructor_project(client):
    routes = ["/instructor_project", "/instructor_dashboard"]
    amount_of_routes = len(routes)
    for amount_of_routes in routes:
        response = client.get(amount_of_routes)
        assert response.status_code == 200
        assert b"ELIPSS SkillBuilder" in response.data
        assert b"Projects" in response.data
        assert b"Create New Project" in response.data
        assert b"Copy Rubric" in response.data
        assert b"Manage Projects" in response.data
        assert b"Log out" in response.data