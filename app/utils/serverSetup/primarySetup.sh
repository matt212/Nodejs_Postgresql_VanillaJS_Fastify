sudo apt update
#Nodejs
sudo apt install nodejs
sudo apt install npm
#Postgres
sudo apt-get update
sudo apt install postgresql postgresql-contrib
sudo service postgresql restart
#Create postgres Authentication
sudo -u postgres psql postgres -c "\password postgres"
sudo service postgresql restart
#Redis-server
sudo apt install redis-server
sudo service redis-server start
#for ubunutu in windows wsl
sudo npm install -g --unsafe-perm=true --allow-root

