//logout iframe has the buttons inside the iframe
//no need to pass the message to defaultpage(Main Home Page content script)

$(function(){
        
    console.log("I want to log out...");
    
    //try to send the message to background
    chrome.runtime.sendMessage({todo: "logoutMLS"});

    //auto confirm logout
    $('#confirm').click();
    
})