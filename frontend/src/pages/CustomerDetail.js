import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, ListGroup, Form, Modal, Container, Badge, Spinner, Alert, InputGroup } from 'react-bootstrap';
import { getCustomer, getCustomerInteractions, createInteraction, deleteCustomer } from '../services/customerService';
import { 
  FaEdit, 
  FaTrash, 
  FaPhone, 
  FaEnvelope, 
  FaBuilding, 
  FaTags, 
  FaCalendarAlt, 
  FaPlus, 
  FaArrowLeft,
  FaComment,
  FaVideo,
  FaUser
} from 'react-icons/fa';
import CustomerRating from '../components/CustomerRating';

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      setError(null);
      const customerResponse = await getCustomer(id);
      const interactionsResponse = await getCustomerInteractions(id);
      
      if (customerResponse.success && interactionsResponse.success) {
        setCustomer(customerResponse.data);
        setInteractions(interactionsResponse.data);
      } else {
        setError('Failed to load customer data');
      }
    } catch (error) {
      console.error('Error fetching customer data:', error);
      setError('An error occurred while loading customer data');
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
        setError('Failed to delete customer');
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
      setError('Failed to add interaction');
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch(status) {
      case 'lead': return 'info';
      case 'prospect': return 'warning';
      case 'customer': return 'success';
      case 'inactive': return 'danger';
      default: return 'secondary';
    }
  };

  const getInteractionIcon = (type) => {
    switch(type) {
      case 'call': return <FaPhone className="text-primary" />;
      case 'email': return <FaEnvelope className="text-info" />;
      case 'meeting': return <FaVideo className="text-success" />;
      case 'note': return <FaComment className="text-warning" />;
      default: return <FaComment />;
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading customer details...</span>
        </Spinner>
      </Container>
    );
  }

  if (!customer) {
    return (
      <Container>
        <Card className="shadow-sm border-0 text-center py-5">
          <Card.Body>
            <h5 className="mb-3">Customer not found</h5>
            <p className="text-muted">The customer you're looking for doesn't exist or has been removed.</p>
            <Link to="/customers" className="btn btn-primary d-inline-flex align-items-center gap-2">
              <FaArrowLeft />
              <span>Back to Customers</span>
            </Link>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      
      <div className="d-flex align-items-center mb-2">
        <Button 
          variant="light" 
          className="me-3 rounded-circle p-2" 
          onClick={() => navigate('/customers')}
        >
          <FaArrowLeft />
        </Button>
        <div>
          <span className="text-muted small d-block">Customer</span>
          <h2 className="mb-0">
            {customer.first_name} {customer.last_name}
          </h2>
        </div>
      </div>
      
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div className="mb-2 mb-md-0">
          <Badge 
            bg={getStatusBadgeVariant(customer.status)}
            className="py-2 px-3 me-2"
          >
            {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
          </Badge>
          {customer.company && (
            <Badge bg="secondary" className="py-2 px-3">
              {customer.company}
            </Badge>
          )}
        </div>
        <div className="d-flex gap-2">
          <Link 
            to={`/customers/edit/${id}`} 
            className="btn btn-outline-primary d-flex align-items-center gap-2"
          >
            <FaEdit />
            <span>Edit</span>
          </Link>
          <Button 
            variant="outline-danger" 
            onClick={handleDelete}
            className="d-flex align-items-center gap-2"
          >
            <FaTrash />
            <span>Delete</span>
          </Button>
        </div>
      </div>

      <Row className="g-4">
        <Col lg={4}>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Header className="bg-light py-3">
              <h5 className="mb-0 d-flex align-items-center">
                <FaUser className="me-2 opacity-75" />
                Contact Information
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              <ListGroup variant="flush">
                <ListGroup.Item className="d-flex py-3">
                  <FaEnvelope className="me-3 mt-1 text-muted" />
                  <div>
                    <div className="text-muted small">Email</div>
                    <div>{customer.email}</div>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex py-3">
                  <FaPhone className="me-3 mt-1 text-muted" />
                  <div>
                    <div className="text-muted small">Phone</div>
                    <div>{customer.phone || 'Not provided'}</div>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex py-3">
                  <FaBuilding className="me-3 mt-1 text-muted" />
                  <div>
                    <div className="text-muted small">Company</div>
                    <div>{customer.company || 'Not provided'}</div>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex py-3">
                  <FaCalendarAlt className="me-3 mt-1 text-muted" />
                  <div>
                    <div className="text-muted small">Customer since</div>
                    <div>{new Date(customer.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}</div>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
          
          {/* Add Customer Rating Component */}
          <CustomerRating customerId={id} />
        </Col>

        <Col lg={8}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-light py-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 d-flex align-items-center">
                <FaComment className="me-2 opacity-75" />
                Interaction History
              </h5>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={() => setShowInteractionModal(true)}
                className="d-flex align-items-center gap-2"
              >
                <FaPlus />
                <span>Add Interaction</span>
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              {interactions.length > 0 ? (
                <div className="interaction-list">
                  {interactions
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((interaction, index) => (
                      <div 
                        key={interaction.id} 
                        className={`p-3 ${index !== interactions.length - 1 ? 'border-bottom' : ''}`}
                      >
                        <div className="d-flex gap-3">
                          <div className="interaction-icon p-2 rounded-circle bg-light">
                            {getInteractionIcon(interaction.type)}
                          </div>
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <h6 className="mb-0 fw-bold">
                                {interaction.type.charAt(0).toUpperCase() + interaction.type.slice(1)}
                              </h6>
                              <Badge 
                                bg="light" 
                                text="dark" 
                                className="d-flex align-items-center gap-1"
                              >
                                <FaCalendarAlt size={10} />
                                <span>{new Date(interaction.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}</span>
                              </Badge>
                            </div>
                            <p className="mb-0 text-secondary">{interaction.notes}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <div className="mb-3 text-muted">
                    <FaComment size={30} className="opacity-50" />
                  </div>
                  <h6>No interactions recorded yet</h6>
                  <p className="text-muted mb-4">Keep track of your communications with this customer</p>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={() => setShowInteractionModal(true)}
                    className="d-flex align-items-center gap-2 mx-auto"
                  >
                    <FaPlus />
                    <span>Add First Interaction</span>
                  </Button>
                </div>
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
              <InputGroup className="mb-3">
                <InputGroup.Text>{getInteractionIcon(newInteraction.type)}</InputGroup.Text>
                <Form.Select
                  value={newInteraction.type}
                  onChange={(e) => setNewInteraction({ ...newInteraction, type: e.target.value })}
                >
                  <option value="call">Call</option>
                  <option value="email">Email</option>
                  <option value="meeting">Meeting</option>
                  <option value="note">Note</option>
                </Form.Select>
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <InputGroup>
                <InputGroup.Text><FaCalendarAlt /></InputGroup.Text>
                <Form.Control
                  type="date"
                  value={newInteraction.date}
                  onChange={(e) => setNewInteraction({ ...newInteraction, date: e.target.value })}
                />
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={newInteraction.notes}
                onChange={(e) => setNewInteraction({ ...newInteraction, notes: e.target.value })}
                placeholder="Enter details about the interaction..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setShowInteractionModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              className="d-flex align-items-center gap-2"
            >
              <FaPlus size={12} />
              <span>Save Interaction</span>
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default CustomerDetail; 