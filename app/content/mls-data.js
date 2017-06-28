//mls-data.js : try to read the MLS data day by day
//download limit: <1500 records / time
//quick search feature is a iframe page

$(function() {

    // just place a div at top right
	var div = document.createElement('div');
	div.style.position = 'fixed';
	div.style.top = 0;
	div.style.right = 0;
	div.textContent = 'MLS List!';
	document.body.appendChild(div);

    //iframe loaded, trigger search event
    
    window.addEventListener ("load", myMain, false);

    function myMain (evt) {
        var jsInitChecktimer = setInterval (checkForJS_Finish, 100);

        function checkForJS_Finish () {
            if (document.querySelector ("#CountResult") ) {
                
                clearInterval (jsInitChecktimer);

                // DO YOUR STUFF HERE.
                $(function(){

                    var mlsDateLow =$("#f_33_Low__1-2-3-4");
                    var mlsDateHigh =$("#f_33_High__1-2-3-4");
                    
                    //function .blur() is used to trigger PARAGON to split the mls#s
                    mlsDateLow.focus().val("05/01/2017").blur();
                    mlsDateHigh.focus().val("05/02/2017").blur();

                    

                    //btn.click();
                
                })

                getCountResult();
            }
        };
    };

    //waiting the search result from Quick Search box
    function getCountResult() {

        var countTimer = setInterval (checkCount, 100);

        function checkCount () {
            //result is a text with commas, remove the commas
            var mlsCountResult =$("#CountResult").val().replace(',','');

            if (isInt(mlsCountResult)){

                clearInterval (countTimer);

                var btn = $("#Search");
            
                console.log("mls Date Search!");
                console.log(mlsCountResult);
                console.log($("#CountResult").val());
                // jump to detailed page view of the search results
                //btn.click();
            }

        }
        
    };

    //validate the Integer value
    function isInt(value){
            //value = value.trim();
            return !isNaN(value) &&
                parseInt(Number(value)) == value &&
                !isNaN(parseInt(value,10));
    };

    chrome.runtime.onMessage.addListener(function (msg, sender, response) {

        console.log("I am in mls-data.js");
        console.log("mls-data got msg: ", msg);
        response("mls-data got a message");
    })
   
});

