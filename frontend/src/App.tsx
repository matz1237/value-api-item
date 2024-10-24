//frontend/src//App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from './components/Auth';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import AssignRole from './components/AssignRole';
import PrivateRoute from './components/PrivateRoute'; // New PrivateRoute
import Navbar from './components/Navbar'; // New Navbar
import './App.css';

const App = () => {
  return (
    <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/products" element={<PrivateRoute element={<ProductList />} />} />
          <Route path="/products/new" element={<PrivateRoute element={<ProductForm onSuccess={() => window.location.href = '/products'} />} />} />
        <Route path="/products/edit/:id" element={<PrivateRoute element={<ProductForm onSuccess={() => window.location.href = '/products'} />} />} />
        <Route path="/assign-role" element={<PrivateRoute element={<AssignRole />} />} />
        </Routes>
    </Router>
  );
};

export default App;
