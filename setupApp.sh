setupApp () {
printf '===============Setup the Application ================== \n'
virtualenv -p python3 pogilenv
source env/bin/activate
git clone https://github.com/Lunatic-Labs/rubricapp.git
pip3 install -r requirements.txt
}
