/* global chrome */

// Reference play button

// Animixplay play button, that hardly works
// var playbtn = document.getElementsByClassName("plyr__controls__item plyr__control")[1]

// Youtube play button WORKS with youtube
const playbtn = document.getElementsByClassName("ytp-play-button ytp-button")[0]


// Define pause button
const pause = () => playbtn.click()

// To test YT play functions
// setInterval(pause,5000);


// Receive message from App.js. works!
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension");
      if (request.greeting === "hello") {
          alert(request.greeting)
          sendResponse({farewell: "goodbye"});
          //   Pause video on button click from App.js. Works!
          pause()
        }
    }
  );