from app import db
from datetime import datetime

class Customer(db.Model):
    __tablename__ = 'customers'
    
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    company = db.Column(db.String(100))
    status = db.Column(db.String(20), default='lead')  # lead, prospect, customer, etc.
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    interactions = db.relationship('Interaction', backref='customer', lazy=True, cascade='all, delete-orphan')
    reviews = db.relationship('Review', backref='customer', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        # Get the latest rating if any
        latest_rating = self.get_latest_rating()
        avg_rating = self.get_average_rating()
        
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'phone': self.phone,
            'company': self.company,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'interactions': [interaction.to_dict() for interaction in self.interactions],
            'rating': latest_rating,
            'average_rating': avg_rating
        }
    
    def get_average_rating(self):
        if not self.reviews:
            return 0
        return round(sum(review.rating for review in self.reviews) / len(self.reviews), 1)
    
    def get_latest_rating(self):
        if not self.reviews:
            return 0
        # Get the most recent review
        latest_review = sorted(self.reviews, key=lambda x: x.created_at, reverse=True)[0]
        return latest_review.rating
    
    def __repr__(self):
        return f'<Customer {self.first_name} {self.last_name}>'


class Interaction(db.Model):
    __tablename__ = 'interactions'
    
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    type = db.Column(db.String(50), nullable=False)  # call, email, meeting, etc.
    notes = db.Column(db.Text)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'customer_id': self.customer_id,
            'type': self.type,
            'notes': self.notes,
            'date': self.date.isoformat() if self.date else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        return f'<Interaction {self.type} with Customer {self.customer_id}>' 