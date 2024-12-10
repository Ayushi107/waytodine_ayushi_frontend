import React, { useState, useEffect } from 'react';
import { Container, Table, Input, Button,Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'; // Reactstrap components
import axios from 'axios';
import API_BASE_URL from '../Apiconfig';

const DeliveryPartners = () => {

    const [drivers, setDrivers] = useState([]);
    const [selectedDriver, setSelectedDriver] = useState(null); // To store the selected driver details
    const [modalOpen, setModalOpen] = useState(false); // Modal state
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        pageNumber: 1,
        pageSize: 5, // Default page size
        totalPages: 0,
        totalRecords: 0,
    });


    const fetchDrivers = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}Listing/get-Drivers`, {
                pageNumber: pagination.pageNumber,
                pageSize: pagination.pageSize,
            });

            console.log(response);

            if (response.data) {
                setDrivers(response.data.data.$values); // Set orders
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
        fetchDrivers();
    }, [pagination.pageNumber, pagination.pageSize]);


    const handlePageChange = (direction) => {
        const newPageNumber = pagination.pageNumber + direction;
        setPagination((prev) => ({
            ...prev,
            pageNumber: newPageNumber,
        }));
    };
    const handleVerifyDriver = async (driverId) => {
        try {
            const response = await axios.post(`${API_BASE_URL}Admin/verify/driver-user`, { VerificationId: driverId });
            console.log(response);

            // if (response.status === 200) {
            alert("Driver verified successfully!");
            fetchDrivers(pagination.pageNumber, pagination.pageSize);
            // } else {
            //     alert("Verification failed. Please try again.");
            // }
        } catch (error) {
            console.error('Error verifying restaurant:', error);
            alert("Something went wrong. Please try again.");
        }
    };


    const handleDriverDetails = (driver) => {
        setSelectedDriver(driver); // Set the selected driver object
        setModalOpen(true); // Open the modal
    };

    const toggleModal = () => setModalOpen(!modalOpen);




    // const [search, setSearch] = useState('');
    // const partners = [
    //     { id: 1, name: 'John Delivery', contact: '555-5555', currentOrder: 'None' },
    //     { id: 2, name: 'Mike Delivery', contact: '555-5556', currentOrder: 'Order #123' },
    // ];

    return (
        <Container className="mt-4 p-4" style={{ borderRadius: '10px', backgroundColor: '#fff', boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)' }}>
            <h2 className="mb-4">Delivery Partners</h2>

            {/* Search bar */}
            {/* <Input
                type="text"
                placeholder="Search by Driver name"
                className="mb-4"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '300px' }}
            /> */}

            {/* Drivers Table */}
            {loading ? (
                <p>Loading drivers...</p>
            ) : (
                <Table bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Person ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Availability</th>
                            <th>IsVerified</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {drivers.length > 0 ? (
                            drivers.map(driver => (
                                <tr key={driver.deliveryPersonId}>
                                    <td>{driver.deliveryPersonId}</td>
                                    <td>{driver.driverName}</td>
                                    <td>{driver.driverEmail}</td>
                                    <td>{driver.phone}</td>
                                    <td>{driver.isAvailable ? "Available" : "Not Available"}</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={driver.status === 1}
                                            disabled={driver.status !== 1}
                                            onChange={() => handleVerifyDriver(driver.deliveryPersonId)}
                                        />
                                    </td>
                                    <td>
                                        <Button
                                            color="info"
                                            onClick={() => handleDriverDetails(driver)}
                                        >
                                            View Details
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center">No Drivers found</td>
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

             {/* Modal for Driver Details */}
             {selectedDriver && (
                <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)}>
                    <ModalHeader toggle={() => setModalOpen(!modalOpen)}>
                        Driver Details
                    </ModalHeader>
                    <ModalBody>
                        <p><strong>ID:</strong> {selectedDriver.deliveryPersonId}</p>
                        <p><strong>LicenseNumber:</strong> {selectedDriver.drivingLicenseNumber}</p>
                        <p><strong>LicenseDocument:</strong> {selectedDriver.licenseDocument}</p>
                        <p><strong>VehicleNumber:</strong> {selectedDriver.vehicleNumber}</p>
                        <p><strong>VehicleType:</strong> {selectedDriver.vehicleType}</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={() => setModalOpen(false)}>Close</Button>
                    </ModalFooter>
                </Modal>
            )}
        </Container >

    );
};

export default DeliveryPartners;
