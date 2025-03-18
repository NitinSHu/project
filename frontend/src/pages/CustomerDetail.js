import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, ListGroup, Form, Modal } from 'react-bootstrap';
import { getCustomer, getCustomerInteractions, createInteraction, deleteCustomer } from '../services/customerService';

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInteractionModal, setShowInteractionModal] = useState(false);
  const [newInteraction, setNewInteraction] = useState({
    type: 'call',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchCustomerData();
  }, [id]);

  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      const customerResponse = await getCustomer(id);
      const interactionsResponse = await getCustomerInteractions(id);
      
      if (customerResponse.success && interactionsResponse.success) {
        setCustomer(customerResponse.data);
        setInteractions(interactionsResponse.data);
      }
    } catch (error) {
      console.error('Error fetching customer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      try {
        const response = await deleteCustomer(id);
        if (response.success) {
          navigate('/customers');
        }
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  const handleInteractionSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createInteraction(id, newInteraction);
      if (response.success) {
        setInteractions([...interactions, response.data]);
        setShowInteractionModal(false);
        setNewInteraction({
          type: 'call',
          notes: '',
          date: new Date().toISOString().split('T')[0]
        });
      }
    } catch (error) {
      console.error('Error creating interaction:', error);
    }
  };

  if (loading) {
    return <p>Loading customer details...</p>;
  }

  if (!customer) {
    return (
      <Card>
        <Card.Body>
          <p>Customer not found.</p>
          <Link to="/customers" className="btn btn-primary">
            Back to Customers
          </Link>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>
          {customer.first_name} {customer.last_name}
        </h1>
        <div>
          <Link to={`/customers/edit/${id}`} className="btn btn-warning me-2">
            Edit
          </Link>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Customer Information</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Email:</strong> {customer.email}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Phone:</strong> {customer.phone || 'N/A'}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Company:</strong> {customer.company || 'N/A'}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Status:</strong>{' '}
                  <span className={`status-badge status-${customer.status}`}>
                    {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                  </span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Created:</strong>{' '}
                  {new Date(customer.created_at).toLocaleDateString()}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Interactions</h5>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={() => setShowInteractionModal(true)}
              >
                Add Interaction
              </Button>
            </Card.Header>
            <Card.Body>
              {interactions.length > 0 ? (
                <div>
                  {interactions
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map(interaction => (
                      <div key={interaction.id} className="interaction-item mb-3">
                        <div className="d-flex justify-content-between">
                          <h6>
                            {interaction.type.charAt(0).toUpperCase() + interaction.type.slice(1)}
                          </h6>
                          <small className="text-muted">
                            {new Date(interaction.date).toLocaleDateString()}
                          </small>
                        </div>
                        <p className="mb-0">{interaction.notes}</p>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-center">No interactions recorded yet.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add Interaction Modal */}
      <Modal show={showInteractionModal} onHide={() => setShowInteractionModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Interaction</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleInteractionSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select
                value={newInteraction.type}
                onChange={(e) => setNewInteraction({ ...newInteraction, type: e.target.value })}
              >
                <option value="call">Call</option>
                <option value="email">Email</option>
                <option value="meeting">Meeting</option>
                <option value="note">Note</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={newInteraction.date}
                onChange={(e) => setNewInteraction({ ...newInteraction, date: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newInteraction.notes}
                onChange={(e) => setNewInteraction({ ...newInteraction, notes: e.target.value })}
                placeholder="Enter details about the interaction..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowInteractionModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Interaction
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomerDetail; 