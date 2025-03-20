import React from 'react';
import { Navbar as BsNavbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaUserPlus, FaTachometerAlt, FaUsers, FaUserCog, FaUser, FaSignOutAlt, FaPlus, FaHome } from 'react-icons/fa';
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
    <BsNavbar bg="dark" variant="dark" expand="lg" className="shadow-sm mb-0">
      <Container fluid="lg">
        <BsNavbar.Brand as={Link} to="/" className="fw-bold">
          <span className="d-flex align-items-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
              <path d="M20 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V6C22 4.89543 21.1046 4 20 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 10H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 15H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            CRM System
          </span>
        </BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BsNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              active={location.pathname === '/'}
              className="d-flex align-items-center gap-1"
            >
              <FaHome size={14} />
              <span>Home</span>
            </Nav.Link>
            
            {user && (
              <>
                <Nav.Link 
                  as={Link} 
                  to="/dashboard" 
                  active={location.pathname === '/dashboard'}
                  className="d-flex align-items-center gap-1"
                >
                  <FaTachometerAlt size={14} />
                  <span>Dashboard</span>
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/customers" 
                  active={location.pathname.startsWith('/customers') && !location.pathname.startsWith('/customers/new')}
                  className="d-flex align-items-center gap-1"
                >
                  <FaUsers size={14} />
                  <span>Customers</span>
                </Nav.Link>
              </>
            )}
          </Nav>
          <Nav className="align-items-center">
            {user ? (
              <>
                {isAdmin() && (
                  <Nav.Link 
                    as={Link} 
                    to="/admin/users"
                    active={location.pathname.startsWith('/admin')}
                    className="d-flex align-items-center gap-1"
                  >
                    <FaUserCog size={14} />
                    <span className="d-none d-md-inline">Manage Users</span>
                    <span className="d-inline d-md-none">Admin</span>
                  </Nav.Link>
                )}
                <Button 
                  as={Link} 
                  to="/customers/new" 
                  variant="primary" 
                  size="sm" 
                  className="d-flex align-items-center gap-1 mx-2"
                >
                  <FaPlus />
                  <span className="d-none d-md-inline">Add Customer</span>
                </Button>
                <NavDropdown 
                  title={
                    <span className="d-flex align-items-center gap-1">
                      <FaUser size={14} />
                      <span className="d-none d-sm-inline">{user.username || 'Account'}</span>
                    </span>
                  } 
                  id="user-dropdown" 
                  align="end"
                >
                  <NavDropdown.Item as={Link} to={`/profile`}>
                    <span className="d-flex align-items-center gap-2">
                      <FaUser size={14} />
                      <span>My Profile</span>
                    </span>
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    <span className="d-flex align-items-center gap-2 text-danger">
                      <FaSignOutAlt size={14} />
                      <span>Logout</span>
                    </span>
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="mx-2">
                  Login
                </Nav.Link>
                <Button as={Link} to="/register" variant="outline-light" size="sm" className="d-flex align-items-center gap-1">
                  <FaUserPlus size={14} />
                  <span>Register</span>
                </Button>
              </>
            )}
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
};

export default Navbar; 