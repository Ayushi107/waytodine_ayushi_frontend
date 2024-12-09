import React, { useState } from 'react';
import OrderDetails from './OrderDetails';
import './css/Orders.css'; // Import specific styles for Orders

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const orders = []; // Fetch or mock your orders here

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  return (
    <div className="orders-container">
      <h2 className="orders-title">Orders</h2>
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-item" onClick={() => handleOrderClick(order)}>
            <span>{order.status}</span> - <span>{order.customerName}</span>
          </div>
        ))}
      </div>
      {selectedOrder && <OrderDetails order={selectedOrder} />}
    </div>
  );
};

export default Orders;
