from core import create_app, app
# After login===============================================================================================================================

# this variable is expected by the wsgi server
# application = app

if __name__ == '__main__':
    # db.create_all() # only run it the first time
    # app.run(debug=True)
    app.run(host="0.0.0.0")

    # token: MFFt4RjpXNMh1c_T1AQj