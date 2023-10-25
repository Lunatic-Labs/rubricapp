setupEnvrionment () {
printf '=============Setup the environment=============== \n'

sudo apt update
sudo apt upgrade -y

printf '====== Set python3.6 as the default for python3 ======= \n'
sudo apt install -y python3 
sudo apt install -y python3-pip
sudo apt install -y nginx
sudo apt install -y python3-gdbm
}
