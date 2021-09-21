//Targe Tab3//4/5_1_2 ML Default Spreadsheet View
//https://bcres.paragonrels.com/ParagonLS/Search/Property.mvc/Index/2/?savedSearchID=1781753&searchID=tab3_1
window.g_urlCountAction = '/ParagonLS/Search/Property.mvc/Count/0';


(function (elementExample, Object, window) {

  function createIDLSetWrapper(key, nativeSet, nativeGet) {
    return function (newValue) {
      var oldValue = this.getAttribute(key);
      nativeSet.call(this, newValue); // natively update the value

      if (this.getAttribute(key) === oldValue) {
        // ensure that an attribute is updated so that mutation observers are fired
        this.setAttribute(key, nativeGet.call(this));
      }
    };
  }

  var ownProps = Object.getOwnPropertyNames(window);
  for (var i = 0, len = ownProps.length | 0, key; i < len; i = i + 1 | 0) {
    key = ownProps[i];
    if (/^HTMLInputElement$/.test(key) && window.hasOwnProperty(key) && !window.propertyIsEnumerable(key) && typeof window[key] === "function")(function () {
      var oldDescriptors = Object.getOwnPropertyDescriptors(window[key].prototype);
      var keys = Object.keys(oldDescriptors);
      var newDescriptors = {};
      console.log(keys);

      for (var i = 0, len = keys.length | 0, prop, description; i < len; i = i + 1 | 0) {
        prop = keys[i];
        description = oldDescriptors[prop];
        if (
          prop !== "nonce" && // supposed to be secret and hidden from CSS
          (!prop.startsWith("on") || elementExample[prop] !== null) && // screen out event listeners
          typeof description.set === "function" && // ensure that this property has a descriptor
          description.set.toString().indexOf("[native code]") !== -1 // ensure that we have not already processed to this element
        ) newDescriptors[prop] = {
          configurable: true,
          enumerable: true,
          get: description.get, // do not modify the original getter
          set: createIDLSetWrapper(prop, description.set, description.get)
        };
      }

      // Finally apply the wrappers
      Object.defineProperties(window[key].prototype, newDescriptors);
    })();
  }

})(document.firstElementChild, Object, window);

