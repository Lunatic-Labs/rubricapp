from core import create_app, app
# from BackEndFlask import create_app, app
# After login===============================================================================================================================

# this variable is expected by the wsgi server
# application = app

if __name__ == '__main__':
    # db.create_all() # only run it the first time
    #The app.run(debug = True) line is needed if we are working on our local machine
    app.run(debug=True)

    #the app.run(host="0.0.0.0") line is currently commented out and if and only when we are seting up an EC2 instance
    #app.run(host="0.0.0.0")

    # token: MFFt4RjpXNMh1c_T1AQj
