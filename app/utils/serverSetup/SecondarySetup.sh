
#Create postgres Authentication
sudo -u postgres psql postgres -c "\password postgres"
sudo service postgresql restart
#create database
npm run createDB
#restore database 
npm run pgRestore