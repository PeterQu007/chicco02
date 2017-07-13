// iframe sent message to background
// background will send the message back to main content page: defaultpage

$(function() {

    console.log('Send out message...');

    // the message will send to background
    chrome.runtime.sendMessage({todo: 'warningMessage'});

});
