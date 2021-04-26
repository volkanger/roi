try{
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {

    if (changeInfo.title.includes("MLS #")) {

        console.log("----------------------URL IS------------------" + changeInfo.url);
        console.log("----------------------TITLE IS------------------" + changeInfo.title);
        chrome.scripting.executeScript({
          files: ['zillow.js'],
          target: {tabId: tab.id}
        });
      }
    
  });

}catch(e){
  console.log(e);
}