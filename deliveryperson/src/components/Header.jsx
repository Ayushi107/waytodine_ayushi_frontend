// import React from 'react';
// import './css/Header.css'; // Custom CSS for Header styling

// const Header = () => {
//   return (
//     <header className="header">
//       <h2>Delivery Person Dashboard</h2>
//       <div className="profile">
//         <img src="/path/to/profile-image.jpg" alt="Profile" className="profile-image" />
//         <span>John Doe</span>
//       </div>
//     </header>
//   );
// };

// export default Header;























// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { CUSTOMER_BACKEND_URL, REACT_APP_GOOGLE_MAPS_API_KEY } from '../constants';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Modal from 'react-bootstrap/Modal';
// import Button from 'react-bootstrap/Button';
// import { GoogleMap, Marker, DirectionsService, DirectionsRenderer, useLoadScript } from '@react-google-maps/api';
// import Navbar from '../components/Navbar';

// function PaymentSuccess() {
//     const { orderId } = useParams();
//     const navigate = useNavigate();
//     const [orderStatus, setOrderStatus] = useState(null);
//     const [showModal, setShowModal] = useState(false);
//     const [driverLocation, setDriverLocation] = useState({ lat: 21.227341, lng: 72.894547 }); // Dummy location
//     const [loading, setLoading] = useState(true);
//     const [directions, setDirections] = useState(null);
//     const [directionsRequested, setDirectionsRequested] = useState(false);
//     const [directionsFetched, setDirectionsFetched] = useState(false);

//     const { isLoaded } = useLoadScript({
//         googleMapsApiKey: REACT_APP_GOOGLE_MAPS_API_KEY,
//     });

//     const token = localStorage.getItem('token');

//     useEffect(() => {
//         if (!token) {
//             toast.error('Please log in to add items to the cart.');
//             setTimeout(() => navigate("/login"), 1500);
//         }
//     }, [token, navigate]);

//     const updateOrderStatus = async (orderId) => {
//         try {
//             setLoading(true);
//             const response = await axios.post(
//                 ${CUSTOMER_BACKEND_URL}/order/update-order-status/${orderId}?newStatus=2,
//                 null,
//                 {
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Authorization': Bearer ${token},
//                     },
//                 }
//             );
//             console.log('Order status updated successfully:', response.data);
//             toast.success('Payment successful! Your order status has been updated.');
//         } catch (error) {
//             console.error('Error updating order status:', error);
//             toast.error('Error updating order status.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchOrderStatus = async (orderId) => {
//         try {
//             setLoading(true);
//             const response = await axios.get(${CUSTOMER_BACKEND_URL}/order/get-order-by-id/${orderId}, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': Bearer ${token},
//                 },
//             });
//             setOrderStatus(response.data.data.orderStatus);
//             console.log("orderStatus == ", response.data.data.orderStatus);
//         } catch (error) {
//             console.error('Error fetching order status:', error);
//             toast.error('Failed to fetch order details.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Removed the fetchDriverLocation API call for using dummy data
//     useEffect(() => {
//         if (orderId) {
//             updateOrderStatus(orderId);
//             fetchOrderStatus(orderId);
//         }
//     }, [orderId]);

//     useEffect(() => {
//         if (orderStatus && orderStatus === 3) {
//             setDriverLocation({ lat: 21.227341, lng: 72.894547 }); // Dummy driver location
//             if (!directionsRequested && !directionsFetched) {
//                 setDirectionsRequested(true);
//             }
//         }
//     }, [orderStatus, directionsRequested, directionsFetched, orderId]);

//     const handleDirectionsCallback = (response) => {
//         if (response && response.status === 'OK') {
//             setDirections(response);
//             setDirectionsFetched(true);
//         } else {
//             console.error('Directions request failed:', response);
//             toast.error('Failed to load directions.');
//         }
//     };

//     const handleModalShow = () => setShowModal(true);
//     const handleModalClose = () => setShowModal(false);

//     const startLocation = { lat: 21.227341, lng: 72.894547 };
//     const endLocation = { lat: 21.228125, lng: 72.833771 };

//     if (loading) {
//         return <p>Loading...</p>;
//     }

//     return (
//         <div>
//             <Navbar />
//             <h1>Payment Successful</h1>
//             <p>Thank you for your payment. Your order has been processed successfully.</p>
//             <ToastContainer />

//             {orderStatus && (
//                 <div>
//                     <h2>Order Stages</h2>
//                     <ul>
//                         <li>Order Placed: {orderStatus === 1 ? '✔️' : ''}</li>
//                         <li>Order Preparing: {orderStatus === 2 ? '✔️' : ''}</li>
//                         <li>Out for Delivery: {orderStatus === 3 ? '✔️' : ''}</li>
//                         <li>Delivered: {orderStatus === 4 ? '✔️' : ''}</li>
//                     </ul>

//                     {orderStatus === 3 && (
//                         <Button onClick={handleModalShow} variant="primary">Track Delivery Boy</Button>
//                     )}
//                 </div>
//             )}

//             <Modal show={showModal} onHide={handleModalClose} size="lg">
//                 <Modal.Header closeButton>
//                     <Modal.Title>Track Delivery Boy</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     {isLoaded ? (
//                         <GoogleMap
//                             mapContainerStyle={{ width: '100%', height: '400px' }}
//                             center={startLocation}
//                             zoom={14}
//                         >
//                             {directionsRequested && !directionsFetched && (
//                                 <DirectionsService
//                                     options={{
//                                         origin: startLocation,
//                                         destination: endLocation,
//                                         travelMode: 'DRIVING',
//                                     }}
//                                     callback={handleDirectionsCallback}
//                                 />
//                             )}
//                             {directions && (
//                                 <DirectionsRenderer
//                                     directions={directions}
//                                     options={{
//                                         polylineOptions: {
//                                             strokeColor: 'blue',
//                                             strokeOpacity: 0.8,
//                                             strokeWeight: 5,
//                                         },
//                                     }}
//                                 />
//                             )}
//                             <Marker position={startLocation} label="Start" />
//                             <Marker position={endLocation} label="End" />
//                             {/* Render the driver's marker with the dummy location */}
//                             {driverLocation && (
//                                 <Marker
//                                     position={driverLocation}
//                                     label="Driver"
//                                     icon={{ path: 'M 0,0 C -1,-1 -1,1 0,1 C 1,1 1,-1 0,0 Z', fillColor: 'red', fillOpacity: 1, strokeWeight: 1, scale: 1 }}
//                                 />
//                             )}
//                         </GoogleMap>
//                     ) : (
//                         <p>Loading map...</p>
//                     )}
//                 </Modal.Body>

//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={handleModalClose}>Close</Button>
//                 </Modal.Footer>
//             </Modal>
//         </div>
//     );
// }

// export default PaymentSuccess;
