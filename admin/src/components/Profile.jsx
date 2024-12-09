import React, { useState, useEffect } from 'react';
import { Form, FormGroup, Label, Input, Container, Row, Col, Button, Alert } from 'reactstrap'; // Adjusted imports
import { FaEdit } from 'react-icons/fa';
import adminImage from '../images/ad.png';
import axios from 'axios';
import API_BASE_URL from '../Apiconfig';
import './css/Profile.css';
import './css/Button.css';

const Profile = () => {
    const [profile, setProfile] = useState({
        id: '',
        username: '',
        email: '',
        gender: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const response = await axios.post(`${API_BASE_URL}Admin/get-profile`,{});
                console.log(response.data);

                const { id, username, email, gender, password } = response.data;
                setProfile({ id, username, email, gender, password });
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setProfile((prevProfile) => ({ ...prevProfile, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.put(`${API_BASE_URL}Admin/update-admin`, {
                Id : profile.id,
                Username : profile.username,
                Email : profile.email,
                Image : 'string',
                Gender : profile.gender
            });
            setMessage('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage('Error updating profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <Container className="profile-container">
            <h2 className="mb-4">Profile</h2>
            {message && <Alert color="info">{message}</Alert>}
            <div className="profile-form-container">
                <div className="profile-header">
                    <img src={adminImage} alt="Admin" className="profile-image" />
                    <h2 className="profile-title">Admin</h2>
                </div>
                <Form onSubmit={handleSubmit} className="profile-form">
                    <Row className="mb-3">
                        <Col xs={12} md={6}>
                            <FormGroup>
                                <Label className="custom-label" for="firstName">User Name</Label>
                                <Input
                                    type="text"
                                    id="username"
                                    placeholder="UserName"
                                    value={profile.username}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                        </Col>
                        <Col xs={12} md={6}>
                            <FormGroup>
                                <Label className="custom-label" for="lastName">Gender</Label>
                                <Input
                                    type="text"
                                    id="gender"
                                    placeholder="Gende"
                                    value={profile.gender}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col xs={12} md={6}>
                            <FormGroup>
                                <Label className="custom-label" for="email">Email</Label>
                                <Input
                                    type="email"
                                    id="email"
                                    placeholder="Email"
                                    value={profile.email}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                        </Col>
                        <Col xs={12} md={6}>
                            <FormGroup>
                                <Label className="custom-label" for="gender">Password</Label>
                                <Input
                                    type="text"
                                    id="password"
                                    placeholder="Password"
                                    value={profile.password}
                                    onChange={handleChange}
                                />
                            </FormGroup>
                        </Col>
                    </Row>

                    <Button className="btn-custom btn-primary" type="submit" disabled={loading}  style={{ width: '10%' }} >
                        <FaEdit className="edit-icon" /> {loading ? 'Saving...' : 'Save'}
                    </Button>
                </Form>
            </div>
        </Container>
    );
};

export default Profile;
