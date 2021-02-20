//define the paragon mls Main Menu Class
//store the frequently used menu function links in the class

export default class MainMenu {
  constructor() {
    this.appBanner = $("#app_banner");
    this.appLeftBanner = $("#app_banner_links_left");
    this.appRightBanner = $("#app_banner_links_right");
    this.appMidBanner = $('<div id = "app_banner_mid"></div>');
    this.appMainMenu = $("#app_banner_menu");

    //Add Subject Loading form

    this.formLoadSubject = $(
      `<form class="languagebox" name='pid_load_subjects' style="display:block"></form>`
    );

    //Add Subject Load Button
    this.btnSubjectProperty = $(`<div class="languagebox"> 
                  <input type = "button" id="SubjectPropertySubmit" value="LoadSubject">
                  </div>`);
    this.formLoadSubject.append(this.btnSubjectProperty);

    //insert remote/local radio
    this.radioSubjectLoadingLink = $(`<div class = "languagebox">
        <input type="radio" class = "pid_subject_property_options" id='pid_local' name="LoadSubjects" value="local" checked='checked' />
        <label for='pid_local'>Local&nbsp</label>
        <input type="radio" class = "pid_subject_property_options" id='pid_remote; ?>' name="LoadSubjects" value="remote" />
        <label for='pid_remote'>Remote&nbsp</label>
      </div>`);
    this.formLoadSubject.append(this.radioSubjectLoadingLink);

    //insert Subject Setting Button
    this.selectSubjectProperty = $(`<div class="languagebox">
                                <select id="SubjectProperty" name="SubjectProperty" >
                                <option value = "205">205<option>
                                <option value = "805">805<option>
                                </select>
                                </div>`);
    this.formLoadSubject.append(this.selectSubjectProperty);
    // this.selectSubjectProperty.insertAfter(this.appLeftBanner);
    this.txtSubjectAddress = document.getElementById("SubjectProperty");

    //insert update current subject checkbox
    this.chkUpdateSubject = $(`<div class="languagebox">
                                <div id="checkUpdateSubjectInfoWrapper">
                                    <label>Update Sub</label>
                                    <input id="checkUpdateSubjectInfo" name="buttonUpdate" type = "checkbox" style="width: 14px!important"/>
                                </div>
                            </div>`);
    this.formLoadSubject.append(this.chkUpdateSubject);

    //insert CMA/VPR options
    this.selectCMAType = $(`<div class="languagebox">
                                <select id="SelectCMAType" name="SelectCMAType" >
                                <option value = "CMA">CMA<option>
                                <option value = "VPR">VPR<option>
                                <option value = "CMA4Exl">CMA4Exl<option>
                                </select>
                                </div>`);
    this.formLoadSubject.append(this.selectCMAType);

    //insert form to the banner
    this.formLoadSubject.insertAfter(this.appLeftBanner);
    this.subjectPropertyOptions = document.getElementsByClassName(
      "pid_subject_property_options"
    );
    this.btnLoadSubject = document.getElementById("SubjectPropertySubmit");

    //lock the map size
    (this.chkShowSmallMap = $(`<div class="languagebox">
                                <div id="checkShowSmallMapWrapper">
                                    <label>Lock Map Size</label>
                                    <input id="checkShowSmallMap" name="buttonShowPic" type = "checkbox" style="width: 14px!important"/>
                                </div>
                            </div>`)),
      this.chkShowSmallMap.insertAfter(this.appLeftBanner);

    //lock the map type
    (this.chkLockRoadMapType = $(`<div class="languagebox">
                                <div id="checkLockMapTypeWrapper">
                                    <label>Lock Road Map Type</label>
                                    <input id="checkLockRoadMap" name="buttonShowMaptype" type = "checkbox" style="width: 14px!important"/>
                                </div>
                            </div>`)),
      this.chkLockRoadMapType.insertAfter(this.appLeftBanner);

    (this.txtResponse = $(`<div class="languagebox">
                                <div id="textResponse">
                                    <label>res</label>
                                    <input id="inputListingInfo" type="text" name="textbox" style="width: 150px!important" />
                                </div>
                            </div>`)),
      this.txtResponse.insertAfter(this.appLeftBanner);

    (this.chkLanguage = $(`<div class="languagebox">
                                <div id="reportlanguage">
                                    <label>cn</label>
                                    <input type="checkbox" name="checkbox" style="width: 14px!important" />
                                </div>
                            </div>`)),
      this.chkLanguage.insertAfter(this.appLeftBanner);
    (this.chkStopSearch = $(`<div class="languagebox">
                                <div id="stopsearch">
                                    <label>stopsearch</label>
                                    <input id="inputstopsearch" type="checkbox" name="checkbox" style="width: 14px!important" />
                                </div>
                            </div>`)),
      this.chkStopSearch.insertAfter(this.appLeftBanner);
    this.taxSearch = $('a[url="/ParagonLS/Search/Tax.mvc?DBid=1&countyID=1"]');
    this.savedSearches = $(
      'a[url="/ParagonLS/Search/Property.mvc/LoadSavedSearch"]'
    );
    this.listingCarts = $(
      'a[url="/ParagonLS/Search/Property.mvc/ListingCarts/0?searchType=4"]'
    );
    //console.info('New Main Menu Class works!');

    //add the tabs object to Main Menu.
    //this.tabs = new Tabs();
    this.events();
  }

