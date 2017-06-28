//works with Paragon's main window
//the messages are passed between the defaultpage and iframes, all are the contect sripts

chrome.extension.onMessage.addListener(function(request, sender, sendResponse){

    //get Warning message: the search results exceed the limit, ignore it
    if(request.todo == "ignoreWarning"){
        
        //Warning Form is a special page, the buttons are in the div, 
        //the iframe is separate with the buttons
        //this message sent from mls-warning.js
        console.log("Main Home ignore warning message!");
        console.log($('#OK'));

        var countTimer = setInterval (checkCount, 100);

        function checkCount() {
            //#OK button, "Continue", belongs to default page
            if(document.querySelector ("#OK")){

                clearInterval (countTimer);
                var btnOK = $('#OK');
                console.log("OK",btnOK);
                btnOK.click();
            }
        };

    };

    //Logout MLS Windows shows an annoying confirm box, pass it
    //The message sent from logout iframe , the buttons are inside the iframe
    if(request.todo == "logoutMLS"){

        console.log("Main Home got logout message!");
        console.log($('#confirm'));
 
        var countTimer = setInterval (checkCount, 100);

        function checkCount() {
            //the button is inside the iframe, this iframe belongs to default page
            if(document.querySelector ("#confirm")){

                clearInterval (countTimer);
                var btnYes = $('#confirm');
                console.log("confirm",btnYes);
                btnYes.click();
            }
        };

    };
});