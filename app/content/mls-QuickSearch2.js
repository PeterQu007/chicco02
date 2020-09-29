console.log("Quick Search!!!!");
var mlsTable = [];
// var tableInfo = {
//   todo: "readMLSTableInfo",
//   from: "mls-QuickSearch2.js",
// };
// chrome.runtime.sendMessage(tableInfo, function (response) {
//   console.log(response);
// });
var mlsContent = document.getElementById("jqMpCntlToolboxInfobox");
var mlsVeOverlay = document.getElementById('veOverlay');
var mlsDiv = mlsVeOverlay.firstElementChild;
var startMonitor = false;
var mlsBody = document.getElementsByTagName('body')[0];
var options = {
  root: document.getElementById('veOverlay'),
  threshold: 1.0
}
var options2 = {
  root: document.documentElement,
  threshold: 1.0
}

respondToVisibility = function (element, options, callback) {
  let _options = options;
  var observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      callback(entry.intersectionRatio > 0);
    });
  }, _options);

  observer.observe(element);
}

setTimeout(respondToVisibility(mlsDiv, options, visible => {
  if (visible) {
    console.log("Visible!");
    startMonitor = true;
  }
  else {
    console.log("Not Visible");
    if (startMonitor) {
      // start monitor context box
      mlsContent = document.getElementById("jqMpCntlToolboxInfobox");
      mlsPropertyInfo = document.getElementById('propertyInfo');
      let htmlButton = document.createElement('button');
      htmlButton.innerHTML = "Show More";
      htmlButton.onclick = function () {
        console.log('click me');
        let htmlMLSNo = document.getElementById('mlsNumLabelText');
        // get MLS No
        let htmlMLSNoSpan = htmlMLSNo.nextElementSibling;
        let mlsNo = htmlMLSNoSpan.firstElementChild.innerText;
        let elmTotalValue = $('<div><span>Total Value:</span><span id="mls-total-value"></span></div>');
        let htmlListingData = $('div.jqMpCntlDataScroll')[0];
        $(htmlListingData).append(elmTotalValue);
        var listInfo = {
          mlsNo: mlsNo,
          todo: "readMLSTableInfo",
          from: "mls-QuickSearch2.js",
        };
        chrome.runtime.sendMessage(listInfo, function (response) {
          console.log(response);
          let listingInfo = response;
          // show listing info:
          let htmlTotalValue = $('#mls-total-value');
          htmlTotalValue.text(listingInfo['totalValue']);
        });
      }
      mlsPropertyInfo.appendChild(htmlButton);

    }
  }
}), 500);

