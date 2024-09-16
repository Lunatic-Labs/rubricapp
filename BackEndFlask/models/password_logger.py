from flask import Flask, request
from logger import Logger

app = Flask(__name__)

passwordResetLogger = Logger("passwordResetLogger", logfile="/BackEndFlask/logs/reset_passwords.log")

@app.route('/reset-password', methods=['POST'])
def reset_password():
    email=request.form.get("email")
    