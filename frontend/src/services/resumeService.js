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

// Upload and analyze resume
export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append('resume', file);
  const response = await API.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

// Get my resumes
export const getMyResumes = async () => {
  const response = await API.get('/resume/my-resumes');
  return response.data;
};

// Get single resume
export const getResumeById = async (id) => {
  const response = await API.get(`/resume/${id}`);
  return response.data;
};