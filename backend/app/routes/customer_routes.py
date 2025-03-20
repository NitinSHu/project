from flask import Blueprint, request, jsonify
from app import db
from app.models.customer import Customer, Interaction
from app.models.review import Review
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
        if 'rating' in data:
            # If there's a direct rating field, handle it via reviews
            rating_value = data['rating']
            if isinstance(rating_value, (int, float)) and 0 <= rating_value <= 5:
                # Check if a review exists already
                existing_review = Review.query.filter_by(
                    customer_id=customer_id
                ).order_by(Review.created_at.desc()).first()
                
                if existing_review:
                    existing_review.rating = rating_value
                else:
                    new_review = Review(
                        customer_id=customer_id,
                        rating=rating_value
                    )
                    db.session.add(new_review)
        
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

# Get customer rating
@customer_bp.route('/<int:customer_id>/rating', methods=['GET'])
def get_customer_rating(customer_id):
    customer = Customer.query.get_or_404(customer_id)
    
    try:
        # Get the most recent review for this customer
        latest_review = Review.query.filter_by(
            customer_id=customer_id
        ).order_by(Review.created_at.desc()).first()
        
        rating_data = {
            'rating': latest_review.rating if latest_review else 0,
            'review_id': latest_review.id if latest_review else None,
            'review_text': latest_review.review if latest_review else '',
            'average_rating': customer.get_average_rating() or 0
        }
        
        return jsonify({
            'success': True,
            'data': rating_data
        }), 200
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

# Update customer rating
@customer_bp.route('/<int:customer_id>/rating', methods=['PUT'])
def update_customer_rating(customer_id):
    customer = Customer.query.get_or_404(customer_id)
    data = request.get_json()
    
    if 'rating' not in data:
        return jsonify({
            'success': False,
            'message': 'Missing required field: rating'
        }), 400
    
    rating_value = data['rating']
    if not isinstance(rating_value, (int, float)) or rating_value < 0 or rating_value > 5:
        return jsonify({
            'success': False,
            'message': 'Rating must be a number between 0 and 5'
        }), 400
    
    try:
        # Check if a review exists already
        existing_review = Review.query.filter_by(
            customer_id=customer_id
        ).order_by(Review.created_at.desc()).first()
        
        if existing_review:
            existing_review.rating = rating_value
            if 'review' in data:
                existing_review.review = data['review']
            db.session.commit()
            review = existing_review
        else:
            # Create a new review
            new_review = Review(
                customer_id=customer_id,
                rating=rating_value,
                review=data.get('review', '')
            )
            db.session.add(new_review)
            db.session.commit()
            review = new_review
        
        return jsonify({
            'success': True,
            'message': 'Rating updated successfully',
            'data': {
                'rating': review.rating,
                'review_id': review.id,
                'review_text': review.review,
                'average_rating': customer.get_average_rating() or review.rating
            }
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500 