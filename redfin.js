if (typeof basla === 'undefined') {
    var basla = function(){
        if (document.querySelector(".home-main-stats-variant")) {
            if (document.querySelector(".home-main-stats-variant").innerText.includes("ROI")) {
            } else {


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
                    var propertyTaxes = allContent.slice(allContent.search("Property Taxes")+15, allContent.search("Property Taxes")+20).split("/")[0].replace("$","").replace(",","");
                    console.log(propertyTaxes);
                } else if(allContent.search("Property taxes") > 0) {
                    console.log("lowercase t");
                    var propertyTaxes = allContent.slice(allContent.search("Property taxes")+15, allContent.search("Property taxes")+20).split("/")[0].replace("$","").replace(",","");
                    console.log(propertyTaxes);
                } else {
                        propertyTaxes = 0.0225 * askingPrice;
                };

                if(allContent.search("Monthly Rent") > 0) {
                var rentZestimate = allContent.slice(allContent.search("Monthly Rent")+14, allContent.search("Monthly Rent")+19).split("/")[0].replace("$","").replace(",","");
                console.log(rentZestimate);
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
                    document.querySelector(".home-main-stats-variant").appendChild(clone);
                    // alert("Asking price: $" + askingPrice + "\nHOA: $" + hoaCost + "\nProperty Taxes: $" + propertyTaxes + "\nRent Zestimate: $" + rentZestimate + "\nCalculated ROI: " + years.toFixed(2) + " years.");


                console.log("Hello");
                setTimeout(() => {  
                    document.querySelector(".home-main-stats-variant").appendChild(clone); 
                    document.querySelector(".home-main-stats-variant").lastElementChild.firstElementChild.innerText = years.toFixed(2);
                    document.querySelector(".home-main-stats-variant").lastElementChild.lastElementChild.innerText = "ROI (years)";
                
                
                }, 4000);
                    
                    chrome.runtime.sendMessage({name: "calculations", data: {years: years, rentZestimate: rentZestimate, propertyTaxes: propertyTaxes, hoaCost: hoaCost, askingPrice: askingPrice}}, (response) => {
                        console.log("calculations sent (redfin)");
                        // parseCoupons(response.data, domain);
                      });

                
                
                    
                    
                    
                    // chrome.runtime.sendMessage(years.toFixed(2));

                } else {
                    var clone = document.querySelector(".home-main-stats-variant").firstElementChild.cloneNode(true);
                    document.querySelector(".home-main-stats-variant").appendChild(clone);
                    // alert("Data required for ROI calculations is missing on this page. \nWe're currently working on next version which will allow you to manually enter values. \nStay tuned.");
                };    
            }   
        }
    }
}
 
basla();