import React, { useEffect, useState } from 'react';
import markerIcon from "../node_modules/leaflet/dist/images/marker-icon.png";
import "leaflet/dist/leaflet.css";
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import L from 'leaflet';
import './control.geocoder.js'
import {IRouter, IGeocoder, LineOptions} from 'leaflet-routing-machine';

window.lrmConfig = {

}

const SimpleFormApp = () => {
  // State to store input values
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [waypoint, setWayPoint] = useState([]);
  
  const myIcon = L.icon({
    iconUrl: 'myIcon.png'
  })

  L.Marker.prototype.setIcon(L.icon({
    iconUrl:markerIcon
  }))

  const initMap = (result) => {
    var map = L.map("youmap", {
      center:[45.4153903, -75.6706557],
      zoom:13
    })

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map)

var control = L.Routing.control( {
      waypoints: [
        L.latLng(parseFloat(result.start[0]), parseFloat(result.start[1])),
        L.latLng(parseFloat(result.end[0]), parseFloat(result.end[1])),
      ],
    }).addTo(map)
control.on('routeselected', function(e) {

      var lineCoordinates = [],
        i,
        latLng;
      
      var instr = e.route.instructions;
      var routes = e.route.summary.totalDistance / 1000;
      console.log(instr);
      console.log(routes);
      
      for (i = 0; i < e.route.coordinates.length; i++) {
        latLng = L.latLng(e.route.coordinates[i]);
        lineCoordinates.push([latLng.lng, latLng.lat, 0]);
      }
    
      var json = {
        coordinates: [lineCoordinates[Math.round((lineCoordinates.length/routes)*286)][0], lineCoordinates[Math.round((lineCoordinates.length/routes)*286)][1]]
      };
    
      //var jsonExport = JSON.stringify(json)
      console.log('JsonExport: '+ json.coordinates);
      fetchChargeStationData(json.coordinates[0], json.coordinates[1]).then((result) => {
        L.marker([result.station_coords[0], result.station_coords[1]]).addTo(map);
      });
      
  });
}

 

  const fetchData = async () => {
    try {
      // Make a GET request to the API
      const response = await fetch('http://172.20.10.3:8000/get_coordinates?start_address='+ input1 + '&' +  'end_address=' + input2);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Parse the response as JSON
      const result = await response.json();
      console.log(result);
      setWayPoint(result)
      initMap(result);
    } catch (err) {
      console.log('error')
    } finally {
      console.log('error')
    }
  }


  const fetchChargeStationData = async (longitude, latitude) => {

    try {
      // Make a GET request to the API
      const response = await fetch('http://172.20.10.3:8000/station_locator?latitude=' + latitude + '&' + 'longitude=' + longitude + '&' + 'fuel_type=ELEC&radius=5');

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Parse the response as JSON
      const result = await response.json();
      console.log(result);
      return result;
    } catch (err) {
      console.log('error')
    } finally {
      console.log('error')
    }
  }

  // Event handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
    // Perform actions with the input values (you can customize this part)
    console.log('Form submitted with values:', input1, input2);
  };

  return (
    <div className='main'>
      <h1>Route Planner</h1>
      <form onSubmit={handleSubmit}>
        {/* Input Form 1 */}
        <label>
          From: 
          <input
            type="text"
            value={input1}
            onChange={(e) => setInput1(e.target.value)}
          />
        </label>
        <br />

        {/* Input Form 2 */}
        <label>
          To:
          <input
            type="text"
            value={input2}
            onChange={(e) => setInput2(e.target.value)}
          />
        </label>
        <br />

        {/* Submit Button */}
        <button disabled= {input1 === '' || input2 === '' ? true : false} type="submit">Submit</button>
      </form>
      <div id="youmap" style={{height: '500px', border:'1px solid black;'}}></div>
    </div>
  );
};

export default SimpleFormApp;