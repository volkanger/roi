chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
  var activeTab = tabs[0];
  chrome.tabs.sendMessage(activeTab.id, {command: "openModal"});
});


// chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
//   var activeTab = tabs[0];
//   domain = activeTab.url.replace('http://', '').replace('https://', '').replace('www.','').split(/[/?#]/)[0];
//   console.log(domain);
//   chrome.runtime.sendMessage({command: "advanced", data: {domain: domain}}, (response) => {
//     console.log("advanced Message Sent");
//   });
// });


// Initialize button with user's preferred color let calculateButton = document.getElementById("calculateButton");

// let roi = document.getElementById("roi");
// roi.innerText = document.documentElement.innerText;


chrome.storage.sync.get("color", ({ color }) => {
  calculateButton.style.backgroundColor = color;
});


// action.onClicked.addListener(listener: function) 
const openBit = async () => {
  //chrome.runtime.sendMessage("calculateROI");
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: calculateROI,
    });
  };

openBit();

function calculateROI() {
  var allContent = document.documentElement.innerText;
  var hoaCost;

  if (document.URL.includes("zillow.com")) {
    var askingPrice = document.querySelector("span > span > span").innerText.replace("$", "").replace(",", "");
    if(allContent.search("HOA fees") > 0) {
      if(allContent.slice(allContent.search("HOA fees")+9, allContent.search("HOA fees")+19).includes("N/A")) {
      hoaCost = 0;    
      } else {
      var hoaCost = allContent.slice(allContent.search("HOA fees")+9, allContent.search("HOA fees")+19).split("/")[0].replace("$","").replace(",","")
      }
  } else {
      hoaCost = 0;
  }

  if(allContent.search("Property taxes") > 0 || allContent.search("Property Taxes") > 0) {
  var propertyTaxes = allContent.slice(allContent.search("Property taxes")+15, allContent.search("Property taxes")+25).split("/")[0].replace("$","").replace(",","")
  } else {
      propertyTaxes = 0.0225 * askingPrice;
  }

  if(allContent.search("Rent Zestimate") > 0) {
  var rentZestimate = allContent.slice(allContent.search("Rent Zestimate")+16, allContent.search("Rent Zestimate")+25).split("/")[0].replace("$","").replace(",","")
  } else {
    var rentZestimate = 1000;
  };
    
  var years = askingPrice / ((rentZestimate - hoaCost - propertyTaxes) * 12);
  
  
  chrome.runtime.sendMessage({name: "calculations", data: {years: years, rentZestimate: rentZestimate, propertyTaxes: propertyTaxes, hoaCost: hoaCost, askingPrice: askingPrice}}, (response) => {
    console.log("calculations sent (popup js)");

  });

  };





  if (document.URL.includes("redfin.com")) {
  









          var allContent = document.documentElement.innerText
          var askingPrice = document.querySelectorAll('[data-rf-test-id="abp-price"]').item(0).firstElementChild.innerText.replace("$", "").replace(",", "");
              if(allContent.search("HOA Dues") > 0) {
              if(allContent.slice(allContent.search("HOA Dues")+9, allContent.search("HOA Dues")+19).includes("N/A")) {
              hoaCost = 0;    
              } else {
              var hoaCost = allContent.slice(allContent.search("HOA Dues")+9, allContent.search("HOA Dues")+19).split("/")[0].replace("$","").replace(",","")
              };
              console.log(hoaCost);
          } else {
              hoaCost = 0;
          }

          if(allContent.search("Property Taxes") > 0) {
              console.log("CAPS T");
              var propertyTaxes = allContent.slice(allContent.search("Property Taxes")+15, allContent.search("Property Taxes")+20).split("/")[0].split("\n")[0].replace("$","").replace(",","");
              console.log(propertyTaxes);
          } else if(allContent.search("Property taxes") > 0) {
              console.log("lowercase t");
              var propertyTaxes = allContent.slice(allContent.search("Property taxes")+15, allContent.search("Property taxes")+20).split("/")[0].replace("$","").replace(",","");
              console.log(propertyTaxes);
          } else {
                  propertyTaxes = 0.0225 * askingPrice;
          };

          if(allContent.search("Rental Estimate") > 0) {
              var rentZestimate = allContent.slice(allContent.search(" / mo") - 15, allContent.search(" / mo")).split("-")[0].replace("$","").replace(",","").replace(" ","");
              console.log("rental estimate = " + rentZestimate);
          } else if(allContent.search("Monthly Rent") > 0) {
          var rentZestimate = allContent.slice(allContent.search("Monthly Rent")+14, allContent.search("Monthly Rent")+19).split("/")[0].replace("$","").replace(",","");
          console.log("montly rent = " + rentZestimate);
          } else {
              var rentZestimate = 1000;
          };
              
          var years = askingPrice / ((rentZestimate - hoaCost - propertyTaxes) * 12);
          
          
          chrome.runtime.sendMessage({name: "calculations", data: {years: years, rentZestimate: rentZestimate, propertyTaxes: propertyTaxes, hoaCost: hoaCost, askingPrice: askingPrice}}, (response) => {
              console.log("calculations sent (popup)");
              console.log(document.URL);

          });
          
          var years = askingPrice / ((rentZestimate - hoaCost - propertyTaxes) * 12);
          
          if(rentZestimate > 0) {
              console.log("rent estimate bigger than zero");
              var clone = document.querySelector(".home-main-stats-variant").firstElementChild.cloneNode(true);
              //document.querySelector(".home-main-stats-variant").appendChild(clone);
              // alert("Asking price: $" + askingPrice + "\nHOA: $" + hoaCost + "\nProperty Taxes: $" + propertyTaxes + "\nRent Zestimate: $" + rentZestimate + "\nCalculated ROI: " + years.toFixed(2) + " years.");

             
              chrome.runtime.sendMessage({name: "calculations", data: {years: years, rentZestimate: rentZestimate, propertyTaxes: propertyTaxes, hoaCost: hoaCost, askingPrice: askingPrice}}, (response) => {
                  console.log("calculations sent (redfin)");
                  // parseCoupons(response.data, domain);
                });
  };    








































  }
};



