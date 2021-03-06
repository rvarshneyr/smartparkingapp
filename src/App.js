import logo from './logo.svg';
import './App.css';

import {API,Auth} from 'aws-amplify';
//import {withAuthenticator} from '@aws-amplify/ui-react'
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import React, { useState, useEffect } from 'react';
const initialFormState = { radius: '', latitude: '' , longitude:''}

function App({ signOut }) {

  const [notes, setNotes] = useState([]);

  useEffect(() => {
    callApi();
  }, []);

  const [formData, setFormData] = useState(initialFormState);

  async function callApi() {
    const user = await Auth.currentAuthenticatedUser();
    const token = user.signInUserSession.idToken.jwtToken
    console.log(token)
  

    const requestInfo = {
      headers: {
        Authorization: token
      }
    }
    const data = await API.get('smartparkingauthapi','/queryParking?radius='+ formData.radius+'&latitude='+ formData.latitude +'&longitude='+ formData.longitude,requestInfo)
    setNotes(data.openParkings);
    console.log(data)

  }
  return (
    <div className="App">
    <h1>Smart Parking App</h1>
    <input
      onChange={e => setFormData({ ...formData, 'radius': e.target.value})}
      placeholder="Radius in meters e.g 100"
      value={formData.radius}
    />
    <input
      onChange={e => setFormData({ ...formData, 'latitude': e.target.value})}
      placeholder="Latitude e.g -32.8645"
      value={formData.latitude}
    />
     <input
      onChange={e => setFormData({ ...formData, 'longitude': e.target.value})}
      placeholder="Longitude e.g 25.9577"
      value={formData.longitude}
    />
    <button onClick={callApi}>Parking Near me</button>
    <div className="container">
      {
        notes.map(note => (
          <div key={note.number}>
            <h2> Parking#:{note.number}</h2>
            <p>{note.address}</p>
            
          </div>
        ))
      }
    </div>
    <AmplifySignOut />
  </div>
    
  );
}

export default withAuthenticator(App);
