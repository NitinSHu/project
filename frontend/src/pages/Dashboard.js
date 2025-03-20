import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, Container, Spinner, Alert, Button, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FaUsers, 
  FaUserPlus, 
  FaRegHandshake, 
  FaUserCheck, 
  FaChartLine,
  FaSearch,
  FaPlus,
  FaArrowRight,
  FaStar
} from 'react-icons/fa';
import StarRatings from 'react-star-ratings';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    leads: 0,
    prospects: 0,
    activeCustomers: 0,
    recentCustomers: [],
    topRatedCustomers: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setError(null);
      const response = await axios.get('/api/customers');
      if (response.data.success) {
        const customers = response.data.data;
        
        // Add default rating if not present
        const customersWithRating = customers.map(customer => ({
          ...customer,
          rating: customer.rating || 0
        }));
        
        // Get top rated customers (rating > 0, sorted by rating)
        const topRated = [...customersWithRating]
          .filter(customer => customer.rating > 0)
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 5);
        
        // Calculate statistics
        const stats = {
          totalCustomers: customers.length,
          leads: customers.filter(c => c.status === 'lead').length,
          prospects: customers.filter(c => c.status === 'prospect').length,
          activeCustomers: customers.filter(c => c.status === 'customer').length,
          recentCustomers: customers.slice(-5).reverse(),
          topRatedCustomers: topRated
        };
        
        setStats(stats);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again later.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading dashboard...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2 className="mb-0">Dashboard</h2>
        <Link to="/customers/new" className="btn btn-primary d-flex align-items-center gap-2">
          <FaPlus />
          <span>Add Customer</span>
        </Link>
      </div>
      
      <Row className="g-4">
        <Col lg={3} md={6}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle p-3 bg-primary bg-opacity-10 me-3">
                <FaUsers className="text-primary" size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Total Customers</h6>
                <h3 className="mb-0">{stats.totalCustomers}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={3} md={6}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle p-3 bg-info bg-opacity-10 me-3">
                <FaUserPlus className="text-info" size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Active Leads</h6>
                <h3 className="mb-0">{stats.leads}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={3} md={6}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle p-3 bg-warning bg-opacity-10 me-3">
                <FaRegHandshake className="text-warning" size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Prospects</h6>
                <h3 className="mb-0">{stats.prospects}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={3} md={6}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle p-3 bg-success bg-opacity-10 me-3">
                <FaUserCheck className="text-success" size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Active Customers</h6>
                <h3 className="mb-0">{stats.activeCustomers}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4 g-4">
        <Col lg={8}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-light py-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 d-flex align-items-center">
                <FaChartLine className="me-2 opacity-75" />
                Recent Customer Activity
              </h5>
              <Link to="/customers" className="text-decoration-none d-flex align-items-center">
                View All <FaArrowRight className="ms-2" size={12} />
              </Link>
            </Card.Header>
            <Card.Body className="p-0">
              {stats.recentCustomers?.length > 0 ? (
                <div className="recent-customers">
                  {stats.recentCustomers.map((customer, index) => (
                    <Link 
                      to={`/customers/${customer.id}`} 
                      key={customer.id}
                      className="text-decoration-none"
                    >
                      <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                        <div>
                          <h6 className="mb-1 text-dark">{customer.first_name} {customer.last_name}</h6>
                          <small className="text-muted">{customer.company || 'No company'}</small>
                        </div>
                        <div className="d-flex align-items-center">
                          <Badge bg={getBadgeColor(customer.status)} className="py-2 px-3">
                            {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                          </Badge>
                          <FaArrowRight className="ms-3 text-muted" size={12} />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <div className="mb-3 text-muted">
                    <FaUsers size={30} className="opacity-50" />
                  </div>
                  <h6>No customers yet</h6>
                  <p className="text-muted mb-4">Start adding customers to your CRM</p>
                  <Link 
                    to="/customers/new" 
                    className="btn btn-primary d-inline-flex align-items-center gap-2"
                  >
                    <FaPlus />
                    <span>Add Your First Customer</span>
                  </Link>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-light py-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 d-flex align-items-center">
                <FaStar className="me-2 opacity-75 text-warning" />
                Top Rated Customers
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              {stats.topRatedCustomers?.length > 0 ? (
                <ListGroup variant="flush">
                  {stats.topRatedCustomers.map((customer) => (
                    <ListGroup.Item key={customer.id} className="border-bottom py-3">
                      <Link 
                        to={`/customers/${customer.id}`}
                        className="text-decoration-none"
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="mb-1 text-dark">{customer.first_name} {customer.last_name}</h6>
                            <small className="text-muted">{customer.company || 'No company'}</small>
                          </div>
                          <div className="d-flex align-items-center">
                            <StarRatings
                              rating={customer.rating}
                              starRatedColor="#ffc107"
                              starDimension="16px"
                              starSpacing="1px"
                              numberOfStars={5}
                              name={`rating-${customer.id}`}
                            />
                            <span className="ms-2 fw-bold">
                              {customer.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <div className="text-center py-5">
                  <div className="mb-3 text-muted">
                    <FaStar size={30} className="opacity-50" />
                  </div>
                  <h6>No rated customers yet</h6>
                  <p className="text-muted mb-4">Rate your customers to see them here</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

const getBadgeColor = (status) => {
  switch (status) {
    case 'lead':
      return 'info';
    case 'prospect':
      return 'warning';
    case 'customer':
      return 'success';
    case 'inactive':
      return 'danger';
    default:
      return 'secondary';
  }
};

export default Dashboard; 