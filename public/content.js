/* global chrome */

// Reference play button

// Animixplay play button, that hardly works
// var playbtn = document.getElementsByClassName("plyr__controls__item plyr__control")[1]

// Should probably be here
//  const playbtn = document.getElementsByClassName("ytp-play-button ytp-button")[0]
    // const playbtn2 = document.getElementsByClassName("ytp-play-button ytp-button")[1]

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


// Receive message from App.js. works!
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension");
      if (request.greeting === "hello") {
          // alert(request.greeting)
          sendResponse({farewell: "goodbye"});
          //   Pause video on button click from App.js. Works!
          pause()
        }
    }
  );