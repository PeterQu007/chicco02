//define the paragon mls Main Menu Class
//store the frequently used menu function links in the class

export default class MainMenu {
  constructor() {
    this.appBanner = $("#app_banner");
    this.appLeftBanner = $("#app_banner_links_left");
    this.appRightBanner = $("#app_banner_links_right");
    this.appMidBanner = $('<div id = "app_banner_mid"></div>');
    this.appMainMenu = $("#app_banner_menu");

    //insert Subject Setting Button
    (this.txtSubjectProperty = $(`<div>
                                <input type="TEXT" id="SubjectProperty">
                                </div>
                            `)),
      this.txtSubjectProperty.insertAfter(this.appLeftBanner);
    this.txtSubjectAddress = document.getElementById("SubjectProperty");

    //insert Subject Add Button
    this.btnSubjectProperty = $(`<div> 
                  <input type = "button" id="SubjectPropertySubmit" value="Add Subject">
                  </div>`);
    this.btnSubjectProperty.insertAfter(this.appLeftBanner);
    this.btnAddSubject = document.getElementById("SubjectPropertySubmit");

    (this.chkShowSmallMap = $(`<div class="languagebox">
                                <div id="checkShowSmallMapWrapper">
                                    <label>Lock Map Size</label>
                                    <input id="checkShowSmallMap" name="buttonShowPic" type = "checkbox" style="width: 14px!important"/>
                                </div>
                            </div>`)),
      this.chkShowSmallMap.insertAfter(this.appLeftBanner);

    (this.txtResponse = $(`<div class="languagebox">
                                <div id="textResponse">
                                    <label>res</label>
                                    <input id="inputListingInfo" type="text" name="textbox" style="width: 350px!important" />
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
    this.btnAddSubject.addEventListener("click", () => this.post());
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

  post() {
    var address = this.txtSubjectAddress.value;
    var id = "1234";

    $.ajax({
      url:
        "https://pidrealty.local/wp-content/themes/pidHomes-PhaseI/db/data.php",
      method: "post",
      data: { address: address, postID: id },
      success: function(res) {
        console.log("res", res);
        $('input[name="textbox"]').val(
          JSON.stringify(res) + ":: connect to MySQL successfully!!!!"
        );
      }
    });
  }
}
