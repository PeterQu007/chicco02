//Repost Class
//get the repostable Listing from the Table
import $ from 'jquery';
import Table from './Table';
import Listing from './Listing';

const Debug = {
	enable : 0,
	disable : 1
}

class Repost{

	constructor(paginator, debug){

		var _$ = this.log = (debug===Debug.enable) ? console.log : function(){};
		
		_$("^^^Inside Repost Module");
		this.repostButton = $('#repost');
		
		//this.cgTable = new Table('#paginator table', 0);
		this.repostListing = new Listing();
		this.form = $("<form></form>");
		this.firstRepostListing = new Listing();
		this.paginator = paginator;
		this.events();
		
	}

	events(){
		this.repostButton.click(this.doRepost.bind(this, 0));
	
		//this.repostButton.click(function(){console.log("hello")});
	}

	doRepost(debug){

		var self = this;
		
		var _$ = (debug===0) ? console.log : function(){};

		_$("Repost a listing: ");
		var listing = self.paginator.cgTable.currentListing;
		_$("Repost.doRepost.1.0.Send the listing to background: ", listing)

		//send the reposted listing to background
		self.paginator.backupCurrentPage();
		
		listing.from = "doRepost",
		listing.subject = "backupListing";
		chrome.runtime.sendMessage(

			listing,

			function(response){
				//send out the repost command
				//form object was saved when read the listing
				//save the edit page status as repost
				_$("Repost.doRepost.1.1.Ready to go: ");
				chrome.storage.sync.set({'postMenuStatus': 'repost'});
				//self.cgTable.form.submit();
				//listingInfo.forms.repostForm.submit();
				listing.repost();
			}

		); 
	}

	getRepostListing(mode, debug){

		var self = this;
		var backupListing;

		var _$ = (debug == 0)? console.log : function(){};

		switch(mode){

		case 0:
			var msg = {from: 'readListing', subject: 'fetchBackupListing'}

			_$("getRepostListing.1.0: read backuped listing ", msg);

			$(function(){
				//read the backupListing from background
				chrome.runtime.sendMessage(

					msg,

					function(response){
				
						backupListing = response;
						_$("getRepostListing.1.01: read backuped listing ", backupListing);

						//cgTable = new Table('table');
						self.repostListing = self.cgTable.readListing(backupListing);
						self.form = self.cgTable.form;
						_$("getRepostListing.1.02", self.cgTable.repostableListings());

						//listingInfo = readTable('table', backupListing);
						
					}

				);
			});

			break;
		case 1:
			//read the first repostable Listing
			_$('getRepostListing.2.00..read first Repostable listing: ');
			self.firstRepostListing = self.cgTable.readListing(new Listing());
			_$('getRepostListing.2.0x..result is: ', self.firstRepostListing);
			break;
		default: 
			break;
		}
	}	

}

export default Repost;

