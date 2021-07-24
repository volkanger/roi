chrome.storage.sync.get("rentEstimate", ({ rentEstimate }) => {
  
  chrome.storage.sync.get(['key'], 
    function(result) {
      debugger;
  //define variables
  var dataLoad = {
    askingPrice: 360000,
    propertyTaxes: 1700,
    hoaCost: 310,
    rentZestimate: 2000,
    years: 12,
    defaultRent: rentEstimate
  }

      // alert('Value currently is ' + result.key.askingPrice);
      if(result.key){ //if there's anything coming from zillow
        if(result.key.askingPrice){ //checking if they're ALL here,  one  by one
          dataLoad.askingPrice = result.key.askingPrice
        }
        if(result.key.propertyTaxes){ //checking if they're ALL here,  one  by one
          dataLoad.propertyTaxes = result.key.propertyTaxes
        }
        if(result.key.hoaCost >= 0){ //checking if they're ALL here,  one  by one
          dataLoad.hoaCost = result.key.hoaCost
        } 
        if(result.key.rentZestimate){ //checking if they're ALL here,  one  by one
          dataLoad.rentZestimate = result.key.rentZestimate
        } else {
          dataLoad.rentZestimate = dataLoad.defaultRent
        }
        dataLoad.years = result.key.years
      }


      // calculate if there's any missing data that'd compromise the dataLoad integrity
      calculateROI(dataLoad.askingPrice,dataLoad.rentZestimate,dataLoad.hoaCost,dataLoad.propertyTaxes);
      writeInputs();
      let inputs = document.querySelectorAll("input");
  inputs.forEach(function (input) {
    input.onfocus = inputFocus;
    input.onblur = inputBlur;
    input.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        this.blur();
        inputBlur();
      }
    });
  });
    


  // //Find: Storage dan datalari al. chrome.storage.sync.get
  // function syncGet(obj){
  // alert("propertyTaxes " + dataLoad.propertyTaxes)
  // alert("price " + dataLoad.askingPrice)
  // };



  //Clean: inputa girilen degeri sadece rakama dondurulecek.
  function onlyNumbers(a) {
    a = a.toString().replace(/\D/g, "");
    return a;
  }


  //Susle: $ ve /mo gelecek formatter.format
  function susle(e){
    onlyNumbers(e);
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0
    });
    
    if (e == dataLoad.askingPrice){ // askingPrice degilse asagidakini calistir
      e = formatter.format(e);  //$170,000

    } else {
      e = formatter.format(e) + "/mo"; //$300/mo yazmasi lazim
    }
    return e;
  };



  //Write: input'a bilgiler yazdirilicak.
  function writeInputs() {
        document.querySelector(".askingPrice").value = susle(dataLoad.askingPrice)
        if (dataLoad.hoaCost === 0) {
          document.querySelector(".hoaCost").value = "$0/mo";
        } else {
          document.querySelector(".hoaCost").value = susle(dataLoad.hoaCost)
        }
        document.querySelector(".propertyTaxes").value = susle(dataLoad.propertyTaxes)
        document.querySelector(".rentZestimate").value = susle(dataLoad.rentZestimate)
        if (dataLoad.years >= 0) {
          document.querySelector(
            ".years"
          ).innerHTML = `Calculated return in: </br> <strong>${dataLoad.years} years</strong>`;
        } else {
          document.querySelector(
            ".years"
          ).innerHTML = `Calculated return in: </br><strong>Never</strong>`;
        }
        document.getElementById("calculateButton").style.display = "none";
        document.querySelector(".years").style.fontSize = "20px";   
  }


  //reADing from the popup fields
  function readInputs() {
    dataLoad.askingPrice = onlyNumbers(document.querySelector(".askingPrice").value)
    dataLoad.hoaCost = onlyNumbers(document.querySelector(".hoaCost").value)
    dataLoad.propertyTaxes = onlyNumbers(document.querySelector(".propertyTaxes").value)
    dataLoad.rentZestimate = onlyNumbers(document.querySelector(".rentZestimate").value)
  }
  // function updateROI() {
  //   askingPrice = document.querySelector(".askingPrice").value.replace(/\D/g, "");
  //   rentZestimate = document
  //     .querySelector(".rentZestimate")
  //     .value.replace(/\D/g, "");
  //   propertyTaxes = document
  //     .querySelector(".propertyTaxes")
  //     .value.replace(/\D/g, "");
  //   hoaCost = document.querySelector(".hoaCost").value.replace(/\D/g, "");
  //   years = askingPrice / ((rentZestimate - hoaCost - propertyTaxes) * 12);
  //   if (years > 0) {
  //     document.querySelector(
  //       ".years"
  //     ).innerHTML = `Calculated return in: </br> <strong>${years.toFixed(
  //       2
  //     )} years</strong>`;
  //   } else {
  //     document.querySelector(
  //       ".years"
  //     ).innerHTML = `Calculated return in: </br><strong>Never</strong>`;
  //   }
  // }
  //inputblur fonnksiyonu ile yeni verileri hesaplatmak lazim updateroi den bakabiliriz


  function inputFocus() {
    document.querySelector(".years").style.display = "none";
    document.getElementById("calculateButton").style.display = "inline-block";
    this.select();
    
  }
  function inputBlur() { 
    readInputs();
    document.querySelector(".years").style.display = "block";
    document.getElementById("calculateButton").style.display = "none";
    dataLoad.years = calculateROI(dataLoad.askingPrice,dataLoad.rentZestimate,dataLoad.hoaCost,dataLoad.propertyTaxes);
    writeInputs();
  }

    
  //popup update --> input degeri degisecek


  //Calculate: Yeni degerlerle hesapla
  function calculateROI(askingPrice, rentZestimate, hoaCost, propertyTaxes) {

    dataLoad.years = (askingPrice / ((rentZestimate - hoaCost - propertyTaxes) * 12)).toFixed(2);

    dataLoad = {years: dataLoad.years, rentZestimate: dataLoad.rentZestimate, propertyTaxes: dataLoad.propertyTaxes, hoaCost: dataLoad.hoaCost, askingPrice: dataLoad.askingPrice};
    chrome.storage.sync.set({key: dataLoad}, function() {
    console.log('Value of rent zest is set to ' + dataLoad.rentZestimate);
    });


    return dataLoad.years;
  }
  //Save chrome.storage.sync.set



  }
  );

});













