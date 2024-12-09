import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL, REACT_APP_GOOGLE_MAPS_API_KEY } from "./Apiconfig";
import './css/Profile.css';


const Profile = () => {
  const [profileData, setProfileData] = useState({});
  const [availability, setAvailability] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
   // Replace with your API base URL


  const [driver, setDriver] = useState(null);

  useEffect(() => {
    const storedDriver = localStorage.getItem('driver');
    console.log(storedDriver, "wertyuiop");

    if (storedDriver) {
      try {
        const parsedDriver = JSON.parse(storedDriver);
        setDriver(parsedDriver);
      } catch (e) {
        console.error("Error parsing driver data:", e);
        setDriver(null);
      }
    } else {
      console.warn("No driver data found in session storage.");
      setDriver(null);
    }
  }, []);


  const fetchProfile = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}Driver/get-profile`, {
        DriverId: 1//driver.deliveryPersonId, // Replace with the actual driver ID dynamically
      });
    //   console.log(response.data);
      
      setProfileData(response.data);
      setAvailability(response.data.isAvailable);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching profile data:", error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchProfile();
  }, []);

  const toggleAvailability = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}Driver/update-availability-status`,
        { DriverId: driver.deliveryPersonId }
      );
      console.log(response);
      
      setAvailability(response.data.isAvailable);
    } catch (error) {
      console.error("Error updating availability status:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <h2>Driver Profile</h2>
      <form>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" value={profileData.driverName || ""} readOnly />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" value={profileData.driverEmail || ""} readOnly />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" value={profileData.password || ""} readOnly />
        </div>
        <div className="form-group">
          <label>Phone:</label>
          <input type="text" value={profileData.phone || ""} readOnly />
        </div>
        <div className="form-group">
          <label>Vehicle Number:</label>
          <input type="text" value={profileData.vehicleNumber || ""} readOnly />
        </div>
        <div className="form-group">
          <label>Availability:</label>
          <button
            type="button"
            className={`availability-btn ${
              availability ? "available" : "not-available"
            }`}
            onClick={toggleAvailability}
          >
            {availability ? "Available" : "Not Available"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
