import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Form, Button, InputGroup, Badge, Spinner, Alert, Table, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaSort, FaEdit, FaTrash, FaStar, FaEye } from 'react-icons/fa';
import { getCustomers, deleteCustomer, searchCustomers } from '../services/customerService';
import StarRatings from 'react-star-ratings';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchCustomers();
  }, [page, perPage, sortField, sortDirection, statusFilter]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page,
        perPage,
        sortBy: sortField,
        sortOrder: sortDirection,
        status: statusFilter !== 'all' ? statusFilter : null
      };
      
      const response = await getCustomers(params);
      
      if (response.success) {
        // Add a default rating property to customers if not present
        const customersWithRating = response.data.map(customer => ({
          ...customer,
          rating: customer.rating || 0
        }));
        setCustomers(customersWithRating);
        setTotalItems(response.count || 0);
        setTotalPages(response.pages || 1);
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

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
    if (searchTerm.trim()) {
      performSearch();
    } else {
      fetchCustomers();
    }
  };

  const performSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        search: searchTerm,
        status: statusFilter !== 'all' ? statusFilter : null,
        sortBy: sortField,
        sortOrder: sortDirection
      };
      
      const response = await searchCustomers(params);
      
      if (response.success) {
        // Add a default rating property to customers if not present
        const customersWithRating = response.data.map(customer => ({
          ...customer,
          rating: customer.rating || 0
        }));
        setCustomers(customersWithRating);
        setTotalItems(response.count || customersWithRating.length);
        setTotalPages(1); // Search results come on a single page currently
      } else {
        setError('Failed to search customers');
      }
    } catch (error) {
      console.error('Error searching customers:', error);
      setError('An error occurred while searching customers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      try {
        const response = await deleteCustomer(id);
        if (response.success) {
          // Refetch customers to update the list correctly
          fetchCustomers();
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
    setPage(1); // Reset to first page when changing sort
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePerPageChange = (e) => {
    setPerPage(parseInt(e.target.value, 10));
    setPage(1); // Reset to first page when changing items per page
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

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    let items = [];
    
    // Previous button
    items.push(
      <Pagination.Prev 
        key="prev" 
        onClick={() => handlePageChange(Math.max(1, page - 1))}
        disabled={page === 1}
      />
    );
    
    // First page
    if (page > 2) {
      items.push(
        <Pagination.Item key={1} onClick={() => handlePageChange(1)}>
          1
        </Pagination.Item>
      );
    }
    
    // Ellipsis if needed
    if (page > 3) {
      items.push(<Pagination.Ellipsis key="ellipsis1" disabled />);
    }
    
    // Pages around current
    for (let number = Math.max(1, page - 1); number <= Math.min(totalPages, page + 1); number++) {
      items.push(
        <Pagination.Item 
          key={number} 
          active={number === page}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>
      );
    }
    
    // Ellipsis if needed
    if (page < totalPages - 2) {
      items.push(<Pagination.Ellipsis key="ellipsis2" disabled />);
    }
    
    // Last page
    if (page < totalPages - 1) {
      items.push(
        <Pagination.Item key={totalPages} onClick={() => handlePageChange(totalPages)}>
          {totalPages}
        </Pagination.Item>
      );
    }
    
    // Next button
    items.push(
      <Pagination.Next 
        key="next" 
        onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
      />
    );
    
    return (
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          <Form.Select 
            size="sm" 
            style={{ width: '100px' }}
            value={perPage}
            onChange={handlePerPageChange}
            aria-label="Items per page"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </Form.Select>
        </div>
        <Pagination>{items}</Pagination>
        <div className="text-muted">
          Showing {customers.length} of {totalItems} customers
        </div>
      </div>
    );
  };

  if (loading && page === 1) {
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
              <Form onSubmit={handleSearch}>
                <InputGroup>
                  <InputGroup.Text>
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search customers by name, email, or company..."
                  />
                  <Button type="submit" variant="outline-primary">Search</Button>
                </InputGroup>
              </Form>
            </Col>
            <Col md={3}>
              <InputGroup>
                <InputGroup.Text>
                  <FaFilter />
                </InputGroup.Text>
                <Form.Select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1); // Reset to first page when changing filter
                  }}
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
      
      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" size="sm" className="me-2" />
          <span>Loading...</span>
        </div>
      )}
      
      {!loading && customers.length === 0 ? (
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
                {customers.map(customer => (
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
          {renderPagination()}
        </Card>
      )}
    </Container>
  );
};

export default CustomerList; 