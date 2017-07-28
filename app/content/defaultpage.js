// works with Paragon's main window
// inject to Paragon's Url: http://bcres.paragonrels.com/ParagonLS/Default.mvc*
// the messages are passed between the defaultpage and iframes, all are the content scripts

import Tabs from '../assets/scripts/modules/mlsTabs';
import MainMenu from '../assets/scripts/modules/mlsMainMenu';

let DefaultPage = {

    init: function () {
        // Open frequently used tabs:
        this.mainMenu.openTaxSearch();
        this.mainMenu.openSavedSearches();
    },

    mainMenu: new MainMenu(),
    tabs: new Tabs(),

};

// Start point
$(function () {
    DefaultPage.init();
});

