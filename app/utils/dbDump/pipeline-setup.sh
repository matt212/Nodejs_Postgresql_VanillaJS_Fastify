apt-get update
apt-get install -y postgresql-client
pg_isready -h 127.0.0.1 -p 5432
npm i -g yarn
yarn createDB
yarn pgRestore
yarn
yarn test