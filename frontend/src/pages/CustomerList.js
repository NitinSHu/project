import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getCustomers, deleteCustomer } from '../services/customerService';

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

  return (
    <div>
      <h1 className="mb-4">Customers</h1>
      
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Form.Group className="mb-0" style={{ width: '300px' }}>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => setSearchTerm('')}
                  >
                    ✕
                  </Button>
                )}
              </InputGroup>
            </Form.Group>
            
            <Form.Group className="mb-0" style={{ width: '200px' }}>
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
            </Form.Group>
          </div>
          
          <Link to="/customers/new" className="btn btn-primary">
            Add New Customer
          </Link>
        </Card.Body>
      </Card>
      
      {loading ? (
        <p>Loading customers...</p>
      ) : filteredCustomers.length > 0 ? (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Company</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map(customer => (
              <tr key={customer.id}>
                <td>
                  <Link to={`/customers/${customer.id}`}>
                    {customer.first_name} {customer.last_name}
                  </Link>
                </td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>{customer.company}</td>
                <td>
                  <span className={`status-badge status-${customer.status}`}>
                    {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                  </span>
                </td>
                <td>
                  <Link to={`/customers/${customer.id}`} className="btn btn-sm btn-info me-2">
                    View
                  </Link>
                  <Link to={`/customers/edit/${customer.id}`} className="btn btn-sm btn-warning me-2">
                    Edit
                  </Link>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={() => handleDelete(customer.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Card>
          <Card.Body className="text-center">
            <p>No customers found. {searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters.' : ''}</p>
            {!searchTerm && statusFilter === 'all' && (
              <Link to="/customers/new" className="btn btn-primary">
                Add Your First Customer
              </Link>
            )}
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default CustomerList; 