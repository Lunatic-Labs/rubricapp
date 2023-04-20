setupEnvrionment () {
printf '=============Setup the environment=============== \n'
cd ..
sudo apt-get update
sudo add-apt-repository -y ppa:deadsnakes/ppa
sudo apt-get update
printf '====== Set python3.6 as the default for python3 ======= \n'
sudo apt-get install -y python3.6 python3-pip nginx python3.6-gdbm
sudo update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.5 1
sudo update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.6 10
sudo update-alternatives --config -y python3
pip3 install virtualenv
mkdir POGIL_DEV
cd POGIL_DEV
}
