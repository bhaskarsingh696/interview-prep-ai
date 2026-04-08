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

// Generate interview questions
export const generateQuestions = async (topic, difficulty, count = 5) => {
  const response = await API.post('/ai/generate-questions', { topic, difficulty, count });
  return response.data;
};

// Evaluate answer
export const evaluateAnswer = async (question, userAnswer, topic) => {
  const response = await API.post('/ai/evaluate-answer', { question, userAnswer, topic });
  return response.data;
};

// Save interview session
export const saveInterview = async (topic, difficulty, evaluations) => {
  const response = await API.post('/ai/save-interview', { topic, difficulty, evaluations });
  return response.data;
};

// Get my interview history
export const getMyInterviews = async () => {
  const response = await API.get('/ai/my-interviews');
  return response.data;
};