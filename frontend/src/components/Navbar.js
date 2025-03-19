import React from 'react';
import { Navbar as BsNavbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <BsNavbar bg="dark" variant="dark" expand="lg" className="mb-3">
      <Container>
        <BsNavbar.Brand as={Link} to="/">CRM System</BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BsNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              active={location.pathname === '/'}
            >
              Dashboard
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/customers" 
              active={location.pathname.startsWith('/customers')}
            >
              Customers
            </Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link as={Link} to="/customers/new" className="btn btn-primary text-white">
              Add Customer
            </Nav.Link>
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
};

export default Navbar; 