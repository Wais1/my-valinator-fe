/* global chrome */

import { useEffect, useState } from 'react';
import socketIOClient from "socket.io-client"
import './App.css';

// Change this to be when button is clicked only connect... then can disconnect at any time
// Put endpoint in process.env for server
// const ENDPOINT = process.env.REACT_APP_SERVICE_URI? process.env.REACT_APP_SERVICE_URI :`http://localhost:5000`
const ENDPOINT = 'https://valinator.herokuapp.com'

// PROBLEM: this is being called *every time the menu is opene,d hence the connection is never consistent. need to figure this out. how to connect ONCe. and forget it.
// BACKGROUND script? possibly. communicate to background script i think.
// THE PROBLEM SERIOUSLY IS THAT ITS ONLY CONNECTED WHEN THE POPUP IS OPEN , WHICH IS THE PROBLEM. NEED TO BE CONNNECTED IN BACKGROUND OR SOMEWHERE WIHLE ITS CLOSED!!!
// Then, add room functionality, the UI, and 'pause' from contentjs reporting clicks on a video to the APP.js 
const socket = socketIOClient(ENDPOINT, { transports : ['websocket'] });
console.log('We connected to the server? possibly?')


function App() {

  const [url, setUrl] = useState('')

  useEffect(() => {    
    // Get current Url
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
      console.log(`URL`);
      console.log(tabs[0].url);
      setUrl(tabs[0].url)
    });

     // On request to pause from server, pause the video on client.
     // Not getting triggered. posibly because one extension counts as ONE CLIENT. therefore, need to test with a completely different extension install.
     socket.on('pause', ({ room, users }) => {
       console.log('There is a request to pause from server')
       togglePauseClient()
     })
  }, []);

  // Pauses others connected to server
  const pauseOthers = () => {
    socket.emit('pause', 'test');
  }

  // Pauses on client. Communicate with content.js. 
  const togglePauseClient = () => {
    // Send pause notif to server to send to other clients
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
        console.log(response.farewell);
      });
    });
    console.log('Tried to pause client in function')
  }

  // Pauses for client AND alerts the others.
  const pause = () => {
    togglePauseClient()
    pauseOthers()
  }

  return (
    <div className="App">
      <div className="container">
        <h1>URL</h1>
        <button onClick={pause}>Pause / Unpause </button>
        <button onClick={pauseOthers}>Start a party / Make a room now</button>
        <h1>Test {url}</h1>
      </div>
    </div>
  );
}

export default App;
