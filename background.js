console.log("line 1 - root")
debugger
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get("rentEstimate", ({ rentEstimate }) => {
    if (rentEstimate === undefined) {
      var rentEstimate = 1000;
      chrome.storage.sync.set({ rentEstimate });
      console.log(`rentEstimate: ${rentEstimate}`);
    }
  });
  console.log("line 11 - get rent estimate on listener.")
});

console.log("line 14 - root")

try {
  console.log("line 17 - try")
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    
    if (changeInfo.title) {
      console.log("title changed to: " + changeInfo.title)

      //If the page is a ZILLOW Detail Page
      if ( changeInfo.title.includes("MLS #") && changeInfo.title.includes("Zillow")) {
        console.log("title changed to Zillow")

        chrome.scripting.executeScript({
          files: ["zillow.js"],
          target: { tabId: tab.id }
        },
        // function(rentEstimate) { chrome.tabs.sendMessage(tab.id, rentEstimate) }
          function() { chrome.tabs.sendMessage(tab.id, "selamınaleyküm") }
        );

        console.log("rentestimate --" + rentEstimate)
        var rentEstimate
        console.log("rentestimate --" + rentEstimate)
        chrome.storage.sync.get("rentEstimate", ({ rentEstimate }) => {
          console.log("rentestimate --" + rentEstimate)
          if (rentEstimate === undefined) {
            var rentEstimate = 1000;
            chrome.storage.sync.set({ rentEstimate });
          }
          console.log(rentEstimate)
          return rentEstimate
        });
        console.log("rentestimate --" + rentEstimate)
        console.log("This is where it's about to run zillow.js")
        
        

        console.log("run zillow (from bg)");
        console.log("---------------------saved rentEstimate is " + `${rentEstimate}`)

      //If the page is a REDFIN Detail Page
      } else if (changeInfo.title.includes("MLS #") && changeInfo.title.includes("Redfin")) {
          chrome.scripting.executeScript({
            files: ["redfin.js"],
            target: { tabId: tab.id }
          });
          console.log("run redfin (from bg)");
      }
    }
  });
  console.log("ahöh")
} catch (e) {
  console.log(e);
}
console.log("uhei")

// chrome.runtime.onMessage.addListener((msg, sender, response) => {
//   console.log("the mgs background.js got: ", msg);
//   console.log("msg.command: ", msg.command);
//   console.log("msg.data: ", msg.data);
//   console.log("msg.data.domain: ", msg.data.domain);
//   if(msg == "calculateROI"){
//     console.log("calculateROI button clicked, popup.js sent the info to background js.");
//     const sure = document.querySelector(id).innerText
//     sure = "!!!!!!!!!!!!!!!!"
//     response({text: "this is the response"});
//   }
//   if(msg.name == "fetch"){
//     alert("message received");
//     const sure = document.querySelector(id).innerText
//     sure = "!!!!!!!!!!!!!!!!"
//     response({text: "this is the response"});
//   }
// });
