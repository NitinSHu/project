import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import StarRatings from 'react-star-ratings';
import { FaStar } from 'react-icons/fa';
import { getCustomerRating, updateCustomerRating } from '../services/customerService';

const CustomerRating = ({ customerId }) => {
  const [rating, setRating] = useState(0);
  const [previousRating, setPreviousRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchRating();
  }, [customerId]);

  const fetchRating = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getCustomerRating(customerId);
      
      if (response.success) {
        setRating(response.data.rating || 0);
        setPreviousRating(response.data.rating || 0);
      } else {
        setError('Could not load customer rating');
      }
    } catch (error) {
      console.error('Error fetching rating:', error);
      setError('Failed to load rating');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleSaveRating = async () => {
    if (rating === previousRating) {
      setIsEditing(false);
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      
      const response = await updateCustomerRating(customerId, { rating });
      
      if (response.success) {
        setPreviousRating(rating);
        setIsEditing(false);
      } else {
        setError('Could not update rating');
      }
    } catch (error) {
      console.error('Error saving rating:', error);
      setError('Failed to save rating');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setRating(previousRating);
    setIsEditing(false);
  };

  const getRatingText = (rating) => {
    switch (true) {
      case rating >= 4.5: return 'Excellent';
      case rating >= 3.5: return 'Good';
      case rating >= 2.5: return 'Average';
      case rating >= 1.5: return 'Below Average';
      case rating > 0: return 'Poor';
      default: return 'Not Rated';
    }
  };

  const getRatingClass = (rating) => {
    switch (true) {
      case rating >= 4.5: return 'text-success';
      case rating >= 3.5: return 'text-primary';
      case rating >= 2.5: return 'text-info';
      case rating >= 1.5: return 'text-warning';
      case rating > 0: return 'text-danger';
      default: return 'text-muted';
    }
  };

  return (
    <Card className="shadow-sm border-0 mb-4">
      <Card.Header className="bg-light py-3">
        <h5 className="mb-0 d-flex align-items-center">
          <FaStar className="me-2 opacity-75" />
          Customer Rating
        </h5>
      </Card.Header>
      <Card.Body>
        {error && <p className="text-danger">{error}</p>}

        <div className="d-flex flex-column align-items-center">
          {isLoading ? (
            <p className="text-center">Loading rating...</p>
          ) : (
            <>
              <StarRatings
                rating={rating}
                starRatedColor="#ffc107"
                starHoverColor="#ffdd57"
                starDimension="30px"
                starSpacing="2px"
                changeRating={isEditing ? handleRatingChange : undefined}
                numberOfStars={5}
                name="rating"
              />
              
              <p className={`mt-2 fw-bold ${getRatingClass(rating)}`}>
                {getRatingText(rating)}
              </p>
              
              {isEditing ? (
                <div className="d-flex gap-2 mt-3">
                  <Button 
                    variant="outline-secondary" 
                    size="sm" 
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={handleSaveRating}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save Rating'}
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  className="mt-3" 
                  onClick={() => setIsEditing(true)}
                >
                  {previousRating > 0 ? 'Update Rating' : 'Add Rating'}
                </Button>
              )}
            </>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default CustomerRating; 