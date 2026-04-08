import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Create peer interview room
export const createPeerRoom = async (topic, difficulty, initiatorRole) => {
  const response = await API.post('/peer/create', { topic, difficulty, initiatorRole });
  return response.data;
};

// Get available rooms
export const getAvailableRooms = async () => {
  const response = await API.get('/peer/available');
  return response.data;
};

// Join a room
export const joinPeerRoom = async (roomId) => {
  const response = await API.post(`/peer/join/${roomId}`);
  return response.data;
};

// Complete interview and submit feedback
export const completePeerInterview = async (roomId, rating, comment) => {
  const response = await API.post(`/peer/complete/${roomId}`, { rating, comment });
  return response.data;
};

// Get my peer interview history
export const getMyPeerInterviews = async () => {
  const response = await API.get('/peer/my-interviews');
  return response.data;
};