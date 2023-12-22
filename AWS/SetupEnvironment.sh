setupEnvrionment () {
printf '=============Setting up the environment=============== \n'
cd ..
sudo apt update
sudo apt upgrade -y
sudo apt install -y ufw

printf '====== Installing python3 modules ======= \n'

sudo apt install -y python3
sudo apt install -y python3-pip
sudo apt install -y python3-gdbm

}
