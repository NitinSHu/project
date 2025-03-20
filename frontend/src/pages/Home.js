import React from 'react';
import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FaUsers, 
  FaChartLine, 
  FaMobileAlt, 
  FaUserTie, 
  FaDatabase, 
  FaShieldAlt, 
  FaRocket,
  FaRegLightbulb,
  FaTasks,
  FaRegHandshake,
  FaArrowRight
} from 'react-icons/fa';

const Home = () => {
  return (
    <Container className="py-3">
      {/* Hero Section */}
      <Row className="mb-5 align-items-center">
        <Col lg={6} className="mb-4 mb-lg-0">
          <div className="pe-lg-4">
            <h1 className="display-4 fw-bold mb-3">Simplify Customer Management</h1>
            <p className="lead text-secondary mb-4">
              An intuitive CRM system designed to help businesses manage customer relationships, 
              track interactions, and boost sales performance.
            </p>
            <div className="d-flex gap-3">
              <Button 
                as={Link} 
                to="/register" 
                variant="primary" 
                size="lg" 
                className="d-flex align-items-center gap-2"
              >
                Get Started
                <FaArrowRight size={14} />
              </Button>
              <Button 
                as={Link} 
                to="/login" 
                variant="outline-secondary" 
                size="lg"
              >
                Sign In
              </Button>
            </div>
          </div>
        </Col>
        <Col lg={6}>
          <img 
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" 
            alt="CRM Dashboard" 
            className="img-fluid rounded shadow-lg"
          />
        </Col>
      </Row>
      
      {/* Features Section */}
      <section className="mb-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Key Features</h2>
          <p className="text-secondary mx-auto" style={{ maxWidth: '700px' }}>
            Our CRM provides powerful tools to manage your customer relationships effectively
          </p>
        </div>
        
        <Row className="g-4">
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="text-primary mb-3">
                  <FaUsers size={28} />
                </div>
                <Card.Title>Customer Management</Card.Title>
                <Card.Text>
                  Easily store and organize customer information. Track communication 
                  history and customer status.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="text-primary mb-3">
                  <FaRegHandshake size={28} />
                </div>
                <Card.Title>Interaction Tracking</Card.Title>
                <Card.Text>
                  Log emails, calls, meetings, and notes. Never miss a follow-up with 
                  comprehensive interaction history.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="text-primary mb-3">
                  <FaChartLine size={28} />
                </div>
                <Card.Title>Dashboard Analytics</Card.Title>
                <Card.Text>
                  Get real-time insights into your sales funnel and customer 
                  acquisition metrics with visual reports.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>
      
      {/* Benefits Section */}
      <section className="mb-5 py-5 bg-light rounded-3">
        <Container>
          <Row className="align-items-center">
            <Col lg={5} className="mb-4 mb-lg-0">
              <h2 className="fw-bold mb-4">Why Choose Our CRM?</h2>
              
              <ListGroup variant="flush" className="border-0">
                <ListGroup.Item className="border-0 bg-transparent ps-0 d-flex align-items-center gap-3 mb-3">
                  <div className="rounded-circle bg-primary bg-opacity-10 p-2">
                    <FaMobileAlt className="text-primary" />
                  </div>
                  <div>
                    <h5 className="mb-1">Responsive Design</h5>
                    <p className="mb-0 text-secondary">Access from any device - desktop, tablet, or mobile</p>
                  </div>
                </ListGroup.Item>
                
                <ListGroup.Item className="border-0 bg-transparent ps-0 d-flex align-items-center gap-3 mb-3">
                  <div className="rounded-circle bg-primary bg-opacity-10 p-2">
                    <FaUserTie className="text-primary" />
                  </div>
                  <div>
                    <h5 className="mb-1">User-Friendly Interface</h5>
                    <p className="mb-0 text-secondary">Intuitive design for ease of use with minimal training</p>
                  </div>
                </ListGroup.Item>
                
                <ListGroup.Item className="border-0 bg-transparent ps-0 d-flex align-items-center gap-3 mb-3">
                  <div className="rounded-circle bg-primary bg-opacity-10 p-2">
                    <FaDatabase className="text-primary" />
                  </div>
                  <div>
                    <h5 className="mb-1">Secure Data Storage</h5>
                    <p className="mb-0 text-secondary">Your customer data is encrypted and securely stored</p>
                  </div>
                </ListGroup.Item>
                
                <ListGroup.Item className="border-0 bg-transparent ps-0 d-flex align-items-center gap-3">
                  <div className="rounded-circle bg-primary bg-opacity-10 p-2">
                    <FaShieldAlt className="text-primary" />
                  </div>
                  <div>
                    <h5 className="mb-1">Role-Based Access</h5>
                    <p className="mb-0 text-secondary">Control who can view and modify customer information</p>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Col>
            
            <Col lg={7}>
              <Row className="g-4">
                <Col sm={6}>
                  <Card className="border-0 bg-white shadow-sm">
                    <Card.Body className="p-4 text-center">
                      <div className="rounded-circle bg-primary bg-opacity-10 p-3 mx-auto mb-3" style={{ width: 'fit-content' }}>
                        <FaRegLightbulb className="text-primary" size={24} />
                      </div>
                      <h4 className="mb-2">Increase Sales</h4>
                      <p className="text-secondary mb-0">
                        Better customer insights lead to more effective sales strategies.
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
                
                <Col sm={6}>
                  <Card className="border-0 bg-white shadow-sm">
                    <Card.Body className="p-4 text-center">
                      <div className="rounded-circle bg-primary bg-opacity-10 p-3 mx-auto mb-3" style={{ width: 'fit-content' }}>
                        <FaTasks className="text-primary" size={24} />
                      </div>
                      <h4 className="mb-2">Save Time</h4>
                      <p className="text-secondary mb-0">
                        Streamline workflows and reduce time spent on administrative tasks.
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
                
                <Col sm={12}>
                  <Card className="border-0 bg-white shadow-sm">
                    <Card.Body className="p-4 text-center">
                      <div className="rounded-circle bg-primary bg-opacity-10 p-3 mx-auto mb-3" style={{ width: 'fit-content' }}>
                        <FaRocket className="text-primary" size={24} />
                      </div>
                      <h4 className="mb-2">Grow Your Business</h4>
                      <p className="text-secondary mb-0">
                        Better customer relationships lead to increased loyalty and business growth.
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* Call to Action */}
      <section className="text-center py-5">
        <h2 className="display-6 fw-bold mb-4">Ready to Streamline Your Customer Management?</h2>
        <p className="lead text-secondary mb-5 mx-auto" style={{ maxWidth: '700px' }}>
          Join thousands of businesses that trust our CRM to manage their customer relationships effectively.
        </p>
        <Button 
          as={Link} 
          to="/register" 
          variant="primary" 
          size="lg" 
          className="px-5 py-3 d-inline-flex align-items-center gap-2"
        >
          Get Started Now
          <FaArrowRight />
        </Button>
      </section>
    </Container>
  );
};

export default Home; 