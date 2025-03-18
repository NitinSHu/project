import pytest
import json
from app import create_app, db
from app.models.customer import Customer

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.session.remove()
            db.drop_all()

def test_get_customers_empty(client):
    """Test getting customers when the database is empty."""
    response = client.get('/api/customers')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['success'] is True
    assert len(data['data']) == 0

def test_create_customer(client):
    """Test creating a new customer."""
    customer_data = {
        'first_name': 'John',
        'last_name': 'Doe',
        'email': 'john.doe@example.com',
        'phone': '123-456-7890',
        'company': 'ACME Inc.',
        'status': 'lead'
    }
    
    response = client.post(
        '/api/customers',
        data=json.dumps(customer_data),
        content_type='application/json'
    )
    
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['success'] is True
    assert data['data']['first_name'] == 'John'
    assert data['data']['last_name'] == 'Doe'
    assert data['data']['email'] == 'john.doe@example.com'

def test_get_customer(client):
    """Test getting a specific customer."""
    # First create a customer
    customer = Customer(
        first_name='Jane',
        last_name='Smith',
        email='jane.smith@example.com',
        phone='987-654-3210',
        company='XYZ Corp',
        status='prospect'
    )
    
    with client.application.app_context():
        db.session.add(customer)
        db.session.commit()
        customer_id = customer.id
    
    # Now get the customer
    response = client.get(f'/api/customers/{customer_id}')
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['success'] is True
    assert data['data']['first_name'] == 'Jane'
    assert data['data']['last_name'] == 'Smith'
    assert data['data']['email'] == 'jane.smith@example.com'

def test_update_customer(client):
    """Test updating a customer."""
    # First create a customer
    customer = Customer(
        first_name='Bob',
        last_name='Johnson',
        email='bob.johnson@example.com',
        phone='555-123-4567',
        company='ABC Ltd',
        status='lead'
    )
    
    with client.application.app_context():
        db.session.add(customer)
        db.session.commit()
        customer_id = customer.id
    
    # Now update the customer
    update_data = {
        'first_name': 'Robert',
        'status': 'customer'
    }
    
    response = client.put(
        f'/api/customers/{customer_id}',
        data=json.dumps(update_data),
        content_type='application/json'
    )
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['success'] is True
    assert data['data']['first_name'] == 'Robert'
    assert data['data']['last_name'] == 'Johnson'  # Unchanged
    assert data['data']['status'] == 'customer'  # Changed

def test_delete_customer(client):
    """Test deleting a customer."""
    # First create a customer
    customer = Customer(
        first_name='Alice',
        last_name='Brown',
        email='alice.brown@example.com',
        status='prospect'
    )
    
    with client.application.app_context():
        db.session.add(customer)
        db.session.commit()
        customer_id = customer.id
    
    # Now delete the customer
    response = client.delete(f'/api/customers/{customer_id}')
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['success'] is True
    
    # Verify the customer is deleted
    response = client.get(f'/api/customers/{customer_id}')
    assert response.status_code == 404 