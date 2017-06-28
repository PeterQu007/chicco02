//Open New Page / Tab of Craigslist
//login automatically with preset account

import $ from 'jquery';
import cgPages from './Pages';

//handle feedback message from Listener
function setListingInfo(info){

	console.log('setListingInfo.1.0: ', info);
	//setup the popup.html, show the available listing
	$('#status').text(info.status);
	$('#manage').text(info.manage);
	$('#postdate').text(info.postedDate);
	$('#title').text(info.title);
};

class NewPage{

	constructor(debug){

		this.log = (debug===0) ? console.log : function(){};
        //console.log(this.log);
        var _$ = this.log;
        this.defaultTabTitla = 'craigslist account';
		this.tabTitle = '';
	}

	getTabTitle(){

		var self = this;
		var _$ = this.log;

		var tabTitle = '';

		chrome.tabs.query({
				active: true,
				currentWindow: true
			}, function(tabs){

				_$("OpenNewPage.1.0: request Acitve tab title...")

				chrome.tabs.sendMessage(

					tabs[0].id,

					{from: 'popup', subject: 'currentTabTitle'},

					function(info){
						
						_$('readListing return tabTitle: ', info);
						
						if(info !== undefined){self.tabTitle = info.tabTitle;}

						self.open();
					}); //edn of sendMessage
		});

		return self;
	} //end of getTabTitle
 
	open(){

		var self = this;
		var _$ = this.log;
		
		if(self.tabTitle != self.defaultTabTitla){

			(function(){

			_$("OpenNewPage.1.1: I am in OpenNewPage");

			//var newURL = "https://accounts.craigslist.org/login?lang=en&cc=us&rt=L&rp=%2Flogin%2Fhome%3Flang%3Den%26cc%3Dus";
			var newURL = cgPages.cgHomePage;
	    	chrome.tabs.create({ url: newURL });

			

			}());

		}

		//query for the current Listing
		//update the popup page Listing
		chrome.tabs.query({
			active: true,
			currentWindow: true
		}, function(tabs){

			_$("OpenNewPage.1.2: request current listing...")

			chrome.tabs.sendMessage(

				tabs[0].id,

				{from: 'popup', subject: 'currentListingInfo'},

				setListingInfo); //the message will be passed back thru setDOMInfo

		});// end of query

		return self;


	}//end of OpenNewPage

} //end of class OpenNewPage

export default NewPage;

