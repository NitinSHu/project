import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { getCustomers } from '../services/customerService';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    leads: 0,
    prospects: 0,
    customers: 0,
    recentCustomers: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCustomers();
        if (response.success) {
          const customers = response.data;
          
          // Calculate stats
          const leads = customers.filter(c => c.status === 'lead').length;
          const prospects = customers.filter(c => c.status === 'prospect').length;
          const activeCustomers = customers.filter(c => c.status === 'customer').length;
          
          // Get 5 most recent customers
          const recentCustomers = [...customers]
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5);
          
          setStats({
            totalCustomers: customers.length,
            leads,
            prospects,
            customers: activeCustomers,
            recentCustomers
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div>
      <h1 className="mb-4">Dashboard</h1>
      
      <Row className="mb-4">
        <Col md={3}>
          <Card className="dashboard-card text-center mb-3">
            <Card.Body>
              <h3>{stats.totalCustomers}</h3>
              <Card.Text>Total Contacts</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-card text-center mb-3 bg-warning text-dark">
            <Card.Body>
              <h3>{stats.leads}</h3>
              <Card.Text>Leads</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-card text-center mb-3 bg-info text-white">
            <Card.Body>
              <h3>{stats.prospects}</h3>
              <Card.Text>Prospects</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-card text-center mb-3 bg-success text-white">
            <Card.Body>
              <h3>{stats.customers}</h3>
              <Card.Text>Customers</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <h2 className="mb-3">Recent Customers</h2>
      <Row>
        {stats.recentCustomers.length > 0 ? (
          stats.recentCustomers.map(customer => (
            <Col md={4} key={customer.id} className="mb-3">
              <Card className="customer-card h-100">
                <Card.Body>
                  <Card.Title>
                    {customer.first_name} {customer.last_name}
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{customer.company}</Card.Subtitle>
                  <Card.Text>
                    <span className={`status-badge status-${customer.status}`}>
                      {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                    </span>
                  </Card.Text>
                  <Link to={`/customers/${customer.id}`} className="btn btn-sm btn-primary">
                    View Details
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <p>No customers found. <Link to="/customers/new">Add your first customer</Link></p>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default Dashboard; 