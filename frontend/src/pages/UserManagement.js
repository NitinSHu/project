import React, { useState, useEffect } from 'react';
import { getUsers, deleteUser, updateUser } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { Container, Row, Col, Card, Form, Button, Alert, Table, Badge, Spinner } from 'react-bootstrap';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: '',
    is_active: true
  });
  
  const { user: currentUser } = useAuth();
  
  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    } catch (err) {
      setError(err.error || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };
  
  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      role: user.role,
      is_active: user.is_active
    });
    setIsEditing(true);
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setSelectedUser(null);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    try {
      await updateUser(selectedUser.id, formData);
      setIsEditing(false);
      setSelectedUser(null);
      fetchUsers(); // Refresh user list
    } catch (err) {
      setError(err.error || 'Failed to update user');
    }
  };
  
  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        fetchUsers(); // Refresh user list
      } catch (err) {
        setError(err.error || 'Failed to delete user');
      }
    }
  };
  
  if (loading && users.length === 0) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading users...</span>
        </Spinner>
      </Container>
    );
  }
  
  return (
    <Container className="py-4">
      <h1 className="mb-4">User Management</h1>
      
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}
      
      {isEditing && selectedUser ? (
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <h2 className="mb-4">Edit User</h2>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Role</Form.Label>
                    <Form.Select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3 mt-4">
                    <Form.Check
                      type="checkbox"
                      label="Active User"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <div className="d-flex justify-content-end mt-3">
                <Button
                  variant="secondary"
                  onClick={handleCancel}
                  className="me-2"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                >
                  Save Changes
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      ) : (
        <Card className="shadow-sm">
          <Card.Body>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      {user.username}
                      {currentUser && currentUser.id === user.id && (
                        <Badge bg="info" className="ms-2">You</Badge>
                      )}
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <Badge bg={user.role === 'admin' ? 'purple' : 'success'}>
                        {user.role}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={user.is_active ? 'success' : 'danger'}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant="link"
                        onClick={() => handleEdit(user)}
                        className="p-0 me-3 text-decoration-none"
                      >
                        Edit
                      </Button>
                      {currentUser && currentUser.id !== user.id && (
                        <Button
                          variant="link"
                          onClick={() => handleDelete(user.id)}
                          className="p-0 text-danger text-decoration-none"
                        >
                          Delete
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default UserManagement; 