// When the Asking Price Edit is clicked, 
askingPriceEdit.addEventListener("click", async () => {
  document.querySelector(".askingPriceText").style.display = "none";
  document.querySelector("#askingPriceField").style.display = "block";
  document.querySelector("#askingPriceField").focus();

  const field = document.getElementById('askingPriceField');

  field.addEventListener('focusin', (event) => {
    event.target.style.background = 'pink';
  });
  
  field.addEventListener('focusout', (event) => {
    document.querySelector(".askingPriceText").style.display = "block";
    document.querySelector("#askingPriceField").style.display = "none";
    document.querySelector(".askingPriceText").innerText = formatter.format(document.querySelector("#askingPriceField").value);
  });    
  });

  // When the HoaCost Price Edit is clicked, 
hoaCostEdit.addEventListener("click", async () => {
  document.querySelector(".hoaCostText").style.display = "none";
  document.querySelector("#hoaCostField").style.display = "block";
  document.querySelector("#hoaCostField").focus();

  const hoafield = document.getElementById('hoaCostField');

  hoafield.addEventListener('focusin', (event) => {
    event.target.style.background = 'pink';
  });
  
  hoafield.addEventListener('focusout', (event) => {
    document.querySelector(".hoaCostText").style.display = "block";
    document.querySelector("#hoaCostField").style.display = "none";
    document.querySelector(".hoaCostText").innerText = formatter.format(document.querySelector("#hoaCostField").value);
  });
  });

    // When the propertyTaxes Price Edit is clicked, 
