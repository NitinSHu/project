from app import create_app, db
from flask_migrate import Migrate
from flask import current_app
import os

def run_migrations():
    """Run database migrations"""
    app = create_app()
    migrate = Migrate(app, db)
    
    with app.app_context():
        from flask_migrate import init as migrate_init
        from flask_migrate import migrate as migrate_create
        from flask_migrate import upgrade as migrate_upgrade
        from flask_migrate import stamp as migrate_stamp
        
        migrations_dir = os.path.join(os.path.dirname(current_app.root_path), 'migrations')
        
        # Check if migrations directory exists, initialize if not
        if not os.path.exists(migrations_dir):
            migrate_init()
            print("Migration directory initialized")
        
        try:
            # Create a migration
            migrate_create(message="Add users table")
            print("Migration created")
            
            # Apply migrations
            migrate_upgrade()
            print("Database upgraded successfully!")
        except Exception as e:
            print(f"Error during migration: {e}")
            print("Attempting to stamp the database with current revision")
            try:
                migrate_stamp('head')
                print("Database stamped successfully")
            except Exception as stamp_error:
                print(f"Error stamping database: {stamp_error}")

if __name__ == "__main__":
    run_migrations() 