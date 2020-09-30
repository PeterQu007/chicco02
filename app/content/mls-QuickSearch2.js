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
      let mlsPropertyInfo = document.getElementById('propertyInfo');
      let elmArea = $('<div><span class="jqMpCntlInfoxboxLabel">Area:</span><span id="mls-area"></span></div>');
      let elmCDOM = $('<div><span class="jqMpCntlInfoxboxLabel">CDOM:</span><span id="mls-cdom"></span></div>');
      let elmFlrTotFin = $('<div><span class="jqMpCntlInfoxboxLabel">Total Finished:</span><span id="mls-flrtotfin"></span></div>');
      let elmFrontage = $('<div><span class="jqMpCntlInfoxboxLabel">Frontage:</span><span id="mls-frontage"></span></div>');
      let elmFloodPlain = $('<div><span class="jqMpCntlInfoxboxLabel">Flood Plain:</span><span id="mls-flood-plain"></span></div>');
      let elmListDate = $('<div><span class="jqMpCntlInfoxboxLabel">List Date:</span><span id="mls-list-date"></span></div>');
      let elmLotSize = $('<div><span class="jqMpCntlInfoxboxLabel">Lot Size /Frontage:</span><span id="mls-lot-size"></span></div>');
      let elmPriceSqFt = $('<div><span class="jqMpCntlInfoxboxLabel">Price SqFt:</span><span id="mls-price-sqft"></span></div>');
      let elmSubArea = $('<div><span class="jqMpCntlInfoxboxLabel">Sub Area:</span><span id="mls-sub-area"></span></div>')
      let elmStyleOfHome = $('<div><span class="jqMpCntlInfoxboxLabel">Style of Home:</span><span id="mls-style-of-home"></span></div>');
      let elmTotFlArea = $('<div><span class="jqMpCntlInfoxboxLabel">Total Floor Area:</span><span id="mls-total-floor-area"></span></div>');
      let elmTotalBed = $('<div><span class="jqMpCntlInfoxboxLabel">Tot Bed/Bath:</span><span id="mls-total-bed"></span></div>');
      let elmTotalBath = $('<div><span class="jqMpCntlInfoxboxLabel">Total Bath:</span><span id="mls-total-bath"></span></div>');
      let elmHr = $('<hr class="mls-hr">');
      let elmYearBuilt = $('<div><span class="jqMpCntlInfoxboxLabel">Year built:</span><span id="mls-year-built"></span></div>');
      let elmBCAImprove = $('<div><span class="jqMpCntlInfoxboxLabel">Improve/Land:</span><span id="mls-bca-improve-value"></span></div>');
      let elmBCALand = $('<div><span class="jqMpCntlInfoxboxLabel">BCA Land:</span><span id="mls-bca-land-value"></span></div>');
      let elmTotalValue = $('<div><span class="jqMpCntlInfoxboxLabel">BCA Total:</span><span id="mls-bca-total-value"></span></div>');
      let elmBCAChange = $('<div><span class="jqMpCntlInfoxboxLabel">BCA Change:</span><span id="mls-bca-change"></span></div>');
      let elmMLSNO = $('<div><span class="jqMpCntlInfoxboxLabel">MLS NO#:</span><span id="mls-mls-no"></span></div>');

      let htmlListingData = $('div.jqMpCntlDataScroll')[0];
      let htmlArea = document.getElementById('mls-area');
      if (!htmlArea) {
        $(htmlListingData).append(elmArea);
        $(htmlListingData).append(elmSubArea);
        $(htmlListingData).append(elmFloodPlain);
        $(htmlListingData).append(elmStyleOfHome);
        $(htmlListingData).append(elmListDate);
        $(htmlListingData).append(elmHr);
        // $(htmlListingData).append(elmCDOM);
        $(htmlListingData).append(elmLotSize);
        // $(htmlListingData).append(elmFrontage);
        $(htmlListingData).append(elmPriceSqFt);
        $(htmlListingData).append(elmTotFlArea);
        $(htmlListingData).append(elmFlrTotFin);
        $(htmlListingData).append(elmTotalBed);
        // $(htmlListingData).append(elmTotalBath);
        $(htmlListingData).append(elmYearBuilt);
        $(htmlListingData).append(elmHr);
        $(htmlListingData).append(elmBCAImprove);
        // $(htmlListingData).append(elmBCALand);
        $(htmlListingData).append(elmTotalValue);
        $(htmlListingData).append(elmBCAChange);
        $(htmlListingData).append(elmMLSNO);
      }

      let htmlButton = document.createElement('button');
      htmlButton.innerHTML = "Show More";
      htmlButton.onclick = function () {
        console.log('click me');
        let htmlMLSNo = document.getElementById('mlsNumLabelText');
        // get MLS No
        let htmlMLSNoSpan = htmlMLSNo.nextElementSibling;
        let mlsNo = htmlMLSNoSpan.firstElementChild.innerText;

        // watch mls # when changed
        // select the target node
        var target = document.getElementsByClassName('jqMpCntlDetailLink')[0];
        // create an observer instance
        var observer = new MutationObserver(function (mutations) {
          console.log($('.jqMpCntlDetailLink').text());
          let htmlMLSNo = document.getElementById('mlsNumLabelText');
          // get MLS No
          let htmlMLSNoSpan = htmlMLSNo.nextElementSibling;
          let mlsNo = htmlMLSNoSpan.firstElementChild.innerText;

          getListingData(mlsNo);

        });
        var config = { attributes: true, childList: true, characterData: true, subtree: true };
        // pass in the target node, as well as the observer options
        observer.observe(target, config);
        getListingData(mlsNo);
      }

      mlsPropertyInfo.appendChild(htmlButton);

      // let htmlImgs = $('#divMap Img');
      // htmlImgs.click((img) => {
      //   $(img).addClass('map-image-border');
      // })

      $('body').on('click', 'img', function (e) {
        // alert('it works');
        // Search divMap , search z-index = 106 to get to the img element
        let htmlDiv = $(e.target).parent();
        let htmlDivAttributeTitle = htmlDiv.attr('title');
        let markTextPattern = /(?=.)^\$?(([1-9][0-9]{0,2}(,[0-9]{3})*)|0)?(\.[0-9]{1,2})?k/i;
        let markTextPattern2 = /(?=.)^\$?(([1-9][0-9]{0,2}(,[0-9]{3})*)|0)?(\.[0-9]{1,2})?$/;
        let htmlAllDivs = $('#divMap div').filter(function () {
          return $(this).text().toLowerCase().match(markTextPattern) || $(this).text().toLowerCase().match(markTextPattern2);
        });
        //remove all underlines
        htmlAllDivs.removeClass('mls-color-red-2');
        let htmlDivs = $('#divMap div').filter(function () { return $(this).text().toLowerCase() === htmlDivAttributeTitle.toLowerCase(); })
        htmlDivs.addClass('mls-color-red-2');
      })

      let markTextPattern = /(?=.)^\$?(([1-9][0-9]{0,2}(,[0-9]{3})*)|0)?(\.[0-9]{1,2})?k/i;
      let markTextPattern2 = /(?=.)^\$?(([1-9][0-9]{0,2}(,[0-9]{3})*)|0)?(\.[0-9]{1,2})?$/;
      // let htmlNumberDivs = $('#divMap div').filter(function () {
      //   return $(this).text().toLowerCase().match(markTextPattern2);
      // });
      $('body').on('click', 'div', function (e) {
        let numberDiv = $(e.target);
        console.log(numberDiv.text());
        if (numberDiv.text().match(markTextPattern) || numberDiv.text().match(markTextPattern2)) {
          let allDivs = $('#divMap div');
          allDivs.removeClass('mls-color-red');
          numberDiv.addClass('mls-color-red');
        }
      })
    }
  }
}), 500);

