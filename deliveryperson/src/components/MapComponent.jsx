import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsService,
  DirectionsRenderer,
  useLoadScript,
} from "@react-google-maps/api";
import { REACT_APP_GOOGLE_MAPS_API_KEY } from "./Apiconfig"; // Replace with your API key

const MapComponent = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: REACT_APP_GOOGLE_MAPS_API_KEY, // Your Google Maps API Key
  });

  // Dummy locations
  const customerLocation = { lat: 21.227341, lng: 72.894547 }; // Customer location
  const restaurantLocation = { lat: 21.23112, lng: 72.838901 }; // Restaurant location

  const [driverLocation, setDriverLocation] = useState({
    lat: 21.2297, // Initial driver location
    lng: 72.8669,
  });
  const [directionsResponse, setDirectionsResponse] = useState(null);

  const handleDirectionsCallback = (response) => {
    if (response && response.status === "OK") {
      setDirectionsResponse(response); // Save the response for rendering the route
    } else {
      console.error("Directions request failed:", response);
    }
  };

  // Simulate driver's real-time movement
  useEffect(() => {
    const interval = setInterval(() => {
      setDriverLocation((prevLocation) => {
        const newLocation = {
          lat: prevLocation.lat + 0.0001, // Simulating movement
          lng: prevLocation.lng + 0.0001,
        };
        console.log("Updated Driver Location:", newLocation); // Debug log
        return newLocation;
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [driverLocation]);

  if (!isLoaded) {
    return <div>Loading map...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={{ height: "400px", width: "100%" }}
      center={driverLocation} // Center the map on the driver's location
      zoom={13}
    >
      {/* Marker for Customer Location */}
      <Marker position={customerLocation} label="Customer" />

      {/* Marker for Restaurant Location */}
      <Marker position={restaurantLocation} label="Restaurant" />

      {/* Marker for Driver Location */}
      <Marker
        position={driverLocation}
        label="Driver"
        icon={{
          url: 'https://img-cdn.thepublive.com/fit-in/1200x675/filters:format(webp)/entrackr/media/post_attachments/wp-content/uploads/2019/07/SWIGGY.jpg',  // Replace with your own image URL
          scaledSize: new window.google.maps.Size(40, 40), // Adjust the size if needed
        }}
        onError={() => console.warn("Failed to load custom icon for the driver marker.")}
      />

      {/* Request directions from restaurant to customer */}
      {!directionsResponse && (
        <DirectionsService
          options={{
            origin: restaurantLocation,
            destination: customerLocation,
            travelMode: "DRIVING",
          }}
          callback={handleDirectionsCallback}
        />
      )}

      {/* Render the blue line for the route if directions are available */}
      {directionsResponse && (
        <DirectionsRenderer
          directions={directionsResponse}
          options={{
            polylineOptions: {
              strokeColor: "blue",
              strokeOpacity: 0.8,
              strokeWeight: 5,
            },
          }}
        />
      )}
    </GoogleMap>
  );
};

export default MapComponent;
