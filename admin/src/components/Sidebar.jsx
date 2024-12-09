// Sidebar.jsx
import {React, useState} from 'react';
import { Nav } from 'react-bootstrap';
import { FaHome, FaShoppingCart, FaUsers,FaBars, FaUtensils, FaClipboardList, FaUserFriends, FaUser } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation to detect the current route
import './css/Sidebar.css';
import logoImage from '../images/logo.jpg';

const Sidebar = () => {
    const location = useLocation(); // Get the current path
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false); 

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <>
          {/* Hamburger Menu */}
          <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
                <FaBars />
            </button>
        <Nav  className="flex-column sidebar">
            <h2 className="sidebar-title">
                <img
                    src={logoImage}
                    alt="WayToDine Logo"
                    style={{ width: '50px', height: '50px', marginRight: '5px' }}
                />
                WayToDine
            </h2>
            <Nav.Link href="/dashboard" className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                <FaHome className="nav-icon" /> Dashboard
            </Nav.Link>
            <Nav.Link href="/orders" className={`nav-item ${location.pathname === '/orders' ? 'active' : ''}`}>
                <FaShoppingCart className="nav-icon" /> Orders
            </Nav.Link>
            <Nav.Link href="/users" className={`nav-item ${location.pathname === '/users' ? 'active' : ''}`}>
                <FaUsers className="nav-icon" /> Users
            </Nav.Link>
            <Nav.Link href="/restaurants" className={`nav-item ${location.pathname === '/restaurants' ? 'active' : ''}`}>
                <FaUtensils className="nav-icon" /> Restaurants
            </Nav.Link>
            <Nav.Link href="/category" className={`nav-item ${location.pathname === '/category' ? 'active' : ''}`}>
                <FaClipboardList className="nav-icon" /> Category
            </Nav.Link>
            <Nav.Link href="/menu" className={`nav-item ${location.pathname === '/menu' ? 'active' : ''}`}>
                <FaClipboardList className="nav-icon" /> Menu
            </Nav.Link>
            <Nav.Link href="/delivery-partners" className={`nav-item ${location.pathname === '/delivery-partners' ? 'active' : ''}`}>
                <FaUserFriends className="nav-icon" /> Delivery Partners
            </Nav.Link>
            <Nav.Link href="/profile" className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}>
                <FaUser className="nav-icon" /> Profile
            </Nav.Link>
            <Nav.Link onClick={handleLogout} className="nav-item logout">
                <FaUser className="nav-icon" /> Logout
            </Nav.Link>
        </Nav>
        </>
    );
};

export default Sidebar;
