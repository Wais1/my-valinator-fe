/* global chrome */

import { useEffect, useState } from 'react';
import socketIOClient, { io } from "socket.io-client"
import './App.css';

// Change this to be when button is clicked only connect... then can disconnect at any time
// Put endpoint in process.env for server
// const ENDPOINT = process.env.REACT_APP_SERVICE_URI? process.env.REACT_APP_SERVICE_URI :`http://localhost:5000`
const ENDPOINT = 'https://valinator.herokuapp.com'

// PROBLEM: this is being called *every time the menu is opene,d hence the connection is never consistent. need to figure this out. how to connect ONCe. and forget it.
// BACKGROUND script? possibly. communicate to background script i think.
// THE PROBLEM SERIOUSLY IS THAT ITS ONLY CONNECTED WHEN THE POPUP IS OPEN , WHICH IS THE PROBLEM. NEED TO BE CONNNECTED IN BACKGROUND OR SOMEWHERE WIHLE ITS CLOSED!!!
// Then, add room functionality, the UI, and 'pause' from contentjs reporting clicks on a video to the APP.js 

// works on one client, sending message to the other. 
const socket = socketIOClient(ENDPOINT, { transports : ['websocket'] });
console.log('We connected to the server? possibly?')


function App() {

  const [url, setUrl] = useState('')
  const [roomID, setRoomID] = useState('')
  const [joinedRoom, setJoinedRoom] = useState(false)
  const [alert, setAlert] = useState('')

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

     socket.on('roomUsers', (msg) => {
      console.log('Got a message from socket room room users')
      // Sets joined room to true, if gets room users response from user joining
      setJoinedRoom(true)
      // For some reason, cant access room, only users from server response. set room id from client then.
      console.log(msg)
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

  // Handle room input
  const handleChange = (e) => setRoomID(e.target.value);

  // Handles join room submission
  const joinRoom = () => {
    if (roomID === "") {
      console.log('Room id is empty!')
      //   setAlert("Please enter something", "error");
    } else {
      // Join room
      console.log('Trying to join room')
      socket.emit('joinRoom', { username:'TestUsername', roomID })
      setAlert(roomID)
    }
  };

  // Handles create room submission
  const createRoom = () => {
    const randRoomID = Math.floor(100000 + Math.random() * 900000)
    socket.emit('joinRoom', { username:'TestUsername', randRoomID })
    setRoomID(randRoomID)
    setAlert(randRoomID)
    console.log('Trying to join room')
  };

  return (
    <div className="App">
      <div className="container">
        { joinedRoom ? ( 
        <>
          <button onClick={pause}>Pause / Unpause </button>
          <p> {alert} </p>
        </>
        ) : ( 
          <>
            <input onSubmit={(e) => {e.preventDefault();}} onChange={handleChange} placeholder='Room Id'></input>
            <button onClick={joinRoom}>Join Room</button>
            <button onClick={createRoom}>Create a Room</button>
          </>
        )}
        
        <h1>Current URL{url}</h1>
      </div>
    </div>
  );
}

export default App;
