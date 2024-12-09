import React, { useState, useEffect } from 'react';
import { Container, Table, Input, Button } from 'reactstrap'; // Reactstrap components
import { MDBBadge } from 'mdb-react-ui-kit'; // Optional badge for styling
import axios from 'axios';
import API_BASE_URL from '../Apiconfig';
import './css/Button.css';

const Orders = () => {
    // const [search, setSearch] = useState('');
    // const [orders] = useState([
    //     { id: 1, date: '2024-10-21', status: 'Delivered', customer: 'John Doe', purchased: 'Pizza', total: '$50', delivered: 'Yes' },
    //     { id: 2, date: '2024-10-22', status: 'On Hold', customer: 'Jane Smith', purchased: 'Burger', total: '$75', delivered: 'No' },
    //     { id: 3, date: '2024-10-23', status: 'Delivered', customer: 'Sam Green', purchased: 'Salad', total: '$30', delivered: 'Yes' },
    //     // Add more orders here if needed
    // ]);

    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        pageNumber: 1,
        pageSize: 5, // Default page size
        totalPages: 0,
        totalRecords: 0,
    });

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}Listing/get-orders`, {
                pageNumber: pagination.pageNumber,
                pageSize: pagination.pageSize,
            });

            console.log(response.data.data.$values);

            if (response.data) {
                setOrders(response.data.data.$values); // Set orders
                setPagination({
                    pageNumber: response.data.pageNumber,
                    pageSize: response.data.pageSize,
                    totalPages: response.data.totalPages,
                    totalRecords: response.data.totalRecords,
                });
            }
            console.log(response.data.data.$values);

        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchOrders();
    }, [pagination.pageNumber, pagination.pageSize]);


    const handlePageChange = (direction) => {
        const newPageNumber = pagination.pageNumber + direction;
        setPagination((prev) => ({
            ...prev,
            pageNumber: newPageNumber,
        }));
    };


    const SearchOrders = async (pageNumber = 1, pageSize = 10, searchTerm = '') => {

        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}Searching/search-orders`, {
                RestaurantName: searchTerm,
                pageNumber,
                pageSize,
            });

            if (response.data) {
                setOrders(response.data.data.$values); // Set orders
                // console.log(response.data.data.$values);

                setPagination({
                    pageNumber: response.data.pageNumber,
                    pageSize: response.data.pageSize,
                    totalPages: response.data.totalPages,
                    totalRecords: response.data.totalRecords,
                });
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        const searchTerm = e.target.value;
        setSearch(searchTerm);
        SearchOrders(1, pagination.pageSize, searchTerm); // Fetch orders with updated search term
    };



    // Filter orders based on the search input
    // const filteredOrders = orders.filter(order =>
    //     order.customer.toLowerCase().includes(search.toLowerCase())
    // );

    return (
        <Container className="mt-4 p-4" style={{ borderRadius: '10px', backgroundColor: '#fff', boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)' }}>
            <h2 className="mb-4">Orders</h2>

            {/* Search bar */}
            <Input
                type="text"
                placeholder="Search by Restaurant name"
                className="mb-4"
                value={search}
                onChange={handleSearchChange}
                style={{ width: '300px' }}
            />


            {/* Orders Table */}
            {loading ? (
                <p>Loading orders...</p>
            ) : (
                <Table bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Restaurant</th>
                            <th>Customer</th>
                            <th>OrderStatus</th>
                            <th>Order Items</th>
                            <th>Amount</th>
                            <th>OrderDate</th>
                            <th>PaymentStatus</th>
                            {/* <th>orderItems</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? (
                            orders.map(order => (
                                <tr key={order.orderId}>
                                    <td>{order.orderId}</td>
                                    <td>{order.restaurant.name}</td>
                                    <td>{order.customer.firstName} {order.customer.lastName}</td>
                                    <td>
                                        <Button className={`btn-custom ${order.orderStatus === 4 ? 'btn-success' : 'btn-warning'}`}>
                                            {order.orderStatus === 1 ? "Placed" : order.orderStatus === 2 ? "Preparing" : order.orderStatus === 3 ? "Out for Delivery" : order.orderStatus === 4 ? "Delivered" : "unkonwn"}
                                        </Button>
                                    </td>
                                    <td>
                                        {order.cartItems.$values.map((item, index) => (
                                            <div key={index} style={{ marginBottom: "8px" }}>
                                                <strong>{item.item.name}</strong><br />
                                                Quantity: {item.quantity} <br />
                                                Price: ₹{item.item.price} <br />
                                                Total: ₹{item.total}
                                            </div>
                                        ))}
                                    </td>
                                    <td>{order.totalAmount}</td>
                                    <td>{order.createdAt}</td>
                                    <td>
                                        {order.paymentStatus === 1 ? "Pending" :
                                            order.paymentStatus === 2 ? "Completed" :
                                                order.paymentStatus === 3 ? "Failed" : "Unknown"}
                                    </td>                                    {/* <td>{order.orderItems}</td> */}
                                    {/* <td>
                                        <MDBBadge color={order.delivered === 'Yes' ? 'success' : 'danger'}>
                                            {order.delivered}
                                        </MDBBadge>
                                    </td> */}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center">No orders found</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            )}



            <div className="d-flex justify-content-between mt-3">
                <Button
                    disabled={pagination.pageNumber === 1}
                    onClick={() => handlePageChange(-1)}
                >
                    Previous
                </Button>
                <span>Page {pagination.pageNumber} of {pagination.totalPages}</span>
                <Button
                    disabled={pagination.pageNumber === pagination.totalPages}
                    onClick={() => handlePageChange(1)}
                >
                    Next
                </Button>
            </div>

        </Container >
    );
};

export default Orders;
