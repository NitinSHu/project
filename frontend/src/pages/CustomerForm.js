import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Form, Button, Alert, Container, Row, Col, Spinner, InputGroup } from 'react-bootstrap';
import { getCustomer, createCustomer, updateCustomer } from '../services/customerService';
import { FaUser, FaEnvelope, FaPhone, FaBuilding, FaTags, FaArrowLeft, FaSave, FaStar } from 'react-icons/fa';
import StarRatings from 'react-star-ratings';

const CustomerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company: '',
    status: 'lead',
    rating: 0
  });
  
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [validated, setValidated] = useState(false);
  
  useEffect(() => {
    if (isEditMode) {
      fetchCustomer();
    }
  }, [id]);
  
  const fetchCustomer = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getCustomer(id);
      if (response.success) {
        setFormData({
          ...response.data,
          rating: response.data.rating || 0
        });
      } else {
        setError('Could not load customer data: ' + (response.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error fetching customer:', error);
      setError('Failed to load customer data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleRatingChange = (newRating) => {
    setFormData({
      ...formData,
      rating: newRating
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    setSaving(true);
    setError('');
    
    try {
      let response;
      
      if (isEditMode) {
        response = await updateCustomer(id, formData);
      } else {
        response = await createCustomer(formData);
      }
      
      if (response.success) {
        navigate(isEditMode ? `/customers/${id}` : '/customers');
      } else {
        setError(response.message || 'An error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Error saving customer:', error);
      setError('Failed to save customer. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  const getStatusVariant = (status) => {
    switch(status) {
      case 'lead': return 'info';
      case 'prospect': return 'warning';
      case 'customer': return 'success';
      case 'inactive': return 'danger';
      default: return 'secondary';
    }
  };
  
  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading customer data...</span>
        </Spinner>
      </Container>
    );
  }
  
  return (
    <Container>
      <div className="d-flex align-items-center mb-4">
        <Button 
          variant="light" 
          className="me-3 rounded-circle p-2 shadow-sm border" 
          onClick={() => navigate(isEditMode ? `/customers/${id}` : '/customers')}
          aria-label="Go back"
        >
          <FaArrowLeft />
        </Button>
        <h2 className="mb-0">{isEditMode ? 'Edit Customer' : 'Add New Customer'}</h2>
      </div>
      
      <Card className="shadow-sm border-0 mb-5">
        <Card.Body className="p-4">
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><FaUser /></InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      placeholder="Enter first name"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      First name is required.
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><FaUser /></InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      placeholder="Enter last name"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Last name is required.
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
            
            <Row className="g-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><FaEnvelope /></InputGroup.Text>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid email.
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><FaPhone /></InputGroup.Text>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
            
            <Row className="g-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Company</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><FaBuilding /></InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Enter company name"
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><FaTags /></InputGroup.Text>
                    <Form.Select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className={`bg-${getStatusVariant(formData.status)}-subtle`}
                    >
                      <option value="lead">Lead</option>
                      <option value="prospect">Prospect</option>
                      <option value="customer">Customer</option>
                      <option value="inactive">Inactive</option>
                    </Form.Select>
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
            
            <Row className="g-3 mb-4">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="d-flex align-items-center">
                    <FaStar className="text-warning me-2" />
                    Customer Rating
                  </Form.Label>
                  <div className="mt-2">
                    <StarRatings
                      rating={formData.rating}
                      starRatedColor="#ffc107"
                      starHoverColor="#ffdd57"
                      starDimension="30px"
                      starSpacing="2px"
                      changeRating={handleRatingChange}
                      numberOfStars={5}
                      name="rating"
                    />
                    <div className="mt-2 text-muted small">
                      {formData.rating === 0 ? 'Not rated' : `Rating: ${formData.rating} out of 5`}
                    </div>
                  </div>
                </Form.Group>
              </Col>
            </Row>
            
            <div className="d-flex justify-content-end gap-3 mt-4">
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate(isEditMode ? `/customers/${id}` : '/customers')}
                className="px-4"
                disabled={saving}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit" 
                className="px-4 d-flex align-items-center gap-2"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FaSave />
                    <span>{isEditMode ? 'Update Customer' : 'Add Customer'}</span>
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CustomerForm; 