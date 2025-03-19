from flask import Blueprint, request, jsonify, current_app
from app import db
from app.models.user import User
from app.models.customer import Customer
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
    get_jwt
)
from datetime import datetime, timedelta
import re

auth_bp = Blueprint('auth', __name__)

# Helper to validate email format
def is_valid_email(email):
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return bool(re.match(pattern, email))

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['username', 'email', 'password']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    # Validate email format
    if not is_valid_email(data['email']):
        return jsonify({'error': 'Invalid email format'}), 400
    
    # Check if username or email already exists
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already taken'}), 409
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 409
    
    # Create new user
    role = data.get('role', 'customer')
    
    # Only admin can create admin users
    if role == 'admin' and not (
        'admin_key' in data and data['admin_key'] == current_app.config.get('ADMIN_SECRET_KEY')
    ):
        return jsonify({'error': 'Unauthorized to create admin user'}), 403
    
    # Handle customer association if role is customer
    customer_id = None
    if role == 'customer' and 'customer_id' in data:
        customer = Customer.query.get(data['customer_id'])
        if not customer:
            return jsonify({'error': 'Customer not found'}), 404
        customer_id = customer.id
    
    user = User(
        username=data['username'],
        email=data['email'],
        password=data['password'],
        role=role,
        customer_id=customer_id
    )
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({
        'message': 'User registered successfully',
        'user': user.to_dict()
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    # Check required fields
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({'error': 'Missing username or password'}), 400
    
    # Find user by username
    user = User.query.filter_by(username=data['username']).first()
    
    # Verify user exists and password is correct
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid username or password'}), 401
    
    if not user.is_active:
        return jsonify({'error': 'Account is disabled'}), 403
    
    # Update last login time
    user.last_login = datetime.utcnow()
    db.session.commit()
    
    # Create tokens
    access_token = create_access_token(
        identity=user.id,
        additional_claims={
            'role': user.role,
            'username': user.username,
            'customer_id': user.customer_id
        }
    )
    refresh_token = create_refresh_token(identity=user.id)
    
    return jsonify({
        'access_token': access_token,
        'refresh_token': refresh_token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user or not user.is_active:
        return jsonify({'error': 'User not found or inactive'}), 401
    
    access_token = create_access_token(
        identity=user.id,
        additional_claims={
            'role': user.role,
            'username': user.username,
            'customer_id': user.customer_id
        }
    )
    
    return jsonify({'access_token': access_token}), 200

@auth_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    # Check if user is admin
    claims = get_jwt()
    if claims.get('role') != 'admin':
        return jsonify({'error': 'Admin access required'}), 403
    
    users = User.query.all()
    return jsonify({
        'users': [user.to_dict() for user in users]
    }), 200

@auth_bp.route('/users/<int:user_id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def manage_user(user_id):
    # Check if user is admin or the user themselves
    claims = get_jwt()
    current_user_id = get_jwt_identity()
    
    if claims.get('role') != 'admin' and current_user_id != user_id:
        return jsonify({'error': 'Unauthorized access'}), 403
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # GET - Return user details
    if request.method == 'GET':
        return jsonify({'user': user.to_dict()}), 200
    
    # PUT - Update user
    elif request.method == 'PUT':
        data = request.get_json()
        
        # Only admin can change roles
        if 'role' in data and claims.get('role') != 'admin':
            return jsonify({'error': 'Only admins can change user roles'}), 403
        
        # Update fields
        if 'username' in data and data['username'] != user.username:
            if User.query.filter_by(username=data['username']).first():
                return jsonify({'error': 'Username already taken'}), 409
            user.username = data['username']
            
        if 'email' in data and data['email'] != user.email:
            if not is_valid_email(data['email']):
                return jsonify({'error': 'Invalid email format'}), 400
            if User.query.filter_by(email=data['email']).first():
                return jsonify({'error': 'Email already registered'}), 409
            user.email = data['email']
            
        if 'password' in data:
            user.set_password(data['password'])
            
        if 'role' in data and claims.get('role') == 'admin':
            user.role = data['role']
            
        if 'is_active' in data and claims.get('role') == 'admin':
            user.is_active = data['is_active']
            
        db.session.commit()
        return jsonify({
            'message': 'User updated successfully',
            'user': user.to_dict()
        }), 200
    
    # DELETE - Remove user
    elif request.method == 'DELETE':
        # Only admin can delete users, or users can delete themselves
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted successfully'}), 200 