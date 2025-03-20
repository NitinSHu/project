import axios from 'axios';

const API_URL = '/api/customers';

// Get all customers
export const getCustomers = async (params = {}) => {
  try {
    const { page, perPage, sortBy, sortOrder, status, search } = params;
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    
    if (page) queryParams.append('page', page);
    if (perPage) queryParams.append('per_page', perPage);
    if (sortBy) queryParams.append('sort_by', sortBy === 'name' ? 'first_name' : sortBy);
    if (sortOrder) queryParams.append('sort_order', sortOrder);
    if (status && status !== 'all') queryParams.append('status', status);
    
    const queryString = queryParams.toString();
    const url = queryString ? `${API_URL}?${queryString}` : API_URL;
    
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

// Search customers with advanced filtering
export const searchCustomers = async (params = {}) => {
  try {
    const { search, status, sortBy, sortOrder } = params;
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    
    if (search) queryParams.append('q', search);
    if (status && status !== 'all') queryParams.append('status', status);
    if (sortBy) queryParams.append('sort_by', sortBy === 'name' ? 'first_name' : sortBy);
    if (sortOrder) queryParams.append('sort_order', sortOrder);
    
    const queryString = queryParams.toString();
    const url = `${API_URL}/search${queryString ? `?${queryString}` : ''}`;
    
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error searching customers:', error);
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
    // Handle 404 as valid response with rating = 0
    if (error.response && error.response.status === 404) {
      return {
        success: true,
        data: {
          rating: 0,
          review_id: null,
          review_text: '',
          average_rating: 0
        }
      };
    }
    console.error(`Error fetching rating for customer ${customerId}:`, error);
    throw error;
  }
};

// Update customer rating
export const updateCustomerRating = async (customerId, ratingData) => {
  try {
    // Ensure rating is a number between 0 and 5
    const rating = Math.min(5, Math.max(0, Number(ratingData.rating) || 0));
    
    const response = await axios.put(`${API_URL}/${customerId}/rating`, { 
      rating,
      review: ratingData.review || ''
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error updating rating for customer ${customerId}:`, error);
    throw error;
  }
}; 