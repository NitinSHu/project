import React from 'react';
import { Navbar as BsNavbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <BsNavbar bg="dark" variant="dark" expand="lg" className="mb-3">
      <Container>
        <BsNavbar.Brand as={Link} to="/">CRM System</BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BsNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {user && (
              <>
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
              </>
            )}
          </Nav>
          <Nav>
            {user ? (
              <>
                {isAdmin() && (
                  <Nav.Link 
                    as={Link} 
                    to="/admin/users"
                    active={location.pathname.startsWith('/admin')}
                  >
                    Manage Users
                  </Nav.Link>
                )}
                <Nav.Link as={Link} to="/customers/new" className="btn btn-primary text-white mx-2">
                  Add Customer
                </Nav.Link>
                <NavDropdown title={user.username || 'Account'} id="user-dropdown" align="end">
                  <NavDropdown.Item as={Link} to={`/profile`}>My Profile</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="mx-2">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className="btn btn-outline-light">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
};

export default Navbar; 