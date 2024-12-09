import React from 'react';
import './css/SideBar.css'; // Custom CSS for Sidebar styling

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li>Dashboard</li>
          <li>Orders</li>
          <li>Payments</li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
