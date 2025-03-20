import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Form, Button, InputGroup, Badge, Spinner, Alert, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaSort, FaEdit, FaTrash, FaStar, FaEye } from 'react-icons/fa';
import { getCustomers, deleteCustomer } from '../services/customerService';
import StarRatings from 'react-star-ratings';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [customers, searchTerm, statusFilter, sortField, sortDirection]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCustomers();
      
      if (response.success) {
        // Add a default rating property to customers if not present
        const customersWithRating = response.data.map(customer => ({
          ...customer,
          rating: customer.rating || 0
        }));
        setCustomers(customersWithRating);
      } else {
        setError('Failed to load customers');
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      setError('An error occurred while loading customers');
    } finally {
      setLoading(false);
    }
  };

  const filterCustomers = () => {
    let filtered = [...customers];
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(customer => 
        customer.first_name.toLowerCase().includes(searchLower) ||
        customer.last_name.toLowerCase().includes(searchLower) ||
        customer.email.toLowerCase().includes(searchLower) ||
        (customer.company && customer.company.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(customer => customer.status === statusFilter);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let fieldA = a[sortField];
      let fieldB = b[sortField];
      
      if (sortField === 'name') {
        fieldA = `${a.first_name} ${a.last_name}`;
        fieldB = `${b.first_name} ${b.last_name}`;
      }
      
      if (fieldA < fieldB) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (fieldA > fieldB) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredCustomers(filtered);
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      try {
        const response = await deleteCustomer(id);
        if (response.success) {
          setCustomers(customers.filter(customer => customer.id !== id));
        }
      } catch (error) {
        console.error('Error deleting customer:', error);
        setError('Failed to delete customer');
      }
    }
  };

  const toggleSortDirection = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
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

  const renderSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading customers...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <h2 className="mb-3 mb-md-0">Customers</h2>
        <Link to="/customers/new" className="btn btn-primary d-flex align-items-center gap-2">
          <span>Add New Customer</span>
        </Link>
      </div>
      
      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
      
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body className="p-4">
          <Row className="g-3">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search customers by name, email, or company..."
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <InputGroup>
                <InputGroup.Text>
                  <FaFilter />
                </InputGroup.Text>
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
            </Col>
            <Col md={3}>
              <InputGroup>
                <InputGroup.Text>
                  <FaSort />
                </InputGroup.Text>
                <Form.Select
                  value={sortField}
                  onChange={(e) => toggleSortDirection(e.target.value)}
                >
                  <option value="name">Name</option>
                  <option value="company">Company</option>
                  <option value="created_at">Date Added</option>
                  <option value="rating">Rating</option>
                </Form.Select>
                <Button 
                  variant="outline-secondary"
                  onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                >
                  {sortDirection === 'asc' ? '↑' : '↓'}
                </Button>
              </InputGroup>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      <div className="mb-3 text-muted">
        Showing {filteredCustomers.length} of {customers.length} customers
      </div>
      
      {filteredCustomers.length === 0 ? (
        <Card className="shadow-sm border-0 text-center p-5">
          <Card.Body>
            <h4>No customers found</h4>
            <p className="text-muted mb-4">Try adjusting your search or filter criteria</p>
            <Link to="/customers/new" className="btn btn-primary">
              Add New Customer
            </Link>
          </Card.Body>
        </Card>
      ) : (
        <Card className="shadow-sm border-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="px-3 py-3 cursor-pointer" onClick={() => toggleSortDirection('name')}>
                    Name {renderSortIcon('name')}
                  </th>
                  <th className="px-3 py-3 cursor-pointer" onClick={() => toggleSortDirection('email')}>
                    Email {renderSortIcon('email')}
                  </th>
                  <th className="px-3 py-3 d-none d-md-table-cell cursor-pointer" onClick={() => toggleSortDirection('company')}>
                    Company {renderSortIcon('company')}
                  </th>
                  <th className="px-3 py-3 cursor-pointer" onClick={() => toggleSortDirection('status')}>
                    Status {renderSortIcon('status')}
                  </th>
                  <th className="px-3 py-3 cursor-pointer" onClick={() => toggleSortDirection('rating')}>
                    Rating {renderSortIcon('rating')}
                  </th>
                  <th className="px-3 py-3 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map(customer => (
                  <tr key={customer.id}>
                    <td className="px-3 py-3">
                      <div className="fw-medium">
                        {customer.first_name} {customer.last_name}
                      </div>
                    </td>
                    <td className="px-3 py-3">{customer.email}</td>
                    <td className="px-3 py-3 d-none d-md-table-cell">
                      {customer.company || <span className="text-muted">None</span>}
                    </td>
                    <td className="px-3 py-3">
                      <Badge bg={getStatusBadgeVariant(customer.status)} className="py-2 px-3">
                        {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-3 py-3">
                      <div className="d-flex align-items-center">
                        <StarRatings
                          rating={customer.rating || 0}
                          starRatedColor="#ffc107"
                          starDimension="16px"
                          starSpacing="1px"
                          numberOfStars={5}
                          name={`rating-${customer.id}`}
                        />
                        <span className="ms-2 small">
                          {customer.rating ? customer.rating.toFixed(1) : '-'}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <Link
                          to={`/customers/${customer.id}`}
                          className="btn btn-sm btn-outline-secondary"
                          title="View Details"
                        >
                          <FaEye />
                        </Link>
                        <Link
                          to={`/customers/edit/${customer.id}`}
                          className="btn btn-sm btn-outline-primary"
                          title="Edit Customer"
                        >
                          <FaEdit />
                        </Link>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={(e) => handleDelete(customer.id, e)}
                          title="Delete Customer"
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      )}
    </Container>
  );
};

export default CustomerList; 