import React, { useState } from 'react';
import axios from 'axios';
import './css/Login.css';
import './css/Button.css';
import logoImage from '../images/logo.jpg';
import { Form, FormGroup, Label, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL,REACT_APP_GOOGLE_MAPS_API_KEY } from './Apiconfig';
const Login = () => {

    const navigate = useNavigate();
    const [username, Setusername] = useState('');
    const [password, Setpassword] = useState('');
    const [error, Seterror] = useState(null);

    const handleSignUpClick = async () => {
        // console.log(username, password);



        try {
            const response = await axios.post(`${API_BASE_URL}Driver/login`, {
                username: username,
                password: password
            });

            const token = response.data.token.token;
            const driver = response.data.token.data; 
            localStorage.setItem('driver', JSON.stringify(driver));
            console.log(response.data.token);
            

            // console.log(token);
            if (token) {
                localStorage.setItem('token', token);
                navigate('/delivery-panel');
            }
            else {
                Seterror('Invalid response from the server');
            }
        } catch (error) {
            Seterror('Invalid username or password');
        }


    };


    const handleForgotPasswordClick = () => {
        navigate('/forgotPassword');
    }



    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="login-container">
                <div className="login-header text-center">
                    <img
                        src={logoImage} // Dynamic logo
                        alt="Admin Logo"
                        className="img-fluid"
                    />
                    <h3>WayToDine</h3>
                </div>
                <Form onSubmit={(e) => e.preventDefault()}>
                    {error && <p className="text-danger">{error}</p>}
                    <FormGroup className="mb-3">
                        <Label for="username">
                            Username <span className="text-danger">*</span>
                        </Label>
                        <Input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => Setusername(e.target.value)}
                            placeholder="Enter your username"
                        />
                    </FormGroup>
                    <FormGroup className="mb-3">
                        <Label for="password">
                            Password <span className="text-danger">*</span>
                        </Label>
                        <Input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => Setpassword(e.target.value)}
                            placeholder="Enter your password"
                        />
                    </FormGroup>
                    <div className="forgot-password text-end">
                        <a className="text-primary" onClick={handleForgotPasswordClick}>Forgot your password?</a>
                    </div>
                    <div className="d-grid gap-2">
                        <Button className="btn-login" block onClick={handleSignUpClick}>
                            Sign in
                        </Button>
                    </div>
                </Form>


            </div>
        </div>
    );
}

export default Login;
