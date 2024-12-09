// Header.jsx
import React from 'react';
import { Navbar } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import './css/Header.css';
import adminimage from '../images/admin.jpg';

const Header = () => {
    const location = useLocation();

    // Function to determine the page title based on the route
    const getPageTitle = () => {
        switch (location.pathname) {
            case '/':
                return 'Dashboard';
            case '/orders':
                return 'Order List';
            case '/users':
                return 'User List';
            case '/restaurants':
                return 'Restaurant List';
            case '/menu':
                return 'Menu List';
            case '/delivery-partners':
                return 'Delivery Partners';
            case '/profile':
                return 'Profile';
            default:
                return 'Page';
        }
    };

    return (
        <Navbar bg="light" variant="dark" className="justify-content-between">
            <div className="header-title" style={{ flexGrow: 1 }}>
                <h2 className="page-title">{getPageTitle()}</h2> {/* Display dynamic page title */}
            </div>
            <Navbar.Brand className="ml-auto">
                <div className="admin-info">
                    <img
                        src={adminimage}
                        width="50"
                        height="50"
                        className="admin-image"
                        alt="Admin"
                    />
                    <span className="admin-name">ayushi</span>
                </div>
            </Navbar.Brand>
        </Navbar>
    );
};

export default Header;
