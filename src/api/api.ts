import axios from 'axios';
import { SensorData, ApiAsapData, ListrikData } from '../types';

const API_URL = import.meta.env.VITE_API_URL;

// Add token to all requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication
export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Invalid username or password');
    }
    throw error;
  }
};

// Sensor data endpoints
export const fetchSensor1Data = async (): Promise<SensorData> => {
  try {
    const response = await axios.get(`${API_URL}/sensor1`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sensor 1 data:', error);
    throw error;
  }
};

export const fetchSensor2Data = async (): Promise<SensorData> => {
  try {
    const response = await axios.get(`${API_URL}/sensor2`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sensor 2 data:', error);
    throw error;
  }
};

// Fire and smoke sensor endpoints
export const fetchFireSmokeData = async (): Promise<ApiAsapData> => {
  try {
    const response = await axios.get(`${API_URL}/fire-smoke`);
    return response.data;
  } catch (error) {
    console.error('Error fetching fire and smoke data:', error);
    throw error;
  }
};

// Electricity data endpoints
export const fetchElectricityData = async (): Promise<ListrikData> => {
  try {
    const response = await axios.get(`${API_URL}/electricity`);
    return response.data;
  } catch (error) {
    console.error('Error fetching electricity data:', error);
    throw error;
  }
};

// Export data endpoints
export const exportData = async (type: 'sensor' | 'fire-smoke' | 'electricity'): Promise<Blob> => {
  try {
    const response = await axios.get(`${API_URL}/export/${type}`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting data:', error);
    throw error;
  }
};