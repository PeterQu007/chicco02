//Targe Tab3//4/5_1_2 ML Default Spreadsheet View
//https://bcres.paragonrels.com/ParagonLS/Search/Property.mvc/Index/2/?savedSearchID=1781753&searchID=tab3_1

$(function () {
  //console.log("Search Bypass Criteria iFrame");

  var btnSearch = $("#Search");
  var btnSaveCriteria = $(
    `<button id="mls_helper_save_criteria">Save</button>`
  );
  var keyword = $(
    "div#app_banner_links_left input.select2-search__field",
    top.document
  );
  var divContainer = $("div.f-cs-link")[0];
  $(divContainer).append(btnSaveCriteria);

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

  // Click Search Button, jump to search results
  btnSearch.click();
});
