// ChangePassword.jsx
import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../Apiconfig';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import './css/ChangePassword.css';

const ChangePassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [userName, setUserName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChangePassword = async () => {
        
        try {
            await axios.post(`${API_BASE_URL}Admin/change-password`, { NewPassword: newPassword, UserName: userName });
            alert('Password changed successfully');
            navigate('/'); // Redirect to login after password change
        } catch (error) {
            setError('Failed to change password. Please try again.');
        }
    };

    return (
        <div className="change-password-page d-flex justify-content-center align-items-center vh-100">
            <div className="change-password-container text-center">
                <h3 className="change-password-title">Change Password</h3>
                {error && <p className="text-danger">{error}</p>}

                <Form onSubmit={(e) => e.preventDefault()}>
                    <FormGroup className="mb-3">
                        <Label for="newPassword">UserName</Label>
                        <Input
                            type="text"
                            id="UserName"
                            placeholder="Enter UserName"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                        />
                    </FormGroup>
                    <FormGroup className="mb-3">
                        <Label for="confirmPassword">New Password</Label>
                        <Input
                            type="password"
                            id="NewPassword"
                            placeholder="New password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </FormGroup>
                    <Button color="primary" onClick={handleChangePassword}>
                        Change Password
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default ChangePassword;
