import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import OrderList from './components/OrderList';
import UserList from './components/UserList';
import RestaurantList from './components/RestaurantList';
import DeliveryPartners from './components/DeliveryPartners';
import MenuList from './components/MenuList';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Profile from './components/Profile';
import Login from './components/Login';
import ForgotPassword from './components/ForgetPassword';
import ChangePassword from './components/ChangePassword';
import Category from './components/Category';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {

  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    // You might add logic here to check if the token is expired or valid
    return token !== null;
};

  return (
    <Router>
      <Routes>
      
        <Route path="/" element={isAuthenticated() ? <Navigate to="/dashboard"/> : <Login />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/changePassword" element={<ChangePassword />} />


        
        <Route path="/*" element={<PrivateRoute element={
          <>
            <Header />
            <div className="app-container">
              <div className="sidebar-container">
                <Sidebar />
              </div>
              <div className="dashboard-container">
                <Routes>
                  <Route exact path="/dashboard" element={<Dashboard />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/orders" element={<OrderList />} />
                  <Route path="/users" element={<UserList />} />
                  <Route path="/restaurants" element={<RestaurantList />} />
                  <Route path="/category" element={<Category />} />
                  <Route path="/menu" element={<MenuList />} />
                  <Route path="/delivery-partners" element={<DeliveryPartners />} />
                </Routes>
              </div>
            </div>
          </>
        } />} />
      </Routes>
    </Router>
  );
}

export default App;
