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

                getCountResult(false);
            }
        };
    };

    //waiting the search result from Quick Search box
    function getCountResult(doSearch) {

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
                if(doSearch){
                    btn.click();

                }
                
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

    function formatDate(date){

        
        var dd = date.getDate();
        var mm = date.getMonth()+1; //January is 0!

        var yyyy = date.getFullYear();
        if(dd<10){
            dd='0'+dd;
        } 
        if(mm<10){
            mm='0'+mm;
        } 
        var date = mm+'/'+dd+'/'+yyyy;
        return date;

    };

    chrome.runtime.onMessage.addListener(function (msg, sender, response) {

        console.log("mls-data got message: " , msg);

        if (msg.todo != 'switchTab') {return };

        console.log("I am in mls-data.js");
        console.log("mls-data got msg: ", msg);
        response("mls-data got a message");

        var mlsDateLow =$("#f_33_Low__1-2-3-4");
        var mlsDateHigh =$("#f_33_High__1-2-3-4");
        var strataPlan = $("#f_41__1-2-3-4");
        var strataPlanHidden = $("#hdnf_41__1-2-3-4");
        var liStrataPlan = $('div[rel="f_41__1-2-3-4"] ul li.acfb-data');
        var today = new Date();
        var day60 = new Date();
        day60.setDate(today.getDate() - 60);

        //function .blur() is used to trigger PARAGON to split the mls#s
        liStrataPlan.remove();
        strataPlanHidden.val('');
        mlsDateLow.focus().val("").blur();
        mlsDateHigh.focus().val("").blur();
        strataPlan.focus().val("").blur();

        chrome.storage.sync.get(['strataPlan1','strataPlan2','strataPlan3','strataPlan4'], function(listing){

            mlsDateLow.focus().val(formatDate(day60)).blur();
            mlsDateHigh.focus().val(formatDate(today)).blur();
            var strataPlans = listing.strataPlan1 + ',' + listing.strataPlan2 + ',' + listing.strataPlan3 + ',' + listing.strataPlan4 + ','
            strataPlan.focus().val(strataPlans).blur();
            getCountResult(false);

        })
    
    })
   
});

