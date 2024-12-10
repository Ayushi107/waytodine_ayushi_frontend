import React, { useState, useEffect, useRef, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker, Polyline } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const libraries = ["geometry"]; // Include geometry library for curve calculations

const center = {
  lat: 40.73061, // Center around New York for example
  lng: -73.935242,
};

// Function to calculate a Bezier curve (smooth, curved path)
const calculateCurve = (start, end) => {
  const controlPoint = {
    lat: (start.lat + end.lat) / 2 + 0.05, // Add offset to create the curve
    lng: (start.lng + end.lng) / 2,
  };
  return [start, controlPoint, end];
};

export default function NewMapCompenent() {
  const [customerLocation] = useState({ lat: 40.7128, lng: -74.0060 }); // Customer location
  const [restaurantLocation] = useState({ lat: 40.7580, lng: -73.9855 }); // Restaurant location
  const [driverLocation, setDriverLocation] = useState(restaurantLocation); // Driver starts at the restaurant
  const [path, setPath] = useState([]); // Curved path
  const [progress, setProgress] = useState(0); // Driver's progress along the path

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDdJF-QhDIQmx9ipuWMlPg-nJu5HTIU-8I", // Replace with your key
    libraries: libraries,
  });

  // Create the curved path when the component loads
  useEffect(() => {
    setPath(calculateCurve(restaurantLocation, customerLocation));
  }, [restaurantLocation, customerLocation]);

  // Move the driver along the curved path
  useEffect(() => {
    if (isLoaded) {
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = prevProgress + 0.01; // Increment progress
          if (newProgress >= 1) {
            clearInterval(interval); // Stop at the destination
            return 1;
          }
          return newProgress;
        });
      }, 100); // Update every 100ms

      return () => clearInterval(interval);
    }
  }, [isLoaded]);

  // Calculate the driver's position based on progress along the path
  useEffect(() => {
    if (path.length > 1) {
      const [start, control, end] = path;
      const t = progress; // t is the progress (0 to 1)

      // Quadratic Bezier curve formula
      const driverLat =
        (1 - t) * (1 - t) * start.lat + 2 * (1 - t) * t * control.lat + t * t * end.lat;
      const driverLng =
        (1 - t) * (1 - t) * start.lng + 2 * (1 - t) * t * control.lng + t * t * end.lng;

      setDriverLocation({ lat: driverLat, lng: driverLng });
    }
  }, [progress, path]);

  if (loadError) return <div>Error loading map</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={12}>
      {/* Markers */}
      <Marker position={restaurantLocation} label="R" />
      <Marker position={customerLocation} label="C" />
      <Marker
        position={driverLocation}
        icon={{
          path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 5,
          fillColor: "#FF0000",
          fillOpacity: 1,
          strokeWeight: 1,
        }}
      />

      {/* Curved Path */}
      {path.length > 1 && (
        <Polyline
          path={path}
          options={{
            strokeColor: "#0000FF",
            strokeOpacity: 0.8,
            strokeWeight: 2,
          }}
        />
      )}
    </GoogleMap>
  );
}
























// import React from 'react';
// import '../components/css/MAp.css';
// import WrappedMap from '../components/gMap/Map';

// import config from '../components/gMap/config';
// import useFetch from '../components/hooks/useFetch';
// // import Header from '../components/Header/Header';
// import Box from '@mui/material/Box';
// import LinearProgress from '@mui/material/LinearProgress';

// function NewMapCompenent() {
  
// //   const { data: paths} = useFetch('https://61a4a0604c822c0017041d33.mockapi.io/shuttle/v1/path');
//   const paths = [
//     {
//         "lat": 12.9802347063322,
//         "lng": 77.5907760360903,
//         "bearing": -20.5784744283754
//     },
//     {
//         "lat": 12.9793774204024,
//         "lng": 77.5910979011596,
//         "bearing": 17.1118088152409
//     },
//     {
//         "lat": 12.9795865148043,
//         "lng": 77.5911622741734,
//         "bearing": 70.6690312217414
//     },
//     {
//         "lat": 12.9797746996155,
//         "lng": 77.5916987159555,
//         "bearing": 38.1233134168197
//     },
//     {
//         "lat": 12.9801301594259,
//         "lng": 77.5919776656823,
//         "bearing": -45.7414247345699
//     },
//     {
//         "lat": 12.9798374278543,
//         "lng": 77.5922780730802,
//         "bearing": 16.0994201411847
//     },
//     {
//         "lat": 12.9791683258247,
//         "lng": 77.5920849540387,
//         "bearing": 35.6916527554558
//     },
//     {
//         "lat": 12.9787501361417,
//         "lng": 77.5917845466407,
//         "bearing": 58.0502467067782
//     },
//     {
//         "lat": 12.9784155838887,
//         "lng": 77.5912481048586,
//         "bearing": 64.0233912454979
//     },
//     {
//         "lat": 12.9784783124705,
//         "lng": 77.5913768508863,
//         "bearing": 45.7412428776673
//     },
//     {
//         "lat": 12.9783319457552,
//         "lng": 77.5912266471873,
//         "bearing": -69.926654677622
//     },
//     {
//         "lat": 12.978394674358,
//         "lng": 77.591054985817,
//         "bearing": 16.3413468751341
//     },
//     {
//         "lat": 12.9779555738058,
//         "lng": 77.5909262397893,
//         "bearing": 54.6749460887583
//     },
//     {
//         "lat": 12.9776210204837,
//         "lng": 77.5904541710211,
//         "bearing": 64.0233096712307
//     },
//     {
//         "lat": 12.9774746532636,
//         "lng": 77.5901537636231,
//         "bearing": 65.5464053454266
//     },
//     {
//         "lat": 12.9761573444059,
//         "lng": 77.5872569779997,
//         "bearing": -66.4029340594377
//     },
//     {
//         "lat": 12.9764291706147,
//         "lng": 77.5866347055324,
//         "bearing": -48.4630801907934
//     },
//     {
//         "lat": 12.9766382674962,
//         "lng": 77.5863986711483,
//         "bearing": -54.992843944921
//     },
//     {
//         "lat": 12.9771191896563,
//         "lng": 77.5857120256672,
//         "bearing": -60.0659370316888
//     }
// ];
// const stops = {
//     "total": 3,
//     "data": [
//         {
//             "lat": 12.9802347063322,
//             "lng": 77.5907760360903,
//             "id": "stop1"
//         },
//         {
//             "lat": 12.9787501361417,
//             "lng": 77.5917845466407,
//             "id": "stop2"
//         },
//         {
//             "lat": 12.9771191896563,
//             "lng": 77.5857120256672,
//             "id": "stop3"
//         }
//     ]
// };

// //   const { data: stops } = useFetch('https://61a4a0604c822c0017041d33.mockapi.io/shuttle/v1/stops');
//   const mapURL = `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${config.mapsKey}`;

//   console.log(paths);
//   console.log(stops);
  
  
  
//   return (
//     <div className="App">
      
//       {/* <Header/> */}
      
      
//       { paths && stops ?
//         <WrappedMap
//             paths={paths}
//             stops={stops}
//             googleMapURL={mapURL}
//             loadingElement={<div style={{ height: `100%` }} />}
//             containerElement={<div className='mapContainer'  />}
//             mapElement={<div style={{ height: `100%` }} />}
//           />
//           : 
//           <Box sx={{ width: '100%' }}>
//             <LinearProgress />
//           </Box>
//         }
//     </div>
//   );
// }

// export default NewMapCompenent;
