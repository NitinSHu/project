import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    leads: 0,
    prospects: 0,
    activeCustomers: 0,
    recentInteractions: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/customers');
      if (response.data.success) {
        const customers = response.data.data;
        
        // Calculate statistics
        const stats = {
          totalCustomers: customers.length,
          leads: customers.filter(c => c.status === 'lead').length,
          prospects: customers.filter(c => c.status === 'prospect').length,
          activeCustomers: customers.filter(c => c.status === 'customer').length,
          recentCustomers: customers.slice(-5).reverse()
        };
        
        setStats(stats);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <h2 className="mb-4 fade-in">Dashboard</h2>
      
      <Row className="stats-container">
        <Col md={3} className="mb-4">
          <Card className="dashboard-card slide-up">
            <Card.Body>
              <Card.Title>Total Customers</Card.Title>
              <h2 className="counter">{stats.totalCustomers}</h2>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} className="mb-4">
          <Card className="dashboard-card slide-up" style={{animationDelay: '0.2s'}}>
            <Card.Body>
              <Card.Title>Active Leads</Card.Title>
              <h2 className="counter">{stats.leads}</h2>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} className="mb-4">
          <Card className="dashboard-card slide-up" style={{animationDelay: '0.4s'}}>
            <Card.Body>
              <Card.Title>Prospects</Card.Title>
              <h2 className="counter">{stats.prospects}</h2>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} className="mb-4">
          <Card className="dashboard-card slide-up" style={{animationDelay: '0.6s'}}>
            <Card.Body>
              <Card.Title>Active Customers</Card.Title>
              <h2 className="counter">{stats.activeCustomers}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="mt-4 fade-in">
        <Card.Body>
          <Card.Title>Recent Customers</Card.Title>
          <div className="recent-customers">
            {stats.recentCustomers?.map((customer, index) => (
              <Link 
                to={`/customers/${customer.id}`} 
                key={customer.id}
                className="recent-customer-item"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6>{customer.first_name} {customer.last_name}</h6>
                    <small>{customer.company}</small>
                  </div>
                  <Badge bg={getBadgeColor(customer.status)}>
                    {customer.status}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

const getBadgeColor = (status) => {
  switch (status) {
    case 'lead':
      return 'warning';
    case 'prospect':
      return 'info';
    case 'customer':
      return 'success';
    case 'inactive':
      return 'secondary';
    default:
      return 'primary';
  }
};

export default Dashboard; 