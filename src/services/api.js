import axios from 'axios';
import { io } from 'socket.io-client';

const API_BASE_URL = 'http://localhost:5000/api';
const SOCKET_URL = 'http://localhost:5000';

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Socket.IO connection
export const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling']
});

// API Functions
export const getStatus = async () => {
  const response = await api.get('/status');
  return response.data;
};

export const sendCommand = async (command) => {
  const response = await api.post('/control', { command });
  return response.data;
};

export const getHistory = async (page = 1, limit = 50) => {
  const response = await api.get(`/history?page=${page}&limit=${limit}`);
  return response.data;
};

export const getDailyStats = async () => {
  const response = await api.get('/stats/daily');
  return response.data;
};

export default api;