//frontend/src/components/PrivateRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  element: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const token = localStorage.getItem('token');
  
  // If no token, redirect to login page
  return token ? element : <Navigate to="/" />;
};

export default PrivateRoute;
