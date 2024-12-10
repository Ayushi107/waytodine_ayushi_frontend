import React, { useState, useEffect } from 'react';
import { Container, Table, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'; // Reactstrap components
import axios from 'axios';
import API_BASE_URL from '../Apiconfig';

const RestaurantList = () => {

    const [restaurants, setRestaurants] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState(false);
    const [restaurantDetails, setRestaurantDetails] = useState(null);
    const [pagination, setPagination] = useState({
        pageNumber: 1,
        pageSize: 5, // Default page size
        totalPages: 0,
        totalRecords: 0,
    });


    const fetchRestaurants = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}Listing/get-Restaurants`, {
                pageNumber: pagination.pageNumber,
                pageSize: pagination.pageSize,
            });

            if (response.data) {
                setRestaurants(response.data.data.$values); // Set orders
                setPagination({
                    pageNumber: response.data.pageNumber,
                    pageSize: response.data.pageSize,
                    totalPages: response.data.totalPages,
                    totalRecords: response.data.totalRecords,
                });
            }
            // console.log(response.data.data.$values);

        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchRestaurants();
    }, [pagination.pageNumber, pagination.pageSize]);


    const handlePageChange = (direction) => {
        const newPageNumber = pagination.pageNumber + direction;
        setPagination((prev) => ({
            ...prev,
            pageNumber: newPageNumber,
        }));
    };


    const SearchRestaurant = async (pageNumber = 1, pageSize = 10, searchTerm = '') => {

        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}Searching/search-restaurants`, {
                RestaurantName: searchTerm,
                pageNumber,
                pageSize,
            });

            if (response.data) {
                setRestaurants(response.data.data.$values); // Set orders
                // console.log(response.data.data.$values);

                setPagination({
                    pageNumber: response.data.pageNumber,
                    pageSize: response.data.pageSize,
                    totalPages: response.data.totalPages,
                    totalRecords: response.data.totalRecords,
                });
            }
        } catch (error) {
            console.error('Error fetching Restaurants:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        const searchTerm = e.target.value;
        setSearch(searchTerm);
        SearchRestaurant(1, pagination.pageSize, searchTerm); // Fetch orders with updated search term
    };


    const handleVerifyRestaurant = async (resId) => {
        try {
            const response = await axios.post(`${API_BASE_URL}Admin/verify/restaurant-user`, { VerificationId: resId });
            console.log(response);

            // if (response.status === 200) {
            alert("Restaurant verified successfully!");
            fetchRestaurants(pagination.pageNumber, pagination.pageSize);
            // } else {
            //     alert("Verification failed. Please try again.");
            // }
        } catch (error) {
            console.error('Error verifying restaurant:', error);
            alert("Something went wrong. Please try again.");
        }
    };

    const handleRestaurantDetails = async (restaurantId) => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}Listing/get-Restaurant-details`, {
                RestaurantId: restaurantId,
            });
  
            console.log(response.data.$values[0]);
            
            if (response.data) {
                setRestaurantDetails(response.data.$values[0]);
                setModal(true); // Open the modal
            } else {
                alert('No restaurant details found.');
            }
        } catch (error) {
            console.error('Error fetching restaurant details:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const toggleModal = () => setModal(!modal);


    // const [search, setSearch] = useState('');
    // const restaurants = [
    //     { id: 1, name: 'Pizza Place', address: '123 Main St', totalOrders: 150 },
    //     { id: 2, name: 'Burger Spot', address: '456 Side St', totalOrders: 120 },
    // ];
    // const filteredOrders = restaurants.filter(order =>
    //     restaurants.name.toLowerCase().includes(search.toLowerCase())
    // );

    return (
        <Container className="mt-4 p-4" style={{ borderRadius: '10px', backgroundColor: '#fff', boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)' }}>
            <h2 className="mb-4">Restaurant</h2>

            {/* Search bar */}
            <Input
                type="text"
                placeholder="Search by Restaurant name"
                className="mb-4"
                value={search}
                onChange={handleSearchChange}
                style={{ width: '300px' }}
            />

            {/* Restaurant Table */}

            {loading ? (
                <p>Loading restaurants...</p>
            ) : (
                <Table bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Restaurant ID</th>
                            <th>Restaurant Name</th>
                            <th>City</th>
                            <th>Country</th>
                            <th>RestaurantDocument</th>
                            <th>IsVerified</th>
                            <th>View Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {restaurants.length > 0 ? (
                            restaurants.map(restaurant => (
                                <tr key={restaurant.restaurantId}>
                                    <td>{restaurant.restaurantId}</td>
                                    <td>{restaurant.name}</td>
                                    <td>{restaurant.city}</td>
                                    <td>{restaurant.country}</td>
                                    <td>{restaurant.restaurantDocument}</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={restaurant.status === 1}
                                            disabled={restaurant.status !== 1}
                                            onChange={() => handleVerifyRestaurant(restaurant.restaurantId)}
                                        />
                                    </td>
                                    <td>
                                        <Button
                                            color="info"
                                            onClick={() => handleRestaurantDetails(restaurant.restaurantId)}
                                        >
                                            View Details
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center">No restaurants found</td>
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


            {/* Modal for viewing restaurant details */}
            <Modal isOpen={modal} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>Restaurant Details</ModalHeader>
                <ModalBody>
                    {restaurantDetails ? (
                        <div>
                            <p><strong>ID:</strong> {restaurantDetails.restaurantDetailsId}</p>
                            <p><strong>Current Offer Discount:</strong> {restaurantDetails.currentOfferDiscountRate}</p>
                            <p><strong>Opening Hours (WeekDays):</strong> {restaurantDetails.openingHoursWeekdays}</p>
                            <p><strong>Opening Hours (Weekend):</strong> {restaurantDetails.openingHoursWeekends}</p>
                            <p><strong>Specialites:</strong> {restaurantDetails.specialities}</p>

                        </div>
                    ) : (
                        <p>No details available</p>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggleModal}>Close</Button>
                </ModalFooter>
            </Modal>

        </Container >

    );
};

export default RestaurantList;
