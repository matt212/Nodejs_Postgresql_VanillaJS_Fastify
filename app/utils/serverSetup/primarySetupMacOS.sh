#!/bin/bash

echo "Updating Homebrew..."
brew update

echo "Installing Node.js (includes npm)..."
brew install node

echo "Installing PostgreSQL..."
brew install postgresql@17

echo "Starting PostgreSQL..."
brew services start postgresql@17

echo "Waiting for PostgreSQL to start..."
sleep 5

echo "Checking if 'postgres' role exists..."

if psql postgres -tAc "SELECT 1 FROM pg_roles WHERE rolname='postgres';" | grep -q 1; then
    echo "Role 'postgres' already exists."
else
    echo "Creating 'postgres' superuser role..."
    createuser -s postgres
fi

echo "Setting password for 'postgres' role..."

psql postgres -c "ALTER USER postgres PASSWORD 'postgres';"

echo "Restarting PostgreSQL..."
brew services restart postgresql@17

echo "Installing Redis..."
brew install redis

echo "Installing Redis-stack..."
brew trust redis-stack/redis-stack
brew install redis-stack

echo "Starting Redis..."
brew services start redis

echo ""
echo "Installation Complete!"

echo ""
echo "Versions:"
node -v
npm -v
psql --version
redis-stack-server --daemonize yes
redis-cli ping