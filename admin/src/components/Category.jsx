import React, { useState, useEffect } from 'react';
import { Container, Table, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import './css/Button.css';
// import './css/Category.css';
import axios from 'axios';
import API_BASE_URL from '../Apiconfig';

const Category = () => {
    const [category, setCategory] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        pageNumber: 1,
        pageSize: 5,
        totalPages: 0,
        totalRecords: 0,
    });
    const [addModal, setAddModal] = useState(false); // State for Add Category modal
    const [newCategory, setNewCategory] = useState({
        name: '',
        description: '',
        image: '',
        stauts: ''
    });

    const fetchCategory = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}Category/get-categories`, {
                pageNumber: pagination.pageNumber,
                pageSize: pagination.pageSize,
            });

            if (response.data) {
                setCategory(response.data.data.$values);
                console.log(response.data);


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
        fetchCategory();
    }, [pagination.pageNumber, pagination.pageSize]);

    const handlePageChange = (direction) => {
        const newPageNumber = pagination.pageNumber + direction;
        setPagination((prev) => ({
            ...prev,
            pageNumber: newPageNumber,
        }));
    };

    const toggleAddModal = () => setAddModal(!addModal);
    const handleImageChange = (e) => {
        const file = e.target.files[0]; // Get the selected file
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewCategory((prev) => ({
                    ...prev,
                    image: reader.result.split(',')[1], // Store base64 string (remove 'data:image/...;base64,' prefix)
                }));
            };
            reader.readAsDataURL(file); // Convert the file to base64 string
        }
    };
    const handleAddCategory = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}Category/add-category`, {
                Name: newCategory.name,
                Description: newCategory.description,
                Status: 1,
                Image: newCategory.image
            });
            // if (response.data.success) {
            toggleAddModal();
            fetchCategory(pagination.pageNumber, pagination.pageSize);
            // }
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };
    const [modal, setModal] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);

    const toggleModal = () => setModal(!modal);
    const handleEditClick = (item) => {
        setCurrentItem(item);

        toggleModal();
    };

    const handleUpdate = async () => {

        try {
            const response = await axios.put(`${API_BASE_URL}Category/update-category`, {
                Id: currentItem.categoryId,
                Name: currentItem.categoryName,
                Description: currentItem.description,
                Image: '',
                Status: 1
            });
            // if (response.data.success) {
            toggleModal();
            fetchCategory(pagination.pageNumber, pagination.pageSize);
            // }
        } catch (error) {
            console.error('Error updating category:', error);
        }
        toggleModal();
    };

    const handleDeleteClick = async (item) => {

        try {
            const response = await axios.post(`${API_BASE_URL}Category/delete-category`, {
                Id: item.categoryId,
            });
            // if (response.data.success) {
            // toggleAddModal();
            fetchCategory(pagination.pageNumber, pagination.pageSize);
            // }
        } catch (error) {
            console.error('Error Deleting category:', error);
        }
        // toggleModal();
    };


    return (
        <Container className="mt-4 p-4" style={{ borderRadius: '10px', backgroundColor: '#fff', boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Category</h2>
                <Button className="btn-custom btn-success" onClick={toggleAddModal}>
                    + Add Category
                </Button>
            </div>

            {/* Search bar */}
            {/* <Input
                type="text"
                placeholder="Search by Category name"
                className="mb-4"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '300px' }}
            /> */}

            {/* Menu Table */}
            {loading ? (
                <p>Loading categories...</p>
            ) : (
                <Table bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Category ID</th>
                            <th>Category</th>
                            <th style={{ width: "15%" }}>Image</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {category.length > 0 ? (
                            category.map(category => (
                                <tr key={category.categoryId}>
                                    <td>{category.categoryId}</td>
                                    <td>{category.categoryName}</td>
                                    <td>
                                        <img
                                            src={category.categoryImage}  // Assuming category.categoryImage contains the Cloudinary URL
                                            alt="Image description"
                                            style={{ width: "50%", height: "50%" }}
                                        />
                                    </td>                                    <td>{category.description}</td>
                                    <td>
                                        <Button className="btn-custom btn-primary" style={{ width: '20%' }} onClick={() => handleEditClick(category)} >Edit</Button>{' '}
                                        <Button className="btn-custom btn-danger" onClick={() => handleDeleteClick(category)}>Delete</Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center">No category found</td>
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

            {/* Add Category Modal */}
            <Modal isOpen={addModal} toggle={toggleAddModal}>
                <ModalHeader toggle={toggleAddModal}>Add Category</ModalHeader>
                <ModalBody>

                    <div>
                        <label>Category Name:</label>
                        <Input
                            type="text"
                            value={newCategory.categoryName}
                            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                        />
                    </div>
                    <div className="mt-3">
                        <label>Description:</label>
                        <Input
                            type="textarea"
                            value={newCategory.description}
                            onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                        />
                    </div>

                    <div className="mt-3">
                        <label>Image:</label>
                        <Input
                            type="file"
                            onChange={handleImageChange} // Handle image upload
                        />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button className="btn-custom btn-success" onClick={handleAddCategory}>Add</Button>
                    <Button className="btn-custom btn-secondary" onClick={toggleAddModal}>Cancel</Button>
                </ModalFooter>
            </Modal>


            {/* Edit Modal */}
            <Modal isOpen={modal} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>Edit Menu Item</ModalHeader>
                <ModalBody>
                    {currentItem && (
                        <div>
                            <div>
                                <Input type='hidden' value={currentItem.categoryId} onChange={(e) => setCurrentItem({ ...currentItem, categoryId: e.target.value })} />
                                <label>Name:</label>
                                <Input
                                    type="text"
                                    value={currentItem.categoryName}
                                    onChange={(e) => setCurrentItem({ ...currentItem, categoryName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label>Description:</label>
                                <Input
                                    type="text"
                                    value={currentItem.description}
                                    onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                                />
                            </div>
                            {/* <div>
                                <label>Available:</label>
                                <Input
                                    type="checkbox"
                                    checked={currentItem.available}
                                    onChange={(e) => setCurrentItem({ ...currentItem, available: e.target.checked })}
                                /> Yes
                            </div> */}
                        </div>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button className='btn-custom btn-primary' onClick={handleUpdate} style={{ width: '20%' }}>Update</Button>
                    <Button className="btn-custom btn-danger" onClick={toggleModal}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </Container>
    );
};

export default Category;
