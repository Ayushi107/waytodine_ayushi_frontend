import React, { useState, useEffect } from 'react';
import {
    Container,
    Table,
    Input,
    Button,
    FormGroup,
    Label,
} from 'reactstrap';
import './css/Button.css';
import axios from 'axios';
import API_BASE_URL from '../Apiconfig';

const MenuList = () => {
    const [menus, setMenus] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        pageNumber: 1,
        pageSize: 5,
        totalPages: 0,
        totalRecords: 0,
    });
    const [vegFilter, setVegFilter] = useState(null); // null: all, true: veg, false: non-veg

    const fetchMenus = async (pageNumber = 1, pageSize = 5) => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}Listing/get-Menus`, {
                pageNumber,
                pageSize,
            });

            if (response.data) {
                setMenus(response.data.data.$values);
                setPagination({
                    pageNumber: response.data.pageNumber,
                    pageSize: response.data.pageSize,
                    totalPages: response.data.totalPages,
                    totalRecords: response.data.totalRecords,
                });
            }
        } catch (error) {
            console.error('Error fetching menus:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMenus(pagination.pageNumber, pagination.pageSize);
    }, []);

    const handlePageChange = (direction) => {
        const newPageNumber = pagination.pageNumber + direction;
        if (newPageNumber > 0 && newPageNumber <= pagination.totalPages) {
            fetchMenus(newPageNumber, pagination.pageSize);
        }
    };

    const SearchMenu = async (pageNumber = 1, pageSize = 10, searchTerm = '') => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}Searching/search-menus`, {
                RestaurantName: searchTerm,
                pageNumber,
                pageSize,
            });

            if (response.data) {
                setMenus(response.data.data.$values);
                setPagination({
                    pageNumber: response.data.pageNumber,
                    pageSize: response.data.pageSize,
                    totalPages: response.data.totalPages,
                    totalRecords: response.data.totalRecords,
                });
            }
        } catch (error) {
            console.error('Error fetching Menus:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        const searchTerm = e.target.value;
        setSearch(searchTerm);
        SearchMenu(1, pagination.pageSize, searchTerm);
    };

    const filteredMenus = menus.filter(menu => {
        if (vegFilter === null) return true; // Show all if no filter is applied
        return vegFilter ? menu.isVeg === 1 : menu.isVeg === 0;
    });

    const toggleVegFilter = () => {
        if (vegFilter === null) {
            setVegFilter(true); // Veg only
        } else if (vegFilter === true) {
            setVegFilter(false); // Non-Veg only
        } else {
            setVegFilter(null); // Reset to show all
        }
    };

    return (
        <Container className="mt-4 p-4" style={{ borderRadius: '10px', backgroundColor: '#fff', boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)' }}>
            <h2 className="mb-4">Menu</h2>

            {/* Search bar */}
            <Input
                type="text"
                placeholder="Search by Menu name"
                className="mb-4"
                value={search}
                onChange={handleSearchChange}
                style={{ width: '300px' }}
            />

            {/* Veg/Non-Veg Toggle */}
            <div className="d-flex align-items-center mb-3">
                <Label className="me-3">Filter:</Label>
                <div
                    className="custom-toggle"
                    style={{
                        position: 'relative',
                        width: '60px',
                        height: '30px',
                        backgroundColor: vegFilter === null ? '#ccc' : vegFilter ? '#4caf50' : '#f44336',
                        borderRadius: '15px',
                        cursor: 'pointer',
                    }}
                    onClick={toggleVegFilter}
                >
                    <div
                        style={{
                            position: 'absolute',
                            top: '5px',
                            left: vegFilter === null ? 'calc(50% - 10px)' : vegFilter ? '5px' : 'calc(100% - 25px)',
                            width: '20px',
                            height: '20px',
                            backgroundColor: '#fff',
                            borderRadius: '50%',
                            transition: 'left 0.3s',
                        }}
                    />
                </div>
                <span className="ms-3">
                    {vegFilter === null ? 'Show All' : vegFilter ? 'Veg Only' : 'Non-Veg Only'}
                </span>
            </div>

            {/* Menu Table */}
            {loading ? (
                <p>Loading menus...</p>
            ) : (
                <Table bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Menu ID</th>
                            <th>Category</th>
                            <th>Item Name</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th style={{ width: "15%" }}>Image</th>
                            <th>Veg or Non-Veg</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMenus.length > 0 ? (
                            filteredMenus.map(menu => (
                                <tr key={menu.itemId}>
                                    <td>{menu.itemId}</td>
                                    <td>{menu.category.categoryName}</td>
                                    <td>{menu.name}</td>
                                    <td>{menu.description}</td>
                                    <td>{menu.price}</td>
                                    <td>
                                        <img
                                            src={menu.itemImage}
                                            alt="Image description"
                                            style={{ width: "50%", height: "50%" }}
                                        />
                                    </td>
                                    <td>{menu.isVeg === 1 ? 'Veg' : 'Non-Veg'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center">No menus found</td>
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

export default MenuList;
