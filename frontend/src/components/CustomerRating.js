import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import '../styles/CustomerRating.css';

const CustomerRating = ({ customerId, onRatingSubmit }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [hover, setHover] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    try {
      const response = await axios.post(`/api/customers/${customerId}/reviews`, {
        rating,
        review
      });

      if (response.data.success) {
        setSuccess('Review submitted successfully!');
        setRating(0);
        setReview('');
        if (onRatingSubmit) {
          onRatingSubmit(response.data.data);
        }
      }
    } catch (error) {
      setError('Failed to submit review. Please try again.');
      console.error('Error submitting review:', error);
    }
  };

  return (
    <Card className="rating-card">
      <Card.Body>
        <Card.Title>Rate Customer Interaction</Card.Title>
        
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <div className="star-rating mb-3">
            {[...Array(5)].map((_, index) => {
              const ratingValue = index + 1;
              
              return (
                <span
                  key={ratingValue}
                  className={`star ${ratingValue <= (hover || rating) ? 'active' : ''}`}
                  onClick={() => setRating(ratingValue)}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(0)}
                >
                  ★
                </span>
              );
            })}
          </div>
          
          <Form.Group className="mb-3">
            <Form.Label>Review (Optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Write your review here..."
              className="review-input"
            />
          </Form.Group>
          
          <Button 
            variant="primary" 
            type="submit"
            className="submit-button"
          >
            Submit Review
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CustomerRating; 