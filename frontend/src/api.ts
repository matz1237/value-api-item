//frontend/src/api.ts
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

// Auth endpoints
export const register = async (username: string, password: string, role: string) => {
  try {
    const response = await api.post('/auth/register', { username, password, role });
    return response.data;
  } catch (error: any) {
    console.error('Error during registration:', error.response?.data || error.message);
    throw error;
  }
};

export const login = async (username: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  } catch (error: any) {
    console.error('Error during login:', error.response?.data || error.message);
    throw error;
  }
};

export const logout = () => api.get('/auth/logout');

export const assignRole = async (username: string, newRole: string) => {
  try {
    const response = await api.post('/auth/assign-role', { username, newRole });
    return response.data;
  } catch (error: any) {
    console.error('Error assigning role:', error.response?.data || error.message);
    throw error;
  }
};

// Products endpoints
export const getProducts = () => api.get('/products');
export const getProduct = (id: string) => api.get(`/products/${id}`);
export const createProduct = (product: any) => api.post('/products', product);
export const updateProduct = (id: string, product: any) => api.put(`/products/${id}`, product);
export const deleteProduct = (id: string) => api.delete(`/products/${id}`);