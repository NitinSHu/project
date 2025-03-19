from flask import Blueprint, request, jsonify
from app import db
from app.models.review import Review
from app.models.customer import Customer

review_bp = Blueprint('review_bp', __name__)

@review_bp.route('/api/customers/<int:customer_id>/reviews', methods=['GET'])
def get_customer_reviews(customer_id):
    try:
        customer = Customer.query.get_or_404(customer_id)
        reviews = [review.to_dict() for review in customer.reviews]
        return jsonify({
            'success': True,
            'data': reviews
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@review_bp.route('/api/customers/<int:customer_id>/reviews', methods=['POST'])
def create_review(customer_id):
    try:
        data = request.get_json()
        
        # Validate required fields
        if 'rating' not in data:
            return jsonify({
                'success': False,
                'error': 'Rating is required'
            }), 400
            
        if not isinstance(data['rating'], int) or data['rating'] < 1 or data['rating'] > 5:
            return jsonify({
                'success': False,
                'error': 'Rating must be a number between 1 and 5'
            }), 400

        # Check if customer exists
        customer = Customer.query.get_or_404(customer_id)
        
        # Create new review
        review = Review(
            customer_id=customer_id,
            rating=data['rating'],
            review=data.get('review', '')
        )
        
        db.session.add(review)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': review.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@review_bp.route('/api/customers/<int:customer_id>/reviews/<int:review_id>', methods=['PUT'])
def update_review(customer_id, review_id):
    try:
        data = request.get_json()
        review = Review.query.filter_by(id=review_id, customer_id=customer_id).first_or_404()
        
        if 'rating' in data:
            if not isinstance(data['rating'], int) or data['rating'] < 1 or data['rating'] > 5:
                return jsonify({
                    'success': False,
                    'error': 'Rating must be a number between 1 and 5'
                }), 400
            review.rating = data['rating']
            
        if 'review' in data:
            review.review = data['review']
            
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': review.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@review_bp.route('/api/customers/<int:customer_id>/reviews/<int:review_id>', methods=['DELETE'])
def delete_review(customer_id, review_id):
    try:
        review = Review.query.filter_by(id=review_id, customer_id=customer_id).first_or_404()
        db.session.delete(review)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Review deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500 