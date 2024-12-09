import React from 'react';
import '../components/css/MAp.css';
import WrappedMap from '../components/gMap/Map';

import config from '../components/gMap/config';
import useFetch from '../components/hooks/useFetch';
// import Header from '../components/Header/Header';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

function NewMapCompenent() {
  
//   const { data: paths} = useFetch('https://61a4a0604c822c0017041d33.mockapi.io/shuttle/v1/path');
  const paths = [
    {
        "lat": 12.9802347063322,
        "lng": 77.5907760360903,
        "bearing": -20.5784744283754
    },
    {
        "lat": 12.9793774204024,
        "lng": 77.5910979011596,
        "bearing": 17.1118088152409
    },
    {
        "lat": 12.9795865148043,
        "lng": 77.5911622741734,
        "bearing": 70.6690312217414
    },
    {
        "lat": 12.9797746996155,
        "lng": 77.5916987159555,
        "bearing": 38.1233134168197
    },
    {
        "lat": 12.9801301594259,
        "lng": 77.5919776656823,
        "bearing": -45.7414247345699
    },
    {
        "lat": 12.9798374278543,
        "lng": 77.5922780730802,
        "bearing": 16.0994201411847
    },
    {
        "lat": 12.9791683258247,
        "lng": 77.5920849540387,
        "bearing": 35.6916527554558
    },
    {
        "lat": 12.9787501361417,
        "lng": 77.5917845466407,
        "bearing": 58.0502467067782
    },
    {
        "lat": 12.9784155838887,
        "lng": 77.5912481048586,
        "bearing": 64.0233912454979
    },
    {
        "lat": 12.9784783124705,
        "lng": 77.5913768508863,
        "bearing": 45.7412428776673
    },
    {
        "lat": 12.9783319457552,
        "lng": 77.5912266471873,
        "bearing": -69.926654677622
    },
    {
        "lat": 12.978394674358,
        "lng": 77.591054985817,
        "bearing": 16.3413468751341
    },
    {
        "lat": 12.9779555738058,
        "lng": 77.5909262397893,
        "bearing": 54.6749460887583
    },
    {
        "lat": 12.9776210204837,
        "lng": 77.5904541710211,
        "bearing": 64.0233096712307
    },
    {
        "lat": 12.9774746532636,
        "lng": 77.5901537636231,
        "bearing": 65.5464053454266
    },
    {
        "lat": 12.9761573444059,
        "lng": 77.5872569779997,
        "bearing": -66.4029340594377
    },
    {
        "lat": 12.9764291706147,
        "lng": 77.5866347055324,
        "bearing": -48.4630801907934
    },
    {
        "lat": 12.9766382674962,
        "lng": 77.5863986711483,
        "bearing": -54.992843944921
    },
    {
        "lat": 12.9771191896563,
        "lng": 77.5857120256672,
        "bearing": -60.0659370316888
    }
];
const stops = {
    "total": 3,
    "data": [
        {
            "lat": 12.9802347063322,
            "lng": 77.5907760360903,
            "id": "stop1"
        },
        {
            "lat": 12.9787501361417,
            "lng": 77.5917845466407,
            "id": "stop2"
        },
        {
            "lat": 12.9771191896563,
            "lng": 77.5857120256672,
            "id": "stop3"
        }
    ]
};

//   const { data: stops } = useFetch('https://61a4a0604c822c0017041d33.mockapi.io/shuttle/v1/stops');
  const mapURL = `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${config.mapsKey}`;

  console.log(paths);
  console.log(stops);
  
  
  
  return (
    <div className="App">
      
      {/* <Header/> */}
      
      
      { paths && stops ?
        <WrappedMap
            paths={paths}
            stops={stops}
            googleMapURL={mapURL}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div className='mapContainer'  />}
            mapElement={<div style={{ height: `100%` }} />}
          />
          : 
          <Box sx={{ width: '100%' }}>
            <LinearProgress />
          </Box>
        }
    </div>
  );
}

export default NewMapCompenent;
