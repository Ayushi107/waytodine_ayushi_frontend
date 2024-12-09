import React, { useState, useEffect } from 'react';
import { Container, Table, Input, Button } from 'reactstrap'; // Reactstrap components
import { MDBBadge } from 'mdb-react-ui-kit'; // Optional badge for styling
import axios from 'axios';
import API_BASE_URL from '../Apiconfig';

const UserList = () => {

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        pageNumber: 1,
        pageSize: 5, // Default page size
        totalPages: 0,
        totalRecords: 0,
    });


    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}Listing/get-Users`, {
                pageNumber:pagination.pageNumber,
                pageSize:pagination.pageSize,
            });

            if (response.data) {
                setUsers(response.data.data.$values); // Set orders
                console.log(response.data.data.$values);
                
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
        fetchUsers();
    }, [pagination.pageNumber, pagination.pageSize]);


    const handlePageChange = (direction) => {
        const newPageNumber = pagination.pageNumber + direction;
        setPagination((prev) => ({
            ...prev,
            pageNumber: newPageNumber,
        }));
    };


    const SearchUser = async (pageNumber = 1, pageSize = 10, searchTerm = '') => {

        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}Searching/search-users`, {
                RestaurantName: searchTerm,
                pageNumber,
                pageSize,
            });

            if (response.data) {
                setUsers(response.data.data.$values); // Set orders
                // console.log(response.data.data.$values);

                setPagination({
                    pageNumber: response.data.pageNumber,
                    pageSize: response.data.pageSize,
                    totalPages: response.data.totalPages,
                    totalRecords: response.data.totalRecords,
                });
            }
        } catch (error) {
            console.error('Error fetching Users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        const searchTerm = e.target.value;
        setSearch(searchTerm);
        SearchUser(1, pagination.pageSize, searchTerm); // Fetch orders with updated search term
    };


    // const [search, setSearch] = useState('');
    // const users = [
    //     { id: 1, name: 'John Doe', email: 'john@example.com', orders: 10 },
    //     { id: 2, name: 'Jane Smith', email: 'jane@example.com', orders: 5 },
    // ];


    // const filteredOrders = users.filter(order =>
    //     users.name.toLowerCase().includes(search.toLowerCase())
    // );
    return (

        <Container className="mt-4 p-4" style={{ borderRadius: '10px', backgroundColor: '#fff', boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)' }}>
            <h2 className="mb-4">Users</h2>
            <Input
                type="text"
                placeholder="Search by User name"
                className="mb-4"
                value={search}
                onChange={handleSearchChange}
                style={{ width: '300px' }}
            />

            {loading ? (
                <p>Loading users...</p>
            ) : (
                <Table bordered hover responsive>
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone No.</th>
                            <th>Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map(user => (
                                <tr key={user.userId}>
                                    <td>{user.userId}</td>
                                    <td>{user.firstName} {user.lastName}</td>
                                    <td>{user.email}</td>
                                    {/* <td>{order.status}</td> */}
                                    <td>{user.phoneNumber}</td>
                                    <td>{user.location}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center">No users found</td>
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



        </Container>

    );
};

export default UserList;
