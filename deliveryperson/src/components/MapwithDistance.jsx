import React, { useState } from "react";
import axios from "axios";

function MapwithDistance() {
  const [latLng, setLatLng] = useState({ lat: null, lng: null });
  const [address, setAddress] = useState("");
  const [reverseAddress, setReverseAddress] = useState("");

  const fetchLatLng = async () => {
    try {
      const response = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
          q: `${address}, India`, // Appends "India" to make the query more specific
          format: "json",
          addressdetails: 1,
        },
      });

      console.log("API Response:", response.data);

      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setLatLng({ lat, lng: lon });
      } else {
        alert("No location found!");
      }
    } catch (error) {
      console.error("Error fetching geolocation", error);
    }
  };

  const fetchAddressFromLatLng = async () => {
    if (!latLng.lat || !latLng.lng) {
      alert("Please get the latitude and longitude first.");
      return;
    }

    try {
      const response = await axios.get("https://nominatim.openstreetmap.org/reverse", {
        params: {
          lat: latLng.lat,
          lon: latLng.lng,
          format: "json",
          addressdetails: 1,
        },
      });

      console.log("Reverse Geocode Response:", response.data);

      if (response.data) {
        setReverseAddress(response.data.display_name); // Set the full address from reverse geocoding
      } else {
        alert("No address found for the given coordinates!");
      }
    } catch (error) {
      console.error("Error fetching address from coordinates", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter customer address"
      />
      <button onClick={fetchLatLng}>Get Location</button>
      <button onClick={fetchAddressFromLatLng}>Get Address from Lat/Lng</button>

      {latLng.lat && latLng.lng && (
        <div>
          <p>Latitude: {latLng.lat}</p>
          <p>Longitude: {latLng.lng}</p>
        </div>
      )}

      {reverseAddress && (
        <div>
          <h3>Reverse Geocoded Address:</h3>
          <p>{reverseAddress}</p>
        </div>
      )}
    </div>
  );
}

export default MapwithDistance;
