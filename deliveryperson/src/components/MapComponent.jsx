import React, { useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsService,
  DirectionsRenderer,
  useLoadScript,
} from "@react-google-maps/api";
import { REACT_APP_GOOGLE_MAPS_API_KEY } from "./Apiconfig";

const MapComponent = ({ pickupLocation, dropoffLocation, showDriver = true, orderId, deliveryPersonId }) => {
  console.log("pickupLocation  === ", pickupLocation);
  console.log("dropoffLocation  === ", dropoffLocation);
  console.log("showDriver  === ", showDriver);
  console.log("orderId  === ", orderId);
  console.log("deliveryPersonId  === ", deliveryPersonId);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const [driverLocation, setDriverLocation] = useState(pickupLocation); // Initial driver location
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [driverMarker, setDriverMarker] = useState(null);

  const socket = useRef(null); // WebSocket reference
  const locationInterval = useRef(null); // Reference for location-sharing interval


  // Establish WebSocket connection and handle events
  useEffect(() => {
    if (showDriver) {
      
      socket.current = new WebSocket("wss://waytodine-spring-backend-5.onrender.com/ws/track");

      socket.current.onopen = () => {
        console.log("WebSocket connection established.");
        startSharingLocation(); // Start sharing location
      };

      socket.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("WebSocket message received:", data);

          if (data.location) {
            const [lat, lng] = data.location.split(",").map(Number);
            if (!isNaN(lat) && !isNaN(lng)) {
              setDriverLocation({ lat, lng });
              console.log("Driver location updated:", { lat, lng });
            } else {
              console.error("Invalid location data received:", data.location);
            }
          }
        } catch (err) {
          console.error("Failed to parse WebSocket message:", err);
        }
      };

      socket.current.onclose = () => {
        console.log("WebSocket connection closed.");
        stopSharingLocation(); // Stop sharing location on disconnect
      };

      socket.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      return () => {
        if (socket.current) socket.current.close();
        stopSharingLocation(); // Cleanup
      };
    }
  }, [showDriver]);

  const startSharingLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Starting location sharing...");
          locationInterval.current = setInterval(() => {
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                const locationMessage = JSON.stringify({
                  orderId,
                  deliveryPersonId,
                  location: `${pos.coords.latitude},${pos.coords.longitude}`,
                });
  
                if (socket.current && socket.current.readyState === WebSocket.OPEN) {
                  socket.current.send(locationMessage);
                  console.log("Sent location data:", locationMessage);
                }
              },
              (error) => console.error("Error retrieving location:", error)
            );
          }, 5000); // Share location every 5 seconds
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Please enable location services.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };
  
  

  // Stop sharing driver's location
  const stopSharingLocation = () => {
    if (locationInterval.current) {
      clearInterval(locationInterval.current);
      locationInterval.current = null;
      console.log("Stopped sharing location.");
    }
  };

  const handleMapLoad = (map) => {
    if (showDriver && driverLocation) {
      const marker = new window.google.maps.Marker({
        position: driverLocation,
        map: map,
        icon: {
          url: "https://cdn-icons-png.flaticon.com/512/2972/2972185.png", // Custom driver icon
          scaledSize: new window.google.maps.Size(40, 40),
        },
      });
      setDriverMarker(marker);
    }
  };

  const handleDirectionsCallback = (response) => {
    if (response && response.status === "OK") {
      setDirectionsResponse(response); // Save directions response
    } else {
      console.error("Failed to fetch directions:", response);
    }
  };

  // Update driver's marker dynamically
  useEffect(() => {
    if (isLoaded && driverMarker && driverLocation && showDriver) {
      driverMarker.setPosition(driverLocation);
    }
  }, [driverLocation, driverMarker, isLoaded, showDriver]);

  if (!isLoaded) {
    return <div>Loading map...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "400px" }}
      center={pickupLocation || { lat: 21.227341, lng: 72.894547 }}
      zoom={14}
      onLoad={handleMapLoad}
    >
      {pickupLocation && (
        <Marker
          position={pickupLocation}
          label="Pickup"
          icon={{
            url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
          }}
        />
      )}
      {dropoffLocation && (
        <Marker
          position={dropoffLocation}
          label="Dropoff"
          icon={{
            url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
          }}
        />
      )}
      {pickupLocation && dropoffLocation && !directionsResponse && (
        <DirectionsService
          options={{
            origin: pickupLocation,
            destination: dropoffLocation,
            travelMode: "DRIVING",
          }}
          callback={handleDirectionsCallback}
        />
      )}
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