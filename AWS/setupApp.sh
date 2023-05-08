setupApp () {
printf '===============Setup the Application ================== \n'
virtualenv -p python3 pogilenv
source pogilenv/bin/activate
git clone https://github.com/Lunatic-Labs/rubricapp.git
cd rubricapp
cd BackEndFlask
pip3 install -r requirements.txt
cd ..
}
