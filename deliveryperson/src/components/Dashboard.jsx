import React, { useState } from 'react';
import { Button, Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import { FaBars, FaTruck, FaCheckCircle, FaMoneyCheckAlt } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const DeliveryPanel = () => {
  const [orderStatus, setOrderStatus] = useState('new');

  const handleOrderClick = () => {
    setOrderStatus('accepted');
    // Logic to open map goes here
  };

  return (
    <Container fluid>
      {/* Sidebar */}
      <Row>
        <Col md={2} className="bg-navy sidebar">
          <div className="sidebar-menu">
            <div className="sidebar-item">
              <FaTruck /> Orders
            </div>
            <div className="sidebar-item">
              <FaCheckCircle /> Payments
            </div>
          </div>
        </Col>

        {/* Main Content */}
        <Col md={10} className="bg-light content-section">
          {/* Header */}
          <Row className="header bg-navy">
            <Col className="text-right d-flex justify-content-between align-items-center">
              <h2 className="text-white">Manage Orders</h2>
              <div className="profile-info d-flex align-items-center">
                <img src="/path/to/profile.jpg" alt="Profile" className="profile-image" />
                <span className="text-white">John Doe</span>
              </div>
            </Col>
          </Row>

          {/* Status Buttons */}
          <Row className="my-4">
            <Col>
              <Button variant={orderStatus === 'new' ? 'warning' : 'outline-warning'} className="status-button">
                New
              </Button>
              <Button variant={orderStatus === 'preparing' ? 'warning' : 'outline-warning'} className="status-button">
                Preparing
              </Button>
              <Button variant={orderStatus === 'ready' ? 'warning' : 'outline-warning'} className="status-button">
                Ready
              </Button>
              <Button variant="outline-dark" className="status-button">
                Past Orders
              </Button>
            </Col>
          </Row>

          {/* Order List and Details */}
          <Row>
            <Col md={6}>
              <Card className="mb-3">
                <Card.Header as="h5">Order List</Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Hi-Tech Bawarchi</strong> - 3 items
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Golconda Chefs</strong> - 2 items
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="mb-3">
                <Card.Header as="h5">Order Details</Card.Header>
                <Card.Body>
                  <p><strong>Restaurant:</strong> Hi-Tech Bawarchi</p>
                  <p><strong>Items:</strong> 3</p>
                  <p><strong>Status:</strong> Ready</p>
                  <Button variant="primary" onClick={handleOrderClick}>Accept Order</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Confirm and Map Button */}
          <Row className="mt-4">
            <Col>
              <Button variant="outline-danger" className="mr-2">Mark Out of Stock</Button>
              <Button variant="success">Confirm Order</Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default DeliveryPanel;
