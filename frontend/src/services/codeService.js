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

// Get all problems
export const getProblems = async (topic = '', difficulty = '') => {
  let url = '/code/problems';
  const params = [];
  if (topic) params.push(`topic=${topic}`);
  if (difficulty) params.push(`difficulty=${difficulty}`);
  if (params.length > 0) url += '?' + params.join('&');
  const response = await API.get(url);
  return response.data;
};

// Get single problem
export const getProblemById = async (id) => {
  const response = await API.get(`/code/problems/${id}`);
  return response.data;
};

// ✅ NEW: Run code via Piston API
export const runCode = async (code, language) => {
  const response = await API.post('/code/run', { code, language });
  return response.data;
};

// Submit code
export const submitCode = async (data) => {
  const response = await API.post('/code/submit', data);
  return response.data;
};

// Get my submissions
export const getMySubmissions = async () => {
  const response = await API.get('/code/submissions/me');
  return response.data;
};