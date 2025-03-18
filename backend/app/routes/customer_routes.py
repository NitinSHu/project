from flask import Blueprint, request, jsonify
from app import db
from app.models.customer import Customer, Interaction
from sqlalchemy.exc import IntegrityError

customer_bp = Blueprint('customers', __name__)

# Get all customers
@customer_bp.route('', methods=['GET'])
def get_customers():
    customers = Customer.query.all()
    return jsonify({
        'success': True,
        'data': [customer.to_dict() for customer in customers]
    }), 200

# Get a specific customer
@customer_bp.route('/<int:customer_id>', methods=['GET'])
def get_customer(customer_id):
    customer = Customer.query.get_or_404(customer_id)
    return jsonify({
        'success': True,
        'data': customer.to_dict()
    }), 200

# Create a new customer
@customer_bp.route('', methods=['POST'])
def create_customer():
    data = request.get_json()
    
    required_fields = ['first_name', 'last_name', 'email']
    for field in required_fields:
        if field not in data:
            return jsonify({
                'success': False,
                'message': f'Missing required field: {field}'
            }), 400
    
    try:
        new_customer = Customer(
            first_name=data['first_name'],
            last_name=data['last_name'],
            email=data['email'],
            phone=data.get('phone', ''),
            company=data.get('company', ''),
            status=data.get('status', 'lead')
        )
        
        db.session.add(new_customer)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Customer created successfully',
            'data': new_customer.to_dict()
        }), 201
    
    except IntegrityError:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': 'Email already exists'
        }), 400
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

# Update a customer
@customer_bp.route('/<int:customer_id>', methods=['PUT'])
def update_customer(customer_id):
    customer = Customer.query.get_or_404(customer_id)
    data = request.get_json()
    
    try:
        if 'first_name' in data:
            customer.first_name = data['first_name']
        if 'last_name' in data:
            customer.last_name = data['last_name']
        if 'email' in data:
            customer.email = data['email']
        if 'phone' in data:
            customer.phone = data['phone']
        if 'company' in data:
            customer.company = data['company']
        if 'status' in data:
            customer.status = data['status']
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Customer updated successfully',
            'data': customer.to_dict()
        }), 200
    
    except IntegrityError:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': 'Email already exists'
        }), 400
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

# Delete a customer
@customer_bp.route('/<int:customer_id>', methods=['DELETE'])
def delete_customer(customer_id):
    customer = Customer.query.get_or_404(customer_id)
    
    try:
        db.session.delete(customer)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Customer deleted successfully'
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

# Get all interactions for a customer
@customer_bp.route('/<int:customer_id>/interactions', methods=['GET'])
def get_customer_interactions(customer_id):
    Customer.query.get_or_404(customer_id)  # Check if customer exists
    interactions = Interaction.query.filter_by(customer_id=customer_id).all()
    
    return jsonify({
        'success': True,
        'data': [interaction.to_dict() for interaction in interactions]
    }), 200

# Create a new interaction for a customer
@customer_bp.route('/<int:customer_id>/interactions', methods=['POST'])
def create_interaction(customer_id):
    Customer.query.get_or_404(customer_id)  # Check if customer exists
    data = request.get_json()
    
    if 'type' not in data:
        return jsonify({
            'success': False,
            'message': 'Missing required field: type'
        }), 400
    
    try:
        new_interaction = Interaction(
            customer_id=customer_id,
            type=data['type'],
            notes=data.get('notes', ''),
            date=data.get('date')
        )
        
        db.session.add(new_interaction)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Interaction created successfully',
            'data': new_interaction.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500 