propertyTaxesEdit.addEventListener("click", async () => {
  document.querySelector(".propertyTaxesText").style.display = "none";
  document.querySelector("#propertyTaxesField").style.display = "block";
  document.querySelector("#propertyTaxesField").focus();

  const field = document.getElementById('propertyTaxesField');

  field.addEventListener('focusin', (event) => {
    event.target.style.background = 'pink';
  });
  
  field.addEventListener('focusout', (event) => {
    document.querySelector(".propertyTaxesText").style.display = "block";
    document.querySelector("#propertyTaxesField").style.display = "none";
    document.querySelector(".propertyTaxesText").innerText = formatter.format(document.querySelector("#propertyTaxesField").value);
  });

  });

  // When the rentZestimate Price Edit is clicked, 
  rentZestimateEdit.addEventListener("click", async () => {
    document.querySelector(".rentZestimateText").style.display = "none";
    document.querySelector("#rentZestimateField").style.display = "block";
    document.querySelector("#rentZestimateField").focus();
  
    const field = document.getElementById('rentZestimateField');
  
    field.addEventListener('focusin', (event) => {
      event.target.style.background = 'pink';
    });
    
    field.addEventListener('focusout', (event) => {
      document.querySelector(".rentZestimateText").style.display = "block";
      document.querySelector("#rentZestimateField").style.display = "none";
      document.querySelector(".rentZestimateText").innerText = formatter.format(document.querySelector("#rentZestimateField").value);
    });
    });



// When the button is clicked, 
calculateButton.addEventListener("click", async () => {
  updateROI();
  // chrome.runtime.sendMessage("updateROI");
  //   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  //   chrome.scripting.executeScript({
  //     target: { tabId: tab.id },
  //     function: updateROI,
  //   });
    
  });

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
});
  
// formatter.format(1000)

function updateROI() {
  askingPrice = document.querySelector(".askingPrice").value;
  rentZestimate = document.querySelector(".rentZestimate").value;
  propertyTaxes = document.querySelector(".propertyTaxes").value;
  hoaCost = document.querySelector(".hoaCost").value;
  years = askingPrice / ((rentZestimate - hoaCost - propertyTaxes) * 12);
  if (years > 0) {
    document.querySelector(".years").innerText = "Calculated return in: " + years.toFixed(2) + " years";
  } else {
    document.querySelector(".years").innerText = "Calculated return in: Never";
  }
};


  // The body of this function will be executed as a content script inside the
  // current page
  




chrome.runtime.onMessage.addListener((msg, sender, response) => {
  console.log("the mgs popus.js got: ", msg);
  if(msg.name == "calculations") {
    if (msg.data.years > 0) {
      document.querySelector(".years").innerText = "Calculated return in: " + msg.data.years.toFixed(2) + " years";
    } else {
      document.querySelector(".years").innerText = "Calculated return in: Never";
    }
    document.querySelector(".askingPrice").value = msg.data.askingPrice;
    document.querySelector(".rentZestimate").value = msg.data.rentZestimate;
    document.querySelector(".propertyTaxes").value = msg.data.propertyTaxes;
    document.querySelector(".hoaCost").value = msg.data.hoaCost;
    document.querySelector(".askingPriceText").innerText = formatter.format(msg.data.askingPrice);
    document.querySelector(".rentZestimateText").innerText = formatter.format(msg.data.rentZestimate);
    document.querySelector(".propertyTaxesText").innerText = formatter.format(msg.data.propertyTaxes);
    document.querySelector(".hoaCostText").innerText = formatter.format(msg.data.hoaCost);  
  }
  if(msg == "fromZillow"){
    console.log("coming from Zillow.");
    const sure = document.querySelector(id).innerText
    sure = "!!!!!!!!!!!!!!!!"
    response({text: "this is the response"});
  }
  if(msg.name == "fetch"){
    alert("message received");
    const sure = document.querySelector(id).innerText
    sure = "!!!!!!!!!!!!!!!!"
    response({text: "this is the response"});
  }
});