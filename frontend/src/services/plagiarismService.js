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

// Check plagiarism for a submission
export const checkPlagiarism = async (submissionId) => {
  const response = await API.get(`/plagiarism/check/${submissionId}`);
  return response.data;
};

// Get my plagiarism report
export const getMyPlagiarismReport = async () => {
  const response = await API.get('/plagiarism/my-report');
  return response.data;
};