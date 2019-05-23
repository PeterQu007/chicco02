//Targe Tab3//4/5_1_2 ML Default Spreadsheet View
//https://bcres.paragonrels.com/ParagonLS/Search/Property.mvc/Index/2/?savedSearchID=1781753&searchID=tab3_1

$(function() {
  //console.log("Search Bypass Criteria iFrame");

  var btnSearch = $("#Search");
  var keyword = $(
    "div#app_banner_links_left input.select2-search__field",
    top.document
  );
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
  keyword.val(powerSearchString);
  btnSearch.click();
});