$(function () {
  //console.log("Search Bypass Criteria iFrame");

  var btnSearch = $("#Search");
  var btnCount = $("#Count");
  var inputCountResult = $("#CountResult");
  var divCountSearch = $("#CountSearch");

  //remove inputCountResult ReadOnly Attr
  inputCountResult.removeAttr('readonly');
  inputCountResult.attr('value', 'Counting...');

  //off btnCount click event listener
  btnCount.off('click');
  $(document).off('click', '#Count');

  var btnSaveCriteria = $(
    `<button id="mls_helper_save_criteria">Save</button>`
  );
  var btnNextCriteria = $(
    `<button id="mls_helper_next_criteria">Next</button>`
  );
  var btnFirstCriteria = $(
    `<button id="mls_helper_first_criteria">First</button>`
  );
  var btnPriceDistributionCurve = $(
    `<button id="mls_helper_price_curve">Curve</button>`
  );
  var keyword = $(
    "div#app_banner_links_left input.select2-search__field",
    top.document
  );
  var divContainer = $("div.f-cs-link")[0];
  $(divContainer).append(btnSaveCriteria);
  $(divContainer).append(btnFirstCriteria);
  $(divContainer).append(btnNextCriteria);
  $(divContainer).append(btnPriceDistributionCurve);

  var publicRemarkKeywords = $("ul.f_551")
    .children("li")
    .children(0)
    .children("span");
  var i = 0;
  var powerSearchString = "";
  for (i = 0; i < publicRemarkKeywords.length; i++) {
    powerSearchString =
      powerSearchString +
      (i == 0 ? "" : ",") +
      publicRemarkKeywords[i].textContent;
  }
  // keyword.val(powerSearchString);
  $("#mls_helper_save_criteria").click((e) => {
    console.log("clicked");
    let criteriaTable = $("table.f-cs-items")[0];
    let criteriaRows = criteriaTable.querySelectorAll("tr");
    let criteriaRules = [];
    let criteriaRule = {};
    // Loop criteria rules, save to array criteriaRules
    criteriaRows.forEach((row) => {
      let criteriaCells = row.querySelectorAll("td");
      criteriaRule.item = criteriaCells[0].innerText;
      criteriaRule.value = criteriaCells[1].innerText;
      criteriaRules.push({
        ...criteriaRule,
      });
      criteriaRule = {};
    });

    let elementCMAID = $("#SubjectProperty option:selected", top.document);
    let cmaID = elementCMAID.text();
    let cmaIDStartPosition = cmaID.indexOf("[") + 1;
    let cmaIDEndPosition = cmaID.indexOf("]");
    let cmaIDNumber = parseInt(
      cmaID.substring(cmaIDStartPosition, cmaIDEndPosition)
    );

    let urlLocationOptionLocal = $("#pid_local", top.document);
    let urlLocation = urlLocationOptionLocal.prop("checked");
    let ajax_url = "";

    if (urlLocation) {
      ajax_url =
        "http://localhost/pidrealty4/wp-content/themes/Realhomes-child-3/db/dbAddCMACriteria.php";
      ajax_url =
        "http://pidrealty4.local/wp-content/themes/Realhomes-child-3/db/dbAddCMACriteria.php";
    } else {
      ajax_url =
        "https://pidhomes.ca/wp-content/themes/realhomes-child-3/db/dbAddCMACriteria.php";
    }

    $.ajax({
      url: ajax_url,
      method: "post",
      data: {
        criteria_rules: criteriaRules,
        cma_id: cmaIDNumber,
      },
      success: function (res) {
        console.log("res::", JSON.stringify(res));
      },
    });
  });

  $("#mls_helper_first_criteria").on("click", async (e) => {
    console.log(e);
    console.log('first clicked');
    let highPrice = $("#f_5_High__1-2-3-4-5");
    let lowPrice = $("#f_5_Low__1-2-3-4-5");
    let lowPrice2 = $("#f_5_Low_1__1-2-3-4-5");
    let lowPriceInitial = 30;
    let highPriceInitial = 500;
    lowPrice.val(lowPriceInitial);
    highPrice.val(highPriceInitial);
    lowPrice2.val(1);
    // $(".CountResultText").val("Counting...");
    console.log('Start Count Loop:');
    let iCount = 0;
    do {
      console.group();
      if (iCount <= 1300) {
        highPriceInitial += 100;
      }
      if (iCount >= 1500) {
        highPriceInitial -= 50;
      }
      highPrice.val(highPriceInitial);
      console.log("High Price: ", highPriceInitial);
      iCount = await $.focusFx.searchFormCount();
      iCount = parseInt(iCount);
      console.log("Count: ", iCount);
      console.groupEnd();
    } while (iCount <= 1300 || iCount >= 1500)

    $(".CountBtn").removeAttr('disable');
    $('.SearchBtn').removeAttr('disable');
    console.log(inputCountResult.val());
    console.log(iCount);
    inputCountResult.focus();

  }); //mls_helper_first_criteria

  $("#mls_helper_next_criteria").on("click", async (e) => {
    console.log(e);
    console.log('next clicked');
    let highPrice = $("#f_5_High__1-2-3-4-5");
    let lowPrice = $("#f_5_Low__1-2-3-4-5");
    lowPrice.val(highPrice.val());
    let newHighPrice;
    let iCount = 0,
      iCountOld = 0;
    let iLoop = 0;
    do {
      iLoop++;
      console.group();
      if (iCount <= 1300) {
        if (iLoop < 6) {
          newHighPrice = parseInt(parseInt(highPrice.val()) * 1.1);
        } else {
          newHighPrice = 9999999;
        }
      }
      if (iCount >= 1500) {
        newHighPrice = parseInt(parseInt(highPrice.val()) * 0.95);
      }
      highPrice.val(newHighPrice);
      console.log("New High Price: ", newHighPrice);
      iCountOld = iCount;
      iCount = await $.focusFx.searchFormCount();
      iCount = parseInt(iCount);
      console.log("Count: ", iCount);
      console.groupEnd();
    } while (iLoop <= 6 && (iCount <= 1300 || iCount >= 1500))

    $(".CountBtn").removeAttr('disable');
    $('.SearchBtn').removeAttr('disable');
    console.log(inputCountResult.val());
    console.log(iCount);
    inputCountResult.focus();
  }); //id: mls_helper_next_criteria

  $("#mls_helper_price_curve").on("click", async (e) => {
    console.log('curve clicked');
    let highPrice = $("#f_5_High__1-2-3-4-5");
    let lowPrice = $("#f_5_Low__1-2-3-4-5");
    let lowPrice2 = $("#f_5_Low_1__1-2-3-4-5");
    lowPrice2.val('001');
    let newHighPrice;
    let iCount = 0;
    let iLoop = 0;
    let curve = {
      priceRange: [0],
      listingCount: [0]
    };
    console.group();
    // Scatter Curve
    // do {
    //   iLoop++;
    //   newHighPrice = parseInt(parseInt(highPrice.val()) + 200);
    //   highPrice.val(newHighPrice);
    //   iCount = await $.focusFx.searchFormCount();
    //   iCount = parseInt(iCount);
    //   curve.priceRange.push(newHighPrice);
    //   curve.listingCount.push(iCount);
    //   console.log("Price Point: ", newHighPrice);
    //   console.log("Listing Count: ", iCount);
    // } while (iLoop <= 100)
    // Distribution Curve
    do {
      iLoop++;
      lowPrice.val(highPrice.val());
      newHighPrice = parseInt(parseInt(highPrice.val()) + 200);
      highPrice.val(newHighPrice);
      iCount = await $.focusFx.searchFormCount();
      iCount = parseInt(iCount);
      curve.priceRange.push(newHighPrice);
      curve.listingCount.push(iCount);
      console.log("Price Point: ", newHighPrice);
      console.log("Listing Count: ", iCount);
    } while (iLoop <= 100)
    console.groupEnd();
    $(".CountBtn").removeAttr('disable');
    $('.SearchBtn').removeAttr('disable');
    console.log('Price Distribution Curve: ', curve);
  }); //id: mls_helper_next_criteria


  $(".CountResultText").bind("input propertychange", (e) => {
    console.log('CountResult Changed');
  });

  // $("#CountResult").on("change", () => {
  //   console.log('input result changed');
  // });

  // divCountSearch.on("change", () => {
  //   console.log("count search changed!");
  // });

  // Select the node that will be observed for mutations
  // const targetNode = document.getElementById('CountResult');
  const targetNode = document.querySelector(".CountResultText");

  // Options for the observer (which mutations to observe)
  const config = {
    attributes: true,
    characterData: true,
    characterDataOldValue: true,
    childList: true,
    subtree: true,
    attributeOldValue: true
  };

  // Callback function to execute when mutations are observed
  const callback = function (mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        console.log('A child node has been added or removed.');
      } else if (mutation.type === 'attributes') {
        console.log('The ' + mutation.attributeName + ' attribute was modified.');
        console.log('The oldValue is ' + mutation.oldValue);
        console.log($('#CountResult').val());
        let iCount = parseInt($('#CountResult').val());

      }
    }
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);

  // Later, you can stop observing
  // observer.disconnect();

  // inputCountResult.val('Counting...');

  // Click Search Button, jump to search results
  // btnSearch.click();
});