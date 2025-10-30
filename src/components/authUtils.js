/**
 * Authentication utility functions
 */

// Get authentication token
export const getToken = () => {
  return sessionStorage.getItem('token');
};

// Get user data
export const getUser = () => {
  const user = sessionStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
};

// Set authentication data
export const setAuth = (token, user) => {
  sessionStorage.setItem('token', token);
  sessionStorage.setItem('user', JSON.stringify(user));
};

// Clear authentication data
export const clearAuth = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
};

// Create authenticated fetch request
export const authFetch = async (url, options = {}) => {
  const token = getToken();
  
  const authOptions = {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json',
    },
  };

  const response = await fetch(url, authOptions);
  
  // If unauthorized, clear auth and reload
  if (response.status === 401) {
    clearAuth();
    window.location.reload();
  }

  return response;
};