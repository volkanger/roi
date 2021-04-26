if (typeof basla === 'undefined') {
    var basla = function(){
        if (document.querySelector(".ds-bed-bath-living-area-container").innerText.includes("ROI")) {

        } else {

            var allContent = document.documentElement.innerText
            var askingPrice = document.querySelector("span > span > span").innerText.replace("$", "").replace(",", "");
            var hoaCost;
            /*if (window.find("HOA")) {
            var hoaCost = document.querySelector("#details-page-container > div > div > div.layout-wrapper > div.layout-container > div.data-column-container > div.data-view-container > div > div > div > ul > li:nth-child(10) > div > div.ds-expandable-card-section-default-padding > div > div > div:nth-child(5) > div > div > div > div > span:nth-child(2)").innerText.replace("$","").replace("/mo","").replace(",","");
            }

            if (window.find("Rent Zestimate")) {
            var rentEstimate = document.querySelectorAll("h4")[9].parentElement.children[1].innerText.slice(17,30).replace("/mo","").replace(",","");
            }*/

            if(allContent.search("HOA fees") > 0) {
                if(allContent.slice(allContent.search("HOA fees")+9, allContent.search("HOA fees")+19).includes("N/A")) {
                hoaCost = 0;    
                } else {
                var hoaCost = allContent.slice(allContent.search("HOA fees")+9, allContent.search("HOA fees")+19).split("/")[0].replace("$","").replace(",","")
                }
            } else {
                hoaCost = 0;
            }

            if(allContent.search("Property taxes") > 0) {
            var propertyTaxes = allContent.slice(allContent.search("Property taxes")+15, allContent.search("Property taxes")+25).split("/")[0].replace("$","").replace(",","")
            } else {
                propertyTaxes = 0.0225 * askingPrice;
            }

            if(allContent.search("Rent Zestimate") > 0) {
            var rentZestimate = allContent.slice(allContent.search("Rent Zestimate")+16, allContent.search("Rent Zestimate")+25).split("/")[0].replace("$","").replace(",","")
            }


            //var hoaSpot = document.querySelectorAll("h4")[6].parentElement.children[1].innerText.search("HOA");
            //var hoaCost = document.querySelectorAll("h4")[6].parentElement.children[1].innerText.slice(hoaSpot+6, hoaSpot+10)
            
            var years = askingPrice / ((rentZestimate - hoaCost - propertyTaxes) * 12);
            
            if(rentZestimate > 0) {
                document.querySelector(".ds-bed-bath-living-area-container").append(" | ROI " + years.toFixed(2) + "yr");
                // alert("Asking price: $" + askingPrice + "\nHOA: $" + hoaCost + "\nProperty Taxes: $" + propertyTaxes + "\nRent Zestimate: $" + rentZestimate + "\nCalculated ROI: " + years.toFixed(2) + " years.");
            } else {
                document.querySelector(".ds-bed-bath-living-area-container").append(" | ROI: N/A");
                // alert("Data required for ROI calculations is missing on this page. \nWe're currently working on next version which will allow you to manually enter values. \nStay tuned.");
            };    
        }   
    }
}
 
basla();