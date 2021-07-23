chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get("rentEstimate", ({ rentEstimate }) => {
    if (rentEstimate === undefined) {
      var rentEstimate = 1000;
      chrome.storage.sync.set({ rentEstimate });
    }
  });
  //console.log('Default background color set to %cgreen', `rentEstimate: ${rentEstimate}`);
});

try {
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.title) {
      if (
        changeInfo.title.includes("MLS #") &&
        changeInfo.title.includes("Zillow")
      ) {
        chrome.scripting.executeScript({
          files: ["zillow.js"],
          target: { tabId: tab.id }
        });
        console.log("run zillow (from bg)");
      }
    }
    if (changeInfo.title) {
      if (
        changeInfo.title.includes("MLS #") &&
        changeInfo.title.includes("Redfin")
      ) {
        chrome.scripting.executeScript({
          files: ["redfin.js"],
          target: { tabId: tab.id }
        });
        console.log("run redfin (from bg)");
      }
    }
  });
} catch (e) {
  console.log(e);
}

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
