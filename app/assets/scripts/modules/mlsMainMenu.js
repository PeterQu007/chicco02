//define the paragon mls Main Menu Class
//store the frequently used menu function links in the class

export default class MainMenu{
    constructor(){
        this.appBanner = $('#app_banner');
        this.appLeftBanner = $('#app_banner_links_left');
        this.appRightBanner = $('#app_banner_links_right');
        this.appMidBanner = $('<div id = "app_banner_mid"></div>');
        this.appMainMenu = $('#app_banner_menu');
        this.chkLanguage = $(`<div class="languagebox">
                                <div id="reportlanguage">
                                    <label>cn</label>
                                    <input type="checkbox" name="checkbox" style="width: 14px!important" />
                                </div>
                            </div>`),
        this.chkLanguage.insertAfter(this.appLeftBanner);
        this.taxSearch = $('a[url="/ParagonLS/Search/Tax.mvc?DBid=1&countyID=1"]');
        this.savedSearches = $('a[url="/ParagonLS/Search/Property.mvc/LoadSavedSearch"]');
        console.info('New Main Menu Class works!');
        
        //add the tabs object to Main Menu.
        //this.tabs = new Tabs();
    }

    openTaxSearch() {
        this.taxSearch[0].click();
    }

    openSavedSearches() {
        this.savedSearches[0].click();
    }
}

