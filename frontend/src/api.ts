// src/api.ts
import axios from 'axios';

const API_URL = 'http://127.0.0.1:3000/api';

export const api = axios.create({
  baseURL: API_URL,
});

// Auth endpoints
export const register = async (username: string, password: string, role: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, { username, password, role });
    return response.data;
  } catch (error: any) {
    console.error('Error during registration:', error.response?.data || error.message);
    throw error;
  }
};

export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { username, password });
    return response.data;
  } catch (error: any) {
    console.error('Error during login:', error.response?.data || error.message);
    throw error;
  }
};

export const logout = () => api.get('/auth/logout');

export const assignRole = async (username: string, newRole: string) => {
  return axios.post('/assign-role', { username, newRole });
};

// Products endpoints
export const getProducts = () => api.get('/products');
export const getProduct = (id: string) => api.get(`/products/${id}`);
export const createProduct = (product: any) => api.post('/products', product);
export const updateProduct = (id: string, product: any) => api.put(`/products/${id}`, product);
export const deleteProduct = (id: string) => api.delete(`/products/${id}`);