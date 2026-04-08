import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Automatically attach token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Register
export const registerUser = async (userData) => {
  const response = await API.post('/auth/register', userData);
  return response.data;
};

// Login
export const loginUser = async (userData) => {
  const response = await API.post('/auth/login', userData);
  return response.data;
};

// Get current logged in user
export const getMe = async () => {
  const response = await API.get('/auth/me');
  return response.data;
};