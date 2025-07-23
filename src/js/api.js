// Base API configuration
const API_BASE_URL = 'http://localhost:5000/api/v1';

// Helper function for API requests
async function apiRequest(method, endpoint, data = null, token = null) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.error || 'Something went wrong');
  }

  return responseData;
}

// Authentication API
export const authAPI = {
  register: (userData) => apiRequest('POST', '/auth/register', userData),
  login: (credentials) => apiRequest('POST', '/auth/login', credentials),
  getMe: (token) => apiRequest('GET', '/auth/me', null, token),
  updateDetails: (userData, token) => apiRequest('PUT', '/auth/updatedetails', userData, token),
  updatePassword: (passwords, token) => apiRequest('PUT', '/auth/updatepassword', passwords, token),
};

// Trips API
export const tripsAPI = {
  getTrips: (token) => apiRequest('GET', '/trips', null, token),
  createTrip: (tripData, token) => apiRequest('POST', '/trips', tripData, token),
  getTrip: (id, token) => apiRequest('GET', `/trips/${id}`, null, token),
  updateTrip: (id, tripData, token) => apiRequest('PUT', `/trips/${id}`, tripData, token),
  deleteTrip: (id, token) => apiRequest('DELETE', `/trips/${id}`, null, token),
  calculateScore: (id, token) => apiRequest('GET', `/trips/${id}/score`, null, token),
};

// Rewards API
export const rewardsAPI = {
  getRewards: (token) => apiRequest('GET', '/rewards', null, token),
  redeemReward: (id, token) => apiRequest('POST', `/rewards/${id}/redeem`, null, token),
};

// Emergencies API
export const emergenciesAPI = {
  createEmergency: (emergencyData, token) => apiRequest('POST', '/emergencies', emergencyData, token),
};