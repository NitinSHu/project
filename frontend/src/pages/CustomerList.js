import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Form, InputGroup, Container, Row, Col, Badge, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getCustomers, deleteCustomer } from '../services/customerService';
import { FaSearch, FaPlus, FaTrash, FaEdit, FaEye, FaTimes, FaFilter } from 'react-icons/fa';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [customers, searchTerm, statusFilter]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await getCustomers();
      if (response.success) {
        setCustomers(response.data);
        setFilteredCustomers(response.data);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCustomers = () => {
    let filtered = [...customers];
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        customer =>
          customer.first_name.toLowerCase().includes(term) ||
          customer.last_name.toLowerCase().includes(term) ||
          customer.email.toLowerCase().includes(term) ||
          (customer.company && customer.company.toLowerCase().includes(term))
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(customer => customer.status === statusFilter);
    }
    
    setFilteredCustomers(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        const response = await deleteCustomer(id);
        if (response.success) {
          setCustomers(customers.filter(customer => customer.id !== id));
        }
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
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

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Customers</h2>
        <Link 
          to="/customers/new" 
          className="btn btn-primary d-flex align-items-center gap-2"
        >
          <FaPlus />
          <span>Add Customer</span>
        </Link>
      </div>
      
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body className="p-3 p-md-4">
          <Row className="align-items-end g-3">
            <Col md={5} lg={6}>
              <Form.Group className="mb-0">
                <Form.Label>Search</Form.Label>
                <InputGroup>
                  <InputGroup.Text><FaSearch /></InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search by name, email or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => setSearchTerm('')}
                    >
                      <FaTimes />
                    </Button>
                  )}
                </InputGroup>
              </Form.Group>
            </Col>
            
            <Col md={4} lg={3}>
              <Form.Group className="mb-0">
                <Form.Label>Filter Status</Form.Label>
                <InputGroup>
                  <InputGroup.Text><FaFilter /></InputGroup.Text>
                  <Form.Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="lead">Leads</option>
                    <option value="prospect">Prospects</option>
                    <option value="customer">Customers</option>
                    <option value="inactive">Inactive</option>
                  </Form.Select>
                </InputGroup>
              </Form.Group>
            </Col>
            
            <Col md={3} lg={3} className="d-flex justify-content-md-end">
              <div className="w-100 d-flex justify-content-between align-items-center">
                <span className="text-muted d-none d-md-block">
                  {filteredCustomers.length} result{filteredCustomers.length !== 1 ? 's' : ''}
                </span>
                <Button 
                  variant={searchTerm || statusFilter !== 'all' ? 'outline-secondary' : 'outline-light'}
                  className={searchTerm || statusFilter !== 'all' ? 'd-flex align-items-center gap-2' : 'd-none'}
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                >
                  <FaTimes size={12} />
                  <span>Clear Filters</span>
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading customers...</span>
          </Spinner>
        </div>
      ) : filteredCustomers.length > 0 ? (
        <Card className="shadow-sm border-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Name</th>
                  <th className="d-none d-md-table-cell">Email</th>
                  <th className="d-none d-lg-table-cell">Phone</th>
                  <th className="d-none d-md-table-cell">Company</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map(customer => (
                  <tr key={customer.id}>
                    <td>
                      <Link 
                        to={`/customers/${customer.id}`}
                        className="text-decoration-none fw-medium text-dark d-block"
                      >
                        {customer.first_name} {customer.last_name}
                      </Link>
                      <span className="d-block d-md-none small text-muted">
                        {customer.email}
                      </span>
                    </td>
                    <td className="d-none d-md-table-cell">{customer.email}</td>
                    <td className="d-none d-lg-table-cell">{customer.phone || '-'}</td>
                    <td className="d-none d-md-table-cell">{customer.company || '-'}</td>
                    <td>
                      <Badge 
                        bg={getStatusBadgeVariant(customer.status)}
                        className="py-2 px-3"
                      >
                        {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex justify-content-end gap-2">
                        <Link 
                          to={`/customers/${customer.id}`} 
                          className="btn btn-sm btn-outline-secondary" 
                          title="View"
                        >
                          <FaEye />
                          <span className="d-none d-lg-inline ms-1">View</span>
                        </Link>
                        <Link 
                          to={`/customers/edit/${customer.id}`} 
                          className="btn btn-sm btn-outline-primary"
                          title="Edit"
                        >
                          <FaEdit />
                          <span className="d-none d-lg-inline ms-1">Edit</span>
                        </Link>
                        <Button 
                          variant="outline-danger" 
                          size="sm" 
                          onClick={() => handleDelete(customer.id)}
                          title="Delete"
                        >
                          <FaTrash />
                          <span className="d-none d-lg-inline ms-1">Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      ) : (
        <Card className="shadow-sm border-0 text-center py-5">
          <Card.Body>
            <div className="mb-3">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/1178/1178479.png" 
                alt="No customers found" 
                style={{ width: '80px', opacity: 0.7 }}
              />
            </div>
            <h5 className="mb-3">No customers found</h5>
            <p className="text-muted mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search filters to find what you\'re looking for.'
                : 'Get started by adding your first customer to the system.'}
            </p>
            {!searchTerm && statusFilter === 'all' ? (
              <Link 
                to="/customers/new" 
                className="btn btn-primary d-inline-flex align-items-center gap-2"
              >
                <FaPlus />
                <span>Add Your First Customer</span>
              </Link>
            ) : (
              <Button 
                variant="outline-secondary"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                className="d-inline-flex align-items-center gap-2"
              >
                <FaTimes />
                <span>Clear Filters</span>
              </Button>
            )}
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default CustomerList; 