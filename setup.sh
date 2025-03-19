#!/bin/bash

echo "Setting up the project..."

echo "Installing backend dependencies..."
cd backend
pip install -r requirements.txt
cd ..

echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo "Running database migrations..."
cd backend
python db_migrate.py
cd ..

echo "Creating admin user..."
cd backend
python create_admin.py admin admin@example.com adminpassword
cd ..

echo "Setup completed successfully!"
echo ""
echo "You can now run the application with: npm run dev"
echo "Admin credentials:"
echo "Username: admin"
echo "Password: adminpassword"
echo ""
echo "Remember to change the admin password after first login!" 