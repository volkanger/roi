function scraper() {
    //scrapes the page for values
    var allContent = document.documentElement.innerText
    var askingPrice = parseInt(document.querySelector("span[data-testid='price']").innerText.replace("$", "").replace(",", ""))
    console.log('Asking price: $' + askingPrice)
    var hoaCost;
    var rentEstimate;
    if(allContent.search(" monthly HOA fee") > 0) {
        var hoaCost = allContent.slice(allContent.search(" monthly HOA fee")-6, allContent.search("HOA fees")-0).split("$")[1].replace(/\D/g, "")
        console.log('Monthly HOA: $' + hoaCost)
    } else if(allContent.search("HOA fees") > 0) {
        if(allContent.slice(allContent.search("HOA fees")+9, allContent.search("HOA fees")+19).includes("N/A")) {
        hoaCost = 0;    
        } else {
        var hoaCost = allContent.slice(allContent.search("HOA fees")+9, allContent.search("HOA fees")+19).split("/")[0].replace(/\D/g, "")
        console.log('HOA fees: $' + hoaCost)
        }
    } else {
        hoaCost = 0;
    }
   

    if(allContent.search("Property taxes") > 0) {
        var propertyTaxes = allContent.slice(allContent.search("Property taxes")+15, allContent.search("Property taxes")+25).split("/")[0].replace(/\D/g, "")
        console.log('Tax (found): $' + propertyTaxes)
    } else {
        var propertyTaxes = document.querySelector("#label-property-tax").innerText.split("$")[1].split("/")[0]
        console.log("parse asking " + parseInt(askingPrice))
        propertyTaxes = parseInt(askingPrice) * 1.12 / 12;
        console.log('Tax (calculated): $' + propertyTaxes)
    }

    
    if(allContent.search("Rent Zestimate") > 0) {
        rentEstimate = allContent.slice(allContent.search("Rent Zestimate")+16, allContent.search("Rent Zestimate")+25).split("/")[0].replace(/\D/g, "")
        console.log("rentEstimate $" + rentEstimate)
    }

    console.log("Asking:" + askingPrice + " rentEstimate:" + rentEstimate + " HOA:" + hoaCost + " Tax:" + propertyTaxes)
    
    if(rentEstimate === undefined) {
        grabOptions('rentEstimate', askingPrice, hoaCost, propertyTaxes)    
    } else {
        calcul(rentEstimate, askingPrice, hoaCost, propertyTaxes)
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
    if (!document.querySelector("span[data-testid='bed-bath-beyond']").innerText.includes("ROI")) {
        document.querySelector("span[data-testid='bed-bath-beyond']").append(" | ROI " + years.toFixed(2) + "yr");
    }
    saveToChromeDB(rentEstimate, askingPrice, hoaCost, propertyTaxes, years.toFixed(2))
}

function saveToChromeDB(rentEstimate, askingPrice, hoaCost, propertyTaxes, years) {
    //give the parameters/dataload, will sync them to db.
    dataLoad = {years: years, rentEstimate: rentEstimate, propertyTaxes: propertyTaxes, hoaCost: hoaCost, askingPrice: askingPrice};
    chrome.storage.sync.set({key: dataLoad}, function() {
        console.log('Value of rent estimate is set to ' + dataLoad.rentEstimate);
      });
}

setTimeout(() => {scraper()}, 3200);