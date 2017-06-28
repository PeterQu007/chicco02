//content layer for reading the craigslist table from web pages
// {
// 		"matches": ["https://accounts.craigslist.org/login/home?*"],
// 		"js": ["jquery-3.2.1.js","cgManager.js"]
// }

//import Listing from '../assets/scripts/modules/Listing';
import Listing from "../assets/scripts/modules/Listing";
import Table from '../assets/scripts/modules/Table';
import Paginator from '../assets/scripts/modules/Paginator';
import PostMenu from '../assets/scripts/modules/PostMenu'; 
import Repost from '../assets/scripts/modules/Repost';
import Delete from '../assets/scripts/modules/Delete';
import Edit from '../assets/scripts/modules/Edit';
import Copy from '../assets/scripts/modules/Copy';

 
'use strict';

var _$$$ = console.log;

var BreakException = {};
var form; //keep the submit form, for auto click 'repost' link
var words; // compare the title, if the first a few words same, skip to next listing
var backupListing;  // keep the candidate listings for repost records
var listingInfo; //keep the repostable listing details
var pn; //paginator object
var cgPostMenu, cgRepost, cgDelete, cgEdit, cgCopy;
var pageChanged = true;
var tableSelector = "#account-homepage-form";


_$$$("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<new cgManager.js");
const Debug = {logLocal: 1, logBackground: 2, logBG: 2, logDisable: 3 }; //BG === Background
chrome.storage.sync.set({'postMenuStatus': ''});
$('select[name="areaabb"]').val('van'); //set up new post area to vancouver

//build two listing objects
_$$$("cgManager.Start.0.0a.build new object: ", backupListing, listingInfo);
backupListing = new Listing();
listingInfo = new Listing();
pn = new Paginator('#paginator', 1);
_$$$("cgManager.0.1.new paginator", pn);

var timer1 = setInterval(checkPage, 100);

function checkPage(){

	if(pn.pageChanged !== null){

		clearInterval(timer1); 

		listingInfo = pn.cgTable.currentListing;
		_$$$("cgManager.0.2..currentListing inside cgRepost is =========> ", listingInfo);

		var timer = setInterval(checkCurrentListing, 100);

		function checkCurrentListing(){

			listingInfo = pn.cgTable.currentListing;

			if (listingInfo && pn.pageChanged !== null) {

				clearInterval (timer);

				_$$$('cgManager.0.3...create post menu: ');
				cgPostMenu = new PostMenu(tableSelector, 0);
				cgRepost = new Repost(pn);
				
				_$$$("cgManager.0.4.currentListing established inside cgRepost is ======> ", listingInfo);
				pn.backupCurrentPage();
				chrome.storage.sync.set({'editPageStatus':'null'});
				cgDelete = new Delete(pn, Debug.logDisable);
				cgEdit = new Edit(pn, Debug.logDisable);
				
				cgCopy = new Copy(pn, Debug.logLocal);
				
				

			}
		}
	}
}

//chrome.storage.sync.set({'pageNo': pn.currentPage});
//pn.goToPage(2,0);


_$$$(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>exit cgManager.js");



//Listen for messages from the popup
//Setup the listener for popup layer
chrome.runtime.onMessage.addListener(function (msg, sender, response){

	//First, validate the message's structure
	_$$$("onMessage.0.0..readinglist.js got a message:")

	if ((msg.from === 'popup') && (msg.subject === 'listingInfo')) {

		_$$$('onMessage.1.0..popup request to read next listing:');

		getListing(1);

		response(listingInfo);

	};

	if ((msg.from === 'popup') && (msg.subject === 'currentListingInfo')) {

		_$$$('onMessage.2.0..popup request to read Current listing:', listingInfo);

		response(listingInfo);

	};

	if ((msg.from === 'popup') && (msg.subject === 'currentTabTitle')) {

		_$$$('onMessage.2.0..popup request to read Current Tab Title:');

		var tabTitle = document.title;

		_$$$('Current tab title is: ', tabTitle.trim());

		response({tabTitle: tabTitle.trim() });

	};

	if ((msg.from === 'popup') && (msg.subject === 'repost')) {

		_$$$("onMessage.3.0..get request to repost a listing: ");

		_$$$("onMessage.3.1..readListing.js is posting: ", listingInfo)

		//send the reposted listing to background
		listingInfo.from = "readListing",
		listingInfo.subject = "backupListing";
		chrome.runtime.sendMessage(

			listingInfo,

			function(response){
				//send out the repost command
				//form object was saved when read the listing
				//form.submit();
				cgRepost.doRepost();

			}

		); 

		
		//send the feedback to popup.js
		//inform the popup.js the next listing info
		// log('onMessage.3.2..read next Listing, send next Listing to popup: ')
		// getListing(1);
		// listingInfo.from = "readList";
		// listingInfo.subject = "reposted";
		// response(listingInfo);
	};
})