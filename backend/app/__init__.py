import pymysql
pymysql.install_as_MySQLdb()

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import os
from dotenv import load_dotenv
from config import Config

# Load environment variables
load_dotenv()

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app)
    
    # Import models
    from app.models.customer import Customer, Interaction
    from app.models.review import Review
    from app.models.user import User
    
    # Register blueprints
    from app.routes.customer_routes import customer_bp
    from app.routes.review_routes import review_bp
    from app.routes.auth_routes import auth_bp
    
    app.register_blueprint(customer_bp, url_prefix='/api/customers')
    app.register_blueprint(review_bp, url_prefix='/api/reviews')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    
    # Create database tables if they don't exist
    with app.app_context():
        db.create_all()
    
    @app.route('/')
    def index():
        return {'status': 'API is running'}
    
    return app 