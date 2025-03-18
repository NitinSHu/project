import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { getCustomer, createCustomer, updateCustomer } from '../services/customerService';

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
    status: 'lead'
  });
  
  const [loading, setLoading] = useState(isEditMode);
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
      const response = await getCustomer(id);
      if (response.success) {
        setFormData(response.data);
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
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
    }
  };
  
  if (loading) {
    return <p>Loading customer data...</p>;
  }
  
  return (
    <div>
      <h1 className="mb-4">{isEditMode ? 'Edit Customer' : 'Add New Customer'}</h1>
      
      <Card>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                First name is required.
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Last name is required.
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid email.
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Company</Form.Label>
              <Form.Control
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="lead">Lead</option>
                <option value="prospect">Prospect</option>
                <option value="customer">Customer</option>
                <option value="inactive">Inactive</option>
              </Form.Select>
            </Form.Group>
            
            <div className="d-flex justify-content-end">
              <Button 
                variant="secondary" 
                className="me-2"
                onClick={() => navigate(isEditMode ? `/customers/${id}` : '/customers')}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {isEditMode ? 'Update Customer' : 'Add Customer'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CustomerForm; 