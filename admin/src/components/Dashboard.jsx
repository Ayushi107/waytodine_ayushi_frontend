import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import Header from './Header';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register the necessary components for Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    const lineData = {
        labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        datasets: [
            {
                label: 'Order Growth',
                fill: false,
                lineTension: 0.1,
                backgroundColor: '#36A2EB',
                borderColor: '#36A2EB',
                data: [65, 59, 80, 81, 56, 55, 40],
            },
        ],
    };

    const barData = {
        labels: ['Total Orders', 'Total Delivered', 'Total User', 'Total Revenue'],
        datasets: [
            {
                label: 'Statistics',
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
                data: [75, 357, 65, 128],
                barThickness: 10,
            },
        ],
    };

    return (
        <>
            {/* <Header /> */}
            <div className="dashboard">
                <h2 className="mb-4">Dashboard</h2>
                <Row className="mb-4">
                    <Col md={3}>
                        <Card className="text-center" style={{ backgroundColor: '#FF6384', color: 'white', borderRadius: '10px' }}>
                            <Card.Body>
                                <Card.Title>Total Orders</Card.Title>
                                <Card.Text>75</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="text-center" style={{ backgroundColor: '#36A2EB', color: 'white', borderRadius: '10px' }}>
                            <Card.Body>
                                <Card.Title>Total Delivered</Card.Title>
                                <Card.Text>357</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="text-center" style={{ backgroundColor: '#FFCE56', color: 'black', borderRadius: '10px' }}>
                            <Card.Body>
                                <Card.Title>Total User</Card.Title>
                                <Card.Text>65</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="text-center" style={{ backgroundColor: '#4BC0C0', color: 'white', borderRadius: '10px' }}>
                            <Card.Body>
                                <Card.Title>Total Revenue</Card.Title>
                                <Card.Text>$128</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <Card>
                            <Card.Body>
                                <Card.Title>Order Statistics</Card.Title>
                                <Line data={lineData} />
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Card>
                            <Card.Body>
                                <Card.Title>Bar Chart</Card.Title>
                                <Bar data={barData} />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>

    );
};

export default Dashboard;
