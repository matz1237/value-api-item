//frontend/src//App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from './components/Auth';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import AssignRole from './components/AssignRole';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/new" element={<ProductForm onSuccess={() => window.location.href = '/products'} />} />
          <Route path="/products/edit/:id" element={<ProductForm onSuccess={() => window.location.href = '/products'} />} />
          <Route path="/assign-role" element={<AssignRole />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
