from app import create_app, db
from app.models.user import User
import sys

def create_admin_user(username, email, password):
    """Create an admin user in the database"""
    app = create_app()
    
    with app.app_context():
        # Check if user already exists
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            print(f"Admin user '{username}' already exists!")
            return
        
        # Create new admin user
        admin = User(
            username=username,
            email=email,
            password=password,
            role='admin'
        )
        
        db.session.add(admin)
        db.session.commit()
        print(f"Admin user '{username}' created successfully!")

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python create_admin.py <username> <email> <password>")
        sys.exit(1)
    
    username = sys.argv[1]
    email = sys.argv[2]
    password = sys.argv[3]
    
    create_admin_user(username, email, password) 