//define the paragon mls Main Menu Class
//store the frequently used menu function links in the class

export default class MainMenu {
  constructor() {
    this.appBanner = $("#app_banner");
    this.appLeftBanner = $("#app_banner_links_left");
    this.appRightBanner = $("#app_banner_links_right");
    this.appMidBanner = $('<div id = "app_banner_mid"></div>');
    this.appMainMenu = $("#app_banner_menu");

    (this.txtResponse = $(`<div class="languagebox">
                                <div id="textResponse">
                                    <label>res</label>
                                    <input type="text" name="textbox" style="width: 350px!important" />
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
}