  events() {
    //todo::
    this.btnLoadSubject.addEventListener("click", () =>
      this.loadSubjectProperties()
    );
    var rad = this.subjectPropertyOptions;
    for (var i = 0; i < rad.length; i++) {
      rad[i].addEventListener("change", (e) => {
        $('input[name="textbox"]').val("remote change OK!");
      });
    }
  }

  showLargeMap() {
    console.log("large map clicked");
    var x = $("iframe");
    console.log(x);
    var y = x.contents();
    var z = y.find("#divMap");

    console.log(z);
  }

  openTaxSearch() {
    this.taxSearch[0].click();
  }

  openSavedSearches() {
    this.savedSearches[0].click();
  }

  openListingCarts() {
    this.listingCarts[0].click();
  }

  loadSubjectProperties() {
    var address = "TEST";
    var id = "1234";
    var urlOption = document.getElementById("pid_local").checked;
    var ajax_url = "";
    if (urlOption) {
      ajax_url =
        "http://localhost/pidrealty4/wp-content/themes/realhomes-child-3/db/loadSubjectData.php";
    } else {
      ajax_url =
        "https://pidhomes.ca/wp-content/themes/realhomes-child-3/db/loadSubjectData.php";
    }

    $.ajax({
      url: ajax_url,
      method: "post",
      data: { address: address, postID: id },
      dataType: "json",
      success: function (res) {
        console.log("res", res);
        var subjectProperties = res;
        var htmlSelect = document.getElementById("SubjectProperty");
        //clear old optionis in the htmlSelect
        htmlSelect.length = 0;
        let defaultOption = document.createElement("option");
        defaultOption.text = "Choose Subject Property";

        htmlSelect.add(defaultOption);
        htmlSelect.selectedIndex = 0;
        let option;
        let subjectAddress;
        let unitNo;
        //SELECT Subject_Address, Unit_No, City, Neighborhood FROM wp_pid_cma_subjects WHERE CMA_ACTION=1
        for (var i = 0; i < subjectProperties.length; i++) {
          let tempUnitNo = subjectProperties[i].Unit_No;
          tempUnitNo = tempUnitNo ? tempUnitNo : "";
          tempUnitNo = tempUnitNo.replace("#", "").trim();
          unitNo = tempUnitNo == "" ? "" : "#" + tempUnitNo + " ";

          subjectAddress =
            unitNo +
            subjectProperties[i].Subject_Address.trim() +
            "[" +
            subjectProperties[i].ID +
            "]";
          option = document.createElement("option");
          option.text = subjectAddress;
          option.value = subjectAddress;
          option.setAttribute("cmaID", subjectProperties[i].ID);
          option.setAttribute(
            "address",
            subjectProperties[i].Subject_Address.trim()
          );
          option.setAttribute("unitno", unitNo.trim());
          option.setAttribute("city", subjectProperties[i].City.trim());
          option.setAttribute(
            "district",
            subjectProperties[i].Neighborhood.trim()
          );
          htmlSelect.add(option);
        }
        // $('input[name="textbox"]').val(JSON.stringify(res));
      },
    });
  }
}
