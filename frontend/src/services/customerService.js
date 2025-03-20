import axios from 'axios';

const API_URL = '/api/customers';

// Get all customers
export const getCustomers = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

// Get a specific customer
export const getCustomer = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching customer ${id}:`, error);
    throw error;
  }
};

// Create a new customer
export const createCustomer = async (customerData) => {
  try {
    const response = await axios.post(API_URL, customerData);
    return response.data;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
};

// Update a customer
export const updateCustomer = async (id, customerData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, customerData);
    return response.data;
  } catch (error) {
    console.error(`Error updating customer ${id}:`, error);
    throw error;
  }
};

// Delete a customer
export const deleteCustomer = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting customer ${id}:`, error);
    throw error;
  }
};

// Get all interactions for a customer
export const getCustomerInteractions = async (customerId) => {
  try {
    const response = await axios.get(`${API_URL}/${customerId}/interactions`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching interactions for customer ${customerId}:`, error);
    throw error;
  }
};

// Create a new interaction for a customer
export const createInteraction = async (customerId, interactionData) => {
  try {
    const response = await axios.post(`${API_URL}/${customerId}/interactions`, interactionData);
    return response.data;
  } catch (error) {
    console.error(`Error creating interaction for customer ${customerId}:`, error);
    throw error;
  }
};

// Get customer rating
export const getCustomerRating = async (customerId) => {
  try {
    const response = await axios.get(`${API_URL}/${customerId}/rating`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching rating for customer ${customerId}:`, error);
    throw error;
  }
};

// Update customer rating
export const updateCustomerRating = async (customerId, ratingData) => {
  try {
    const response = await axios.put(`${API_URL}/${customerId}/rating`, ratingData);
    return response.data;
  } catch (error) {
    console.error(`Error updating rating for customer ${customerId}:`, error);
    throw error;
  }
}; 