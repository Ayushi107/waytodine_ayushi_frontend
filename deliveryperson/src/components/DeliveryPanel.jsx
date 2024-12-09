import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Card, Table, Modal, Alert } from 'react-bootstrap';
import { FaTruck, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import personimage from '../images/admin.jpg';
import logo from '../images/logo.jpg';
import MapComponent from './MapComponent';
import axios from 'axios';
import { API_BASE_URL } from './Apiconfig';
const DeliveryPanel = () => {
  const [orderStatus, setOrderStatus] = useState('assigned');
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [otp, setOtp] = useState(""); // For OTP input
  const [otpModalShow, setOtpModalShow] = useState(false); // For OTP modal visibility
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [driver, setDriver] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedDriver = localStorage.getItem('driver');
    console.log(storedDriver, "wertyuiop");

    if (storedDriver) {
      try {
        const parsedDriver = JSON.parse(storedDriver);
        setDriver(parsedDriver);
      } catch (e) {
        console.error("Error parsing driver data:", e);
        setDriver(null);
      }
    } else {
      console.warn("No driver data found in session storage.");
      setDriver(null);
    }
  }, []);

  // const orders = [
  //   { id: 1, restaurant: 'Hi-Tech Bawarchi', items: 3, name: 'John', status: 'new', lat: 12.9715987, lng: 77.594566, total: 150 },
  //   { id: 2, restaurant: 'Golconda Chefs', items: 2, name: 'Alice', status: 'new', lat: 12.2958104, lng: 76.6393805, total: 90 },
  //   { id: 3, restaurant: 'Spicy Kitchen', items: 1, name: 'Bob', status: 'ready', lat: 12.9715987, lng: 77.594566, total: 50 },
  //   { id: 4, restaurant: 'Sweet Treats', items: 4, name: 'Emma', status: 'past', lat: 12.9611159, lng: 77.6966601, total: 200 },
  // ];

  // const filteredOrders = orders.filter(order => order.status === orderStatus);

  const fetchOrders = async (status) => {
    let endpoint;
    switch (status) {
      case 'assigned':
        endpoint = `${API_BASE_URL}Driver/get-assigned-orders`;
        break;
      case 'accepted':
        endpoint = `${API_BASE_URL}Driver/get-accepted-orders`;
        break;
      case 'delivered':
        endpoint = `${API_BASE_URL}Driver/get-delivered-orders`;
        break;
      default:
        return;
    }

    try {
      const response = await axios.post(endpoint, { DriverId: driver.deliveryPersonId }); // Replace with dynamic DriverId
      const resolvedOrders = resolveReferences(response.data.$values);
      setOrders(resolvedOrders);
      console.log(response.data.$values);

    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  useEffect(() => {
    fetchOrders(orderStatus);
  }, [orderStatus]);


  const fetchOrderDetails = async (orderId) => {

    try {
      const response = await axios.post(`${API_BASE_URL}Driver/get-order-details`, { DriverId: orderId });
      setSelectedOrder(response.data);
      console.log(response.data);


    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const AcceptOrDeclineOrder = async (orderId, DriverId, AcceptOrDecline) => {

    try {
      const response = await axios.post(`${API_BASE_URL}Driver/accept-decline-order`, { OrderId: orderId, DriverId: DriverId, AcceptOrDecline: AcceptOrDecline });
      alert(response.data)
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const handleOrderClick = (order) => {
    console.log(order);

    fetchOrderDetails(order.orderId);
    setModalShow(true);
  };

  const handleOrderStatusChange = (status) => {

    setOrderStatus(status);
    fetchOrders(status);
    setModalShow(false);
  };

  const handleAcceptOrder = () => {
    console.log('Order accepted:', selectedOrder);
    AcceptOrDeclineOrder(selectedOrder.orderId, driver.deliveryPersonId, true)// replace the id with session id
    setModalShow(false);
  };

  const handleDeclineOrder = () => {
    console.log('Order declined:', selectedOrder);
    AcceptOrDeclineOrder(selectedOrder.orderId, driver.deliveryPersonId, false)// replace the id with session id
    setSelectedOrder(null);
    setModalShow(false);
  };


  const handleConfirmDelivery = async (orderId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}Driver/generate-otp`, {
        DriverId: orderId,
      });
      alert(response.data);
    } catch (error) {
      console.error("Error verifying delivery OTP:", error);
      alert("Error while verifying delivery. Please try again.");
    }
    setCurrentOrderId(orderId);
    setOtpModalShow(true); // Open the OTP modal
  };


  const resolveReferences = (data) => {
    const idMap = {};

    // Step 1: Create a map of all objects with $id
    data.forEach((order) => {
      if (order.customer?.$id) {
        idMap[order.customer.$id] = order.customer;
      }
      if (order.restaurant?.$id) {
        idMap[order.restaurant.$id] = order.restaurant;
      }
    });

    // Step 2: Replace $ref with actual objects
    data.forEach((order) => {
      if (order.customer?.$ref) {
        order.customer = idMap[order.customer.$ref];
      }
      if (order.restaurant?.$ref) {
        order.restaurant = idMap[order.restaurant.$ref];
      }
    });

    return data;
  };


  const handleVerifyOtp = async () => {
    if (!otp) {
      alert("Please enter the OTP!");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}Driver/confirm-delivery`, {
        OrderId: currentOrderId,
        DriverId: driver.deliveryPersonId, // Replace with session DriverId
        EnteredOtp: otp,
      });


      alert(response.data);
      setOtp(""); // Reset OTP input
      setOtpModalShow(false); // Close the OTP modal
      fetchOrders("accepted"); // Refresh the orders list
    } catch (error) {
      console.error("Error Confirming delivery OTP:", error);
      alert("Error while Confirming delivery. Please try again.");
    }
  };


  return (
    <Container fluid>
      <Row>
        <Col xs={2} className=" sidebar">
          <img src={logo} alt="Restaurant Logo" className="sidebar-logo" />
          <div className="sidebar-menu">
            <div className="sidebar-item">
              <div className="icon-circle">
                <FaTruck />
              </div>
              Orders
            </div>
            <div className="sidebar-item">
              <div className="icon-circle">
                <FaCheckCircle />
              </div>
              Payments
            </div>
            <div className="sidebar-item" onClick={() => navigate("/profile")}>
              <div className="icon-circle">
                <FaCheckCircle />
              </div>
              Profile
            </div>
          </div>
        </Col>

        <Col xs={11} className="bg-light">
          <Row className="header">
            <Col className="text-right d-flex justify-content-between align-items-center">
              <h2 className="text-dark">Manage Orders</h2>
              <div className="profile-info d-flex align-items-center">
                <img src={personimage} alt="Profile" className="profile-image" />
                <span className="text-dark">{driver?.driverName || "notfound"}</span>
              </div>
            </Col>
          </Row>

          <Container className="content-container my-4" fluid>
            <Row className="my-4">
              <Col>
                <Button variant={orderStatus === 'assigned' ? 'warning' : 'outline-warning'} className="status-button" onClick={() => handleOrderStatusChange('assigned')}>
                  Assigned
                </Button>
                <Button variant={orderStatus === 'accepted' ? 'warning' : 'outline-warning'} className="status-button" onClick={() => handleOrderStatusChange('accepted')}>
                  Accepted
                </Button>
                <Button variant={orderStatus === 'delivered' ? 'warning' : 'outline-warning'} className="status-button" onClick={() => handleOrderStatusChange('delivered')}>
                  Delivered
                </Button>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Card className="mb-3">
                  <Card.Header as="h5">Order List</Card.Header>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Order Id</th>
                        <th>Restaurant Name</th>
                        <th>Customer Name</th>
                        <th>Delivery Address</th>
                        <th>Total</th>
                        <th>OrderStatus</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.orderId}>
                          <td>{order.orderId}</td>
                          <td>{order.restaurant?.name || "Unknown"}</td>
                          <td>{order.customer?.firstName + order.customer.lastName || "Unknown"}</td>
                          <td>{order.customer.location}</td>
                          <td>{order.totalAmount}</td>
                          <td>{order.orderStatus === 1 ? "Placed" : order.orderStatus === 2 ? "Preparing" : order.orderStatus === 3 ? "Out for Delivery" : order.orderStatus === 4 ? "Delivered" : "unkonwn"}
                          </td>
                          <td>
                            {(orderStatus === "delivered" || orderStatus === "assigned") && (
                              <Button variant="info" onClick={() => handleOrderClick(order)}>
                                View Details
                              </Button>
                            )}
                            {orderStatus === "accepted" && (
                              <Button
                                variant="success"
                                onClick={() => handleConfirmDelivery(order.orderId)}
                                disabled={order.orderStatus === 4}
                                className="ml-2"
                              >
                                Confirm Delivery
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card>
              </Col>
            </Row>
          </Container>

          <Modal show={modalShow} onHide={() => setModalShow(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Order Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedOrder && (
                <>

                  <p><strong>Restaurant:</strong> {selectedOrder.restaurant?.name}</p>
                  <p><strong>Customer:</strong> {selectedOrder.customer?.firstName}</p>
                  <p><strong>Status:</strong> {selectedOrder.orderStatus === 1 ? "Placed" : selectedOrder.orderStatus === 2 ? "Preparing" : selectedOrder.orderStatus === 3 ? "Out for Delivery" : selectedOrder.orderStatus === 4 ? "Delivered" : "unkonwn"}</p>
                  {/* <p><strong>Address:</strong> {selectedOrder.customer.location}</p> */}
                  <p><strong>Total Amount:</strong> {selectedOrder.totalAmount}</p>
                  <p><strong>Order Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  {/* <MapComponent customerLocation={[selectedOrder.customer.address.latitude, selectedOrder..customer.address.longitude]} restaurantLocation={[12.9715987, 77.594566]} /> */}
                  <MapComponent customerLocation={[56.567, 56.4567]} restaurantLocation={[12.9715987, 77.594566]} />

                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="success"
                onClick={handleAcceptOrder}
                disabled={selectedOrder.orderStatus === 4}
              >
                Accept Order
              </Button>
              <Button variant="danger" onClick={handleDeclineOrder}>Decline Order</Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>

      {/* OTP Modal */}

      <Modal show={otpModalShow} onHide={() => setOtpModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Verify Delivery OTP</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Enter the OTP sent to the customer to confirm delivery.</p>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="form-control"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setOtpModalShow(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleVerifyOtp}>
            Verify OTP
          </Button>
        </Modal.Footer>
      </Modal>

    </Container >
  );
};

export default DeliveryPanel;