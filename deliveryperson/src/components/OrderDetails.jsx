import React from 'react';
import './css/OrderDetails.css'; // Import specific styles for OrderDetails
import MapComponent from './MapComponent';

const OrderDetails = ({ order }) => {
  const handleAccept = () => {
    // Integrate the map here
    <MapComponent/>
  };

  return (
    <div className="order-details">
      <h3>Order Details</h3>
      <p>Customer: {order.customerName}</p>
      <p>Address: {order.address}</p>
      <button className="btn-accept" onClick={handleAccept}>Accept</button>
      <button className="btn-decline">Decline</button>
      {/* Render the map when the order is accepted */}
    </div>
  );
};

export default OrderDetails;
