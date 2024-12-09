// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem('token');

  // If no token exists, redirect to login page
  return token ? element : <Navigate to="/" />;
};

export default PrivateRoute;
