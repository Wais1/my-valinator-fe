/* global chrome */

// Reference play button

// Animixplay play button, that hardly works
// var playbtn = document.getElementsByClassName("plyr__controls__item plyr__control")[1]

// Should probably be here
//  const playbtn = document.getElementsByClassName("ytp-play-button ytp-button")[0]
    // const playbtn2 = document.getElementsByClassName("ytp-play-button ytp-button")[1]


// Global nextLink var, should be private and returned by function


// Define pause button
const pause = () =>{
  // Youtube play button WORKS with youtube
  const playbtn = document.getElementsByClassName("ytp-play-button ytp-button")[0]
  
  // Experimental (press both buttons, not just one. diff on diff machines)
  const playbtn2 = document.getElementsByClassName("ytp-play-button ytp-button")[1]
  // MAYBE ITS BEING CALLED BEFORE ITS FULLY LOADED AND THEREFORE RANDOMLY WORKS OR DOESNT

  // check if playbtn returns something (clg). check if undefined. if undefined, return (while undefined)
  playbtn.click()
  // Experimental: pressing both buttons.
  playbtn2.click()
} 

// To test YT play functions
// setInterval(pause,5000);


// Request to change video to link specified from socket io server
const changeVideoReceived = (link) => {
  window.location.href = link;
}



// Changes video LOCAL to first on the recommended list. create another for receiving,
const changeVideo = () => {
  const nextElement = document.getElementsByClassName("yt-simple-endpoint style-scope ytd-compact-video-renderer")[0]
  const nextLink = nextElement.href;

  console.log('Next link:')
  console.log(nextLink)

  // Redirect user to new page
  window.location.href = nextLink;

  // return next link
  return nextLink


  // Send same link to other members of party

}


// Receive message from App.js. works!
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension");

      // Checking if user wants to pause, handle communication pipeline between content.js and App.js
      // exploit works so far!! 
      if (request.greeting === "hello") {
          // alert(request.greeting)
          sendResponse({farewell: "goodbye"});
          //   Pause video on button click from App.js. Works!
          pause()
        }

      // Works so far, can change video from button. now, 
      // Check if user wants to change video
      if (request.greeting === "changeVid") {
          // alert(request.greeting)

          // Change video and store next link in variable.
          const nextLink = changeVideo()

          // Include link in farewell to send to others in server.
          sendResponse({farewell: nextLink});
          //   Pause video on button click from App.js. Works!
          pause()
        }

      // Change video from link sent from server
      if (request.greeting === "changeVidReceived") {
          // alert(request.greeting)

          changeVideoReceived(request.vidLink)
          console.log(`The requested video link in content js: ${request.vidLink}`)

          // Include link in farewell to send to others in server.
          sendResponse({farewell: "link was received from server to content.js"});
          //   Pause video on button click from App.js. Works!
          pause()
        }
        
    }
  );