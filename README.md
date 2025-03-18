# Customer Relationship Management (CRM) System

A comprehensive CRM solution for tracking customer interactions, including sales calls, customer service interactions, marketing emails, and more.

## Features

- Customer management (add, edit, delete, view)
- Interaction tracking (calls, emails, meetings, notes)
- Dashboard with key metrics
- Filtering and searching capabilities
- Status tracking for leads, prospects, and customers

## Tech Stack

### Backend
- Flask (Python web framework)
- SQLAlchemy (ORM)
- MySQL (Database)
- RESTful API architecture

### Frontend
- React
- React Bootstrap
- React Router
- Axios for API calls

## Project Structure

```
project/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── __init__.py
│   ├── migrations/
│   ├── .env
│   ├── requirements.txt
│   └── run.py
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Configure the database:
   - Update the `.env` file with your MySQL credentials
   - Create a MySQL database named `crm_db`

6. Initialize the database:
   ```
   flask db init
   flask db migrate -m "Initial migration"
   flask db upgrade
   ```

7. Run the Flask application:
   ```
   python run.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

## API Endpoints

### Customers

- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get a specific customer
- `POST /api/customers` - Create a new customer
- `PUT /api/customers/:id` - Update a customer
- `DELETE /api/customers/:id` - Delete a customer

### Interactions

- `GET /api/customers/:id/interactions` - Get all interactions for a customer
- `POST /api/customers/:id/interactions` - Create a new interaction for a customer

## Future Enhancements

- User authentication and authorization
- Email integration
- Task management
- Calendar integration
- Advanced reporting and analytics
- Mobile application 