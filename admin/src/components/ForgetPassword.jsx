// ForgotPassword.jsx
import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../Apiconfig';
import { Form, FormGroup, Label, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter  } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import './css/ForgetPassword.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, SetError] = useState(null);
    const navigate = useNavigate();
    const [otp, setOtp] = useState('');
    const [otpModal, setOtpModal] = useState(false);


    const toggleOtpModal = () => setOtpModal(!otpModal);

    const handleSendOtp = async () => {
        try {
            await axios.post(`${API_BASE_URL}Admin/forget-password`, { email });
            toggleOtpModal(); // Trigger OTP modal after sending email
        } catch (error) {
            SetError('Failed to send OTP. Please check your email.');
        }
        toggleOtpModal(); // Trigger OTP modal after sending email
    };

    const handleVerifyOtp = async () => {
        try {
            await axios.post(`${API_BASE_URL}Admin/verify-otp`, { email, otp });
            toggleOtpModal(); 
            navigate('/changePassword'); 
        } catch (error) {
            SetError('Invalid OTP. Please try again.');
        }
      
    };
    return (
        <div className="forgot-password-page d-flex justify-content-center align-items-center vh-100">
            <div className="forgot-password-container text-center">
                <h3 className="forgot-password-title">Forgot Password</h3>
                <p className="forgot-password-text">
                    Enter your email address to get instructions to reset your password.
                </p>
                {error && <p className="text-danger">{error}</p>}

                <Form onSubmit={(e) => e.preventDefault()}>
                    <FormGroup className="mb-3">
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </FormGroup>
                    <Button color="primary" className="btn-submit" onClick={handleSendOtp}>
                        Submit
                    </Button>
                </Form>
                <div className="back-to-login mt-3">
                    <a onClick={() => navigate('/')}>← Back to Login</a>
                </div>


                {/* OTP Modal */}
                <Modal isOpen={otpModal} toggle={toggleOtpModal} centered>
                    <ModalHeader toggle={toggleOtpModal}>Enter OTP</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="otp">OTP</Label>
                            <Input
                                type="text"
                                id="otp"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={handleVerifyOtp}>
                            Verify OTP
                        </Button>
                    </ModalFooter>
                </Modal>

            </div>
        </div>
    );
};

export default ForgotPassword;