getListingData = function (mlsNo) {
  var listInfo = {
    mlsNo: mlsNo,
    todo: "readMLSTableInfo",
    from: "mls-QuickSearch2.js",
  };
  chrome.runtime.sendMessage(listInfo, function (response) {
    console.log(response);
    let listingInfo = response;
    // show listing info:

    let htmlArea = $('#mls-area');
    let htmlCDOM = $('#mls-cdom');
    let htmlFlrTotFin = $('#mls-flrtotfin');
    let htmlFrontage = $('#mls-frontage');
    let htmlFloodPlain = $('#mls-flood-plain');
    let htmlListDate = $('#mls-list-date');
    let htmlLotSize = $('#mls-lot-size');
    let htmlPriceSqFt = $('#mls-price-sqft');
    let htmlSubArea = $('#mls-sub-area')
    let htmlStyleOfHome = $('#mls-style-of-home');
    let htmlTotFlArea = $('#mls-total-floor-area');
    let htmlTotalBed = $('#mls-total-bed');
    let htmlTotalBath = $('#mls-total-bath');
    let htmlYearBuilt = $('#mls-year-built');
    let htmlBCAImprove = $('#mls-bca-improve-value');
    let htmlBCALand = $('#mls-bca-land-value');
    let htmlTotalValue = $('#mls-bca-total-value');
    let htmlBCAChange = $('#mls-bca-change');
    let htmlMLSNO = $('#mls-mls-no');

    htmlArea.text(listingInfo['Area'] + ' | ' + listingInfo['S/A']);
    htmlSubArea.text(listingInfo['S/A'])
    htmlFlrTotFin.text(listingInfo['FlArTotFin']);
    htmlFloodPlain.text(listingInfo['Flood Plain']);
    htmlListDate.text(listingInfo['List Date'] + ' [ ' + listingInfo['CDOM'] + ' ]');
    // htmlCDOM.text(listingInfo['CDOM']);
    htmlLotSize.text(listingInfo['Lot Sz (Sq.Ft.)'] + ' [ ' + listingInfo['Frontage - Feet'] + ' ]');
    // htmlFrontage.text(listingInfo['Frontage - Feet']);
    htmlPriceSqFt.text(listingInfo['PrcSqft']);
    htmlStyleOfHome.text(listingInfo['Style of Home']);
    htmlTotFlArea.text(listingInfo['TotFlArea']);
    htmlTotalBed.text(listingInfo['Tot BR'] + ' | ' + listingInfo['Tot Baths']);
    // htmlTotalBath.text(listingInfo['Tot Baths']);
    htmlYearBuilt.text(listingInfo['Yr Blt']);
    htmlBCAImprove.text(listingInfo['imprvValue'] + ' | ' + listingInfo['landValue']);
    // htmlBCALand.text(listingInfo['landValue']);
    htmlTotalValue.text(listingInfo['totalValue']);
    htmlBCAChange.text(listingInfo['change%']);
    htmlMLSNO.text(listingInfo['ML #']);
  });
}

