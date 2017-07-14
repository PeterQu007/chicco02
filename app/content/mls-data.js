// mls-data.js : try to read the MLS data day by day
// download limit: <1500 records / time
// quick search feature is a iframe page

$(function () {

    // just place a div at top right
    let div = document.createElement('div');
    div.style.position = 'fixed';
    div.style.top = 0;
    div.style.right = 0;
    div.textContent = 'MLS List!';
    document.body.appendChild(div);

    var strataPlanNumber, complexName, countResult;

    // iframe loaded, trigger search event

    window.addEventListener('load', myMain, false);

    function myMain(evt) {
        let jsInitChecktimer = setInterval(checkForJS_Finish, 100);

        function checkForJS_Finish() {
            if (document.querySelector('#CountResult')) {

                clearInterval(jsInitChecktimer);

                // DO YOUR STUFF HERE.
                $(function () {

                    let mlsDateLow = $('#f_33_Low__1-2-3-4');
                    let mlsDateHigh = $('#f_33_High__1-2-3-4');

                    // function .blur() is used to trigger PARAGON to split the mls#s
                    mlsDateLow.focus().val('05/01/2017').blur();
                    mlsDateHigh.focus().val('05/02/2017').blur();



                    // btn.click();

                });

                getCountResult(false, false);
            }
        };
    };

    // waiting the search result from Quick Search box
    function getCountResult(showResult, saveResult) {

        let countTimer = setInterval(checkCount, 100);

        function checkCount() {
            // result is a text with commas, remove the commas
            let mlsCountResult = $('#CountResult').val().replace(',', '');

            if (isInt(mlsCountResult)) {

                clearInterval(countTimer);

                countResult = mlsCountResult;
                let btn = $('#Search');

                console.log('mls Date Search!');
                console.log(mlsCountResult);
                console.log($('#CountResult').val());

                if (saveResult){
                    saveCountResult();
                }

                // jump to detailed page view of the search results
                if (showResult) {
                    btn.click();
                }
            }else{
                console.log('mls date searching ...', countTimer);
            }
        }
    };

    //save count result
    function saveCountResult() {

        var spSummary = {
            _id: strataPlanNumber + '-' + getToday(),
            strataPlan: strataPlanNumber,
            name: complexName,
            searchDate: getToday(),
            count: countResult,
            active: 'todo',
            sold: 'todo',
            from: 'strataPlanSummary' + Math.random().toFixed(8)
        }

        chrome.storage.sync.set(spSummary);
        console.log('mls-data wrap up the complex data: ', spSummary);
        chrome.runtime.sendMessage({ 'todo': 'saveStrataPlanSummary', 'spSummaryData': spSummary });
    }

    // validate the Integer value
    function isInt(value) {
        // value = value.trim();
        return !isNaN(value) &&
            parseInt(Number(value)) == value &&
            !isNaN(parseInt(value, 10));
    };

    function formatDate(date) {


        let dd = date.getDate();
        let mm = date.getMonth() + 1; // January is 0!

        let yyyy = date.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        var date = mm + '/' + dd + '/' + yyyy;
        return date;

    };

    function getToday() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();

        if (dd < 10) {
            dd = '0' + dd
        }

        if (mm < 10) {
            mm = '0' + mm
        }

        today = yyyy + mm + dd;
        return today;
    };

    chrome.runtime.onMessage.addListener(function (msg, sender, response) {

        console.log('mls-data got message: ', msg);

        if (msg.todo != 'switchTab' && msg.todo != 'searchComplex' ) {
            return;
        };

        console.log('I am in mls-data.js');
        console.log('mls-data got msg: ', msg);
        response('mls-data got a message');

        let mlsDateLow = $('#f_33_Low__1-2-3-4');
        let mlsDateHigh = $('#f_33_High__1-2-3-4');
        let strataPlan = $('#f_41__1-2-3-4');
        let strataPlanHidden = $('#hdnf_41__1-2-3-4');
        let liStrataPlan = $('div[rel="f_41__1-2-3-4"] ul li.acfb-data');
        let today = new Date();
        let day60 = new Date();
        day60.setDate(today.getDate() - 60);

        // function .blur() is used to trigger PARAGON to split the mls#s
        liStrataPlan.remove();
        strataPlanHidden.val('');
        mlsDateLow.focus().val('').blur();
        mlsDateHigh.focus().val('').blur();
        strataPlan.focus().val('').blur();

        chrome.storage.sync.get(['strataPlan1', 'strataPlan2', 'strataPlan3', 'strataPlan4', 'complexName'], function (listing) {

            mlsDateLow.focus().val(formatDate(day60)).blur();
            mlsDateHigh.focus().val(formatDate(today)).blur();
            let strataPlans = listing.strataPlan1 + ',' + listing.strataPlan2 + ',' + listing.strataPlan3 + ',' + listing.strataPlan4 + ',';
            strataPlan.focus().val(strataPlans).blur();
            strataPlanNumber = listing.strataPlan1;
            complexName = listing.complexName;
            getCountResult(msg.showResult, msg.saveResult);

        });

    });

});

