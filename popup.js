console.log("start")




chrome.storage.sync.get("rentEstimate", ({ rentEstimate }) => {
  //taking the rent estimate from Options menu above.
  console.log("rentestimate from options menu = " + rentEstimate)
  chrome.storage.sync.get(['key'], 
    function(result) {
      console.log(result),
      console.log("cnh8i")
      debugger;
  //define variables
  var dataLoad = {
    askingPrice: 333333,
    propertyTaxes: 1111,
    hoaCost: 222,
    rentEstimate: 4444,
    years: 55,
    defaultRent: rentEstimate
  }
  console.log("nakgn")

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
        if(result.key.rentEstimate){ //checking if they're ALL here,  one  by one
          dataLoad.rentEstimate = result.key.rentEstimate
        } else {
          dataLoad.rentEstimate = dataLoad.defaultRent
        }
        dataLoad.years = result.key.years
      }


      // calculate if there's any missing data that'd compromise the dataLoad integrity
      calculateROI(dataLoad.askingPrice,dataLoad.rentEstimate,dataLoad.hoaCost,dataLoad.propertyTaxes);
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
        document.querySelector(".rentZestimate").value = susle(dataLoad.rentEstimate)
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
    dataLoad.rentEstimate = onlyNumbers(document.querySelector(".rentZestimate").value)
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
    dataLoad.years = calculateROI(dataLoad.askingPrice,dataLoad.rentEstimate,dataLoad.hoaCost,dataLoad.propertyTaxes);
    writeInputs();
  }

    
  //popup update --> input degeri degisecek


  //Calculate: Yeni degerlerle hesapla
  function calculateROI(askingPrice, rentEstimate, hoaCost, propertyTaxes) {

    dataLoad.years = (askingPrice / ((rentEstimate - hoaCost - propertyTaxes) * 12)).toFixed(2);

    dataLoad = {years: dataLoad.years, rentEstimate: dataLoad.rentEstimate, propertyTaxes: dataLoad.propertyTaxes, hoaCost: dataLoad.hoaCost, askingPrice: dataLoad.askingPrice};
    chrome.storage.sync.set({key: dataLoad}, function() {
    console.log('Value of rent zest is set to ' + dataLoad.rentEstimate);
    console.log('asking:' + askingPrice + ' zestimate:' + rentEstimate + ' hoa:' + hoaCost + ' taxes:' + propertyTaxes)
    });


    return dataLoad.years;
  }
  //Save chrome.storage.sync.set



  }
  );

});













