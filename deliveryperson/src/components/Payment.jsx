import React from 'react';
import './css/Payment.css'; // Import specific styles for Payment

const Payment = () => {
  const handleMarkDone = () => {
    // Logic to mark payment as done
  };

  return (
    <div className="payment-dashboard">
      <h2>Payment Dashboard</h2>
      {/* Render payment options here */}
      <button className="btn-mark-done" onClick={handleMarkDone}>Mark Payment as Done</button>
    </div>
  );
};

export default Payment;
