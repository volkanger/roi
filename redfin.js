function scraper() {
    //scrapes the page for values
    var allContent = document.documentElement.innerText
    var askingPrice = document.querySelectorAll('[data-rf-test-id="abp-price"]').item(0).firstElementChild.innerText.replace("$", "").replace(",", "");
        if(allContent.search("HOA Dues") > 0) {
        if(allContent.slice(allContent.search("HOA Dues")+9, allContent.search("HOA Dues")+19).includes("N/A")) {
        hoaCost = 0;    
        } else {
        var hoaCost = allContent.slice(allContent.search("HOA Dues")+9, allContent.search("HOA Dues")+19).split("/")[0].replace("$","").replace(",","")
        };
        console.log("hoa = " + hoaCost);
    } else {
        hoaCost = 0;
    }

    if(allContent.search("Property Taxes") > 0) {
        console.log("CAPS T Taxes(redfin)");
        var propertyTaxes = allContent.slice(allContent.search("Property Taxes")+15, allContent.search("Property Taxes")+19).split("/")[0].replace("$","").replace(",","");
        console.log("property taxes = " + propertyTaxes);
    } else if(allContent.search("Property taxes") > 0) {
        console.log("lowercase t taxes(redfin)");
        var propertyTaxes = allContent.slice(allContent.search("Property taxes")+15, allContent.search("Property taxes")+19).split("/")[0].replace("$","").replace(",","");
        console.log(propertyTaxes);
    } else {
            propertyTaxes = 0.0225 * askingPrice;
    };

    if(allContent.search("Rental Estimate") > 0) {
        var rentEstimate = allContent.slice(allContent.search(" / mo") - 15, allContent.search(" / mo")).split("-")[0].replace("$","").replace(",","").replace(" ","");
        console.log("rental estimate = " + rentEstimate);
    } else if(allContent.search("Monthly Rent") > 0) {
    var rentEstimate = allContent.slice(allContent.search("Monthly Rent")+14, allContent.search("Monthly Rent")+19).split("/")[0].replace("$","").replace(",","");
    console.log("montly rent = " + rentEstimate);
    }

    if (rentEstimate === undefined) {
        grabOptions('rentEstimate', askingPrice, hoaCost, propertyTaxes)    
    } else {
        updateUI()
    }
}


function grabOptions(key, askingPrice, hoaCost, propertyTaxes) {
    //grabs the estimate from db
    //chrome.storage.sync.get(key, callback(askingPrice, hoaCost, propertyTaxes, result.key));

    chrome.storage.sync.get([key], function(result) {
        console.log('Value currently is ' + result.rentEstimate);
        calcul(result.rentEstimate, askingPrice, hoaCost, propertyTaxes)
      });
}

  
function calcul(rentEstimate, askingPrice, hoaCost, propertyTaxes) {
    //give the parameters, will get back with calculation years
    var years = askingPrice / ((rentEstimate - hoaCost - propertyTaxes) * 12);
    updateUI(rentEstimate, askingPrice, hoaCost, propertyTaxes, years)
}                                                                    


function updateUI(rentEstimate, askingPrice, hoaCost, propertyTaxes, years) {
    //give it the year, will show on the page
        var clone = document.querySelector(".home-main-stats-variant").lastElementChild.cloneNode(true);
        //document.querySelector(".home-main-stats-variant").appendChild(clone);
        // alert("Asking price: $" + askingPrice + "\nHOA: $" + hoaCost + "\nProperty Taxes: $" + propertyTaxes + "\nRent Zestimate: $" + rentZestimate + "\nCalculated ROI: " + years.toFixed(2) + " years.");

    setTimeout(() => {  
        document.querySelector(".home-main-stats-variant").appendChild(clone); 
        document.querySelector(".home-main-stats-variant").lastElementChild.firstElementChild.innerText = years.toFixed(2);
        document.querySelector(".home-main-stats-variant").lastElementChild.lastElementChild.innerText = "years";
    }, 3200);

    saveToChromeDB(rentEstimate, askingPrice, hoaCost, propertyTaxes, years.toFixed(2))
}

function saveToChromeDB(rentEstimate, askingPrice, hoaCost, propertyTaxes, years) {
    //give the parameters/dataload, will sync them to db.
    dataLoad = {years: years, rentEstimate: rentEstimate, propertyTaxes: propertyTaxes, hoaCost: hoaCost, askingPrice: askingPrice};
    chrome.storage.sync.set({key: dataLoad}, function() {
        console.log('Value of rent estimate is set to ' + dataLoad.rentEstimate);
      });
}


scraper();