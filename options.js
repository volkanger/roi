debugger;
let page = document.getElementById("buttonDiv");
let selectedClassName = "current";
const presetButtonColors = ["#3aa757", "#e8453c", "#f9bb2d", "#4688f1"];

// // Reacts to a button click by marking the selected button and saving
// // the selection
function handleButtonClick(event) {
  
  chrome.storage.sync.get("rentEstimate", ({ rentEstimate }) => {
    alert(rentEstimate + "from options.js");
  });

  rentEstimate = 2;
  chrome.storage.sync.set({ rentEstimate });
  var yeni =  chrome.storage.sync.get("rentEstimate", ({ rentEstimate }) => {
    console.log("yeni");
  });
  alert(yeni + "from options.js");
  
  let current = event.target.parentElement.querySelector(
    `.${selectedClassName}`
  );
  if (current && current !== event.target) {
    current.classList.remove(selectedClassName);
  }

  // Mark the button as selected
  let color = event.target.dataset.color;
  event.target.classList.add(selectedClassName);
  chrome.storage.sync.set({ color });
}



chrome.storage.sync.get("rentEstimate", ({ rentEstimate }) => {
  // alert("Your current Rent Estimate is: $" + rentEstimate);
  document.querySelector("input").value = rentEstimate;
});



function setDefaultRentEstimate() {
  button.addEventListener("click", handleButtonClick);
  alert("hmmf");
}

function setDefaultRentEstimate() {
  const valueOnInput = document.querySelector("input").value;
  // alert("Your Rent Estimate is set as $" + valueOnInput);
  rentEstimate = valueOnInput;
  chrome.storage.sync.set({ rentEstimate });

  dataLoad = {defaultRent: dataLoad.defaultRent};
  chrome.storage.sync.set({key: dataLoad}, function() {
  console.log('Value of defaut rent is set to ' + dataLoad.defaultRent);
  });


}

const el = document.getElementById("buttonDiv");
el.addEventListener("click", setDefaultRentEstimate, false);




// // Add a button to the page for each supplied color
// function constructOptions(buttonColors) {
//   chrome.storage.sync.get("color", (data) => {
//     let currentColor = data.color;
//     // For each color we were provided…
//     for (let buttonColor of buttonColors) {
//       // …create a button with that color…
//       let button = document.createElement("button");
//       button.dataset.color = buttonColor;
//       button.style.backgroundColor = buttonColor;

//       // …mark the currently selected color…
//       if (buttonColor === currentColor) {
//         button.classList.add(selectedClassName);
//       }

//       // …and register a listener for when that button is clicked
//       button.addEventListener("click", handleButtonClick);
//       page.appendChild(button);
//     }
//   });
// }

// Initialize the page by constructing the color options
//constructOptions(presetButtonColors);