from werkzeug.security import generate_password_hash

print(generate_password_hash('1'))
print('----------------------pbkdf2:sha256:600000$dZu8aNqdumuKOGLM$e17d597fba3f77184d38a32c08eb79b17eb5a437dcb203f9dd240f1770aa9eca------------------------------------------')
print(generate_password_hash('1'))