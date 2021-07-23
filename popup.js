//aslinda zillow.js calistigi zaman hesapliyor ya, 
//mesaj gonderse, onu alarak devam edebilir popup. 
//su an calculateROI calistiriyor bos yere.

  var rentZestimate
  var years
  var propertyTaxes
  var hoaCost = 5;
  var askingPrice



const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0
});

let inputs = document.querySelectorAll("input");
//inputs.onfocus = inputFocus;

inputs.forEach(function (input) {
  input.onfocus = inputFocus;
  input.onblur = inputBlur;
});

function inputFocus() {
  document.querySelector(".years").style.display = "none";
  document.getElementById("calculateButton").style.display = "inline-block";
  this.select();
}
function inputBlur() {
  document.querySelector(".years").style.display = "block";
  document.querySelector(".years").style.fontSize = "20px";
  document.getElementById("calculateButton").style.display = "none";
  updateROI();

  document.querySelector(".askingPrice").value = formatter.format(
    document.querySelector(".askingPrice").value.replace(/\D/g, "")
  );
  document.querySelector(".propertyTaxes").value =
    formatter.format(
      document.querySelector(".propertyTaxes").value.replace(/\D/g, "")
    ) + "/mo";
  document.querySelector(".hoaCost").value =
    formatter.format(
      document.querySelector(".hoaCost").value.replace(/\D/g, "")
    ) + "/mo";
  document.querySelector(".rentZestimate").value =
    formatter.format(
      document.querySelector(".rentZestimate").value.replace(/\D/g, "")
    ) + "/mo";
}
inputs.forEach(function (input) {
  input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      this.blur();
      inputBlur();
    }
  });
});

chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
  var activeTab = tabs[0];
  chrome.tabs.sendMessage(activeTab.id, { command: "openModal" });
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

function calculateROI() {
  chrome.storage.sync.get(['key'], function(result) {
    propertyTaxes = result.key.propertyTaxes
    askingPrice = result.key.askingPrice;
  console.log("here " + result.key.hoaCost);
    hoaCost = result.key.hoaCost
  console.log("hoaCost = result.key.hoaCost   " + result.key.hoaCost)
    rentZestimate = result.key.rentZestimate
    years = result.key.years
    
    document.querySelector(".askingPrice").value = formatter.format(askingPrice.replace(/\D/g, ""));
    if (hoaCost === 0) {
      document.querySelector(".hoaCost").value = "$0/mo";
    } else {
      document.querySelector(".hoaCost").value = formatter.format(hoaCost.replace(/\D/g, "")) + "/mo";
    }
    document.querySelector(".propertyTaxes").value = formatter.format(propertyTaxes.replace(/\D/g, "")) + "/mo";
    document.querySelector(".rentZestimate").value = formatter.format(rentZestimate.replace(/\D/g, "")) + "/mo";
    
  });
  
  
}


// // action.onClicked.addListener(listener: function)
// const openBit = async () => {
//   //chrome.runtime.sendMessage("calculateROI");
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     function: calculateROI
//   });
// };

// openBit();



// When the button is clicked,
calculateButton.addEventListener("click", async () => {
  inputBlur();
  // chrome.runtime.sendMessage("updateROI");
  //   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  //   chrome.scripting.executeScript({
  //     target: { tabId: tab.id },
  //     function: updateROI,
  //   });
});

// formatter.format(1000)

function updateROI() {
  askingPrice = document.querySelector(".askingPrice").value.replace(/\D/g, "");
  rentZestimate = document
    .querySelector(".rentZestimate")
    .value.replace(/\D/g, "");
  propertyTaxes = document
    .querySelector(".propertyTaxes")
    .value.replace(/\D/g, "");
  hoaCost = document.querySelector(".hoaCost").value.replace(/\D/g, "");
  years = askingPrice / ((rentZestimate - hoaCost - propertyTaxes) * 12);
  if (years > 0) {
    document.querySelector(
      ".years"
    ).innerHTML = `Calculated return in: </br> <strong>${years.toFixed(
      2
    )} years</strong>`;
  } else {
    document.querySelector(
      ".years"
    ).innerHTML = `Calculated return in: </br><strong>Never</strong>`;
  }
}

// The body of this function will be executed as a content script inside the
// current page

chrome.runtime.onMessage.addListener((msg, sender, response) => {
  debugger;
  console.log("the mgs popus.js got: ", msg);
  if (msg.name == "calculations") {
    console.log("the mgs popus.js got: ", msg);
    if (msg.data.years > 0) {
      document.querySelector(".years").innerText =
        "Calculated return in: " + msg.data.years.toFixed(2) + " years";
    } else {
      document.querySelector(".years").innerText =
        "Calculated return in: Never";
    }
    // document.querySelector(".askingPrice").value = msg.data.askingPrice;
    // document.querySelector(".rentZestimate").value = msg.data.rentZestimate;
    // document.querySelector(".propertyTaxes").value = msg.data.propertyTaxes;
    // document.querySelector(".hoaCost").value = msg.data.hoaCost;
    document.querySelector(".askingPrice").value = formatter.format(
      msg.data.askingPrice
    );
    document.querySelector(".rentZestimate").value =
      formatter.format(msg.data.rentZestimate) + "/mo";
    document.querySelector(".propertyTaxes").value =
      formatter.format(msg.data.propertyTaxes) + "/mo";
    document.querySelector(".hoaCost").value =
      formatter.format(msg.data.hoaCost) + "/mo";
  }
  if (msg == "fromZillow") {
    console.log("coming from Zillow.");
    const sure = document.querySelector(id).innerText;
    sure = "!!!!!!!!!!!!!!!!";
    response({ text: "this is the response" });
  }
  if (msg.name == "fetch") {
    alert("message received");
    const sure = document.querySelector(id).innerText;
    sure = "!!!!!!!!!!!!!!!!";
    response({ text: "this is the response" });
  }
});

calculateROI();
