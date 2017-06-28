//Copy existing post , post again

import $ from 'jquery';
import NewPost from './NewPost';

const Debug = {logLocal: 1, logBackground: 2, logBG: 2, disable: 3 }; //BG === Background

const selID = '#copy';

const sels = {

			menu : selID + 'post',
				menuContent : selID + 'menucontent',
					optContent : selID + 'OptContent',
						optCat : selID + 'OptCat',
						lblPostTitle : selID + 'CheckboxLabel',
						lblCurPrice : selID + 'LblCurPrice',
						txtCurPrice : selID + 'TxtCurPrice',
						lblNewPrice : selID + 'LblNewPrice',
						txtNewPrice : selID + 'TxtNewPrice',
					btnContent : selID + 'BtnContent',
						btnOne : selID + 'CurPostSubmit',
						btnCat : selID + 'CatPostSubmit'

		};

const timeIntv = 2000;

function sleep(milliseconds) {
		var start = new Date().getTime();
		  	for (var i = 0; i < 1e7; i++) {
		    	if ((new Date().getTime() - start) > milliseconds){

		      	break;

		    	}
		    	if (i % 1000 == 0) {console.log(i / 1000);}
			}
}

class Copy{

	constructor(paginator, debug){

		this.debug = debug || Debug.disable;
		this.paginator = paginator; 
		this.$$$("^^^Inside Copy module");

		this.menu = null;
		this.menuContent = null;
		this.btnOne = null; //submit delete current post button
		this.btnCat = null; //submit delete category button
		this.optCat = null; //checkbox
		this.lblPostTitle = null; //checkbox label
		this.txtOldPrice = null;
		this.txtNewPrice = null;
		this.catPosts = null; //cat listings

		this.bindMenuEvents({menu: sels.menu, menuContent: sels.menuContent, 
							btnOne: sels.btnOne, btnCat: sels.btnCat, 
							optCat: sels.optCat, lblPostTitle: sels.lblPostTitle,
							txtCurPrice: sels.txtCurPrice, txtNewPrice: sels.txtNewPrice});

		this.checkStatus();

	}

	bindMenuEvents(){

		for (var n in arguments[0]) { this[n] = $(arguments[0][n]); }

		var $$$ = this.$$$.bind(this);
		var postTitle = this.paginator.cgTable.currentListing.title;
		
		$$$('clsCopy.bindMenuEvents.postTitle: ', postTitle);
		this.lblPostTitle.text('<Copy Cat Posts: >' + postTitle);
		
		(function events(self){

			self.menu.click(self.toggleMenuContent.bind(self, sels.menuContent, Debug.logBG));

			//self.optCat.click(self.changeOption.bind(self, Debug.logBG));

			self.btnOne.click(self.doOnePost.bind(self, Debug.logBG));

			self.btnCat.click(self.doCatPosts.bind(self, Debug.logBG));
			
			chrome.runtime.onMessage.addListener(self.updateCurPost.bind(self));
				
		})(this);

	}

	updateCurPost(msg, sender, response){

		var self = this;
		var $$$ = self.$$$.bind(self);

		$$$("clsCopy.updateCurPost: ");

		if(msg.from = "background", msg.subject = "currentListingUpdated"){

			$$$("clsCopy.updateCurPost: ");

			var postTitle = self.paginator.cgTable.currentListing.title;
			var curPrice = self.paginator.cgTable.currentListing.price;

			chrome.runtime.sendMessage(

				{from: 'clsCopy', subject: 'bg.11.backupPostTitle', PostTitle: postTitle},

				function(response){

					$$$('clsCopy.updateMenuContent...Post Title backuped: ', response.backupPostTitle);
					self.lblPostTitle.text('<Copy Cat Posts: >' + postTitle);
					self.txtCurPrice.val(curPrice);

				}
			)
		}
		
	}

	toggleMenuContent(mnuContentSel){

		var self = this;
		var $$$ = this.$$$.bind(self);
		var postTitle = self.paginator.cgTable.currentListing.title;
		
		$$$('clsCopy.toggleMenuContent.postTitle: ', postTitle);

		chrome.runtime.sendMessage(

			{from: 'clsCopy', subject: 'bg.11.backupPostTitle', PostTitle: postTitle},

			function(response){

				$$$('clsCopy.toggleMenuContent...Post Title backuped: ', response.backupPostTitle);
				self.lblPostTitle.text('<Copy Cat Posts: >' + postTitle);
				self.txtCurPrice.val(curPrice);
				self.menuContent.toggleClass('hideMenuContent');

			}

		)
	
	}

	doOnePost(){

		var self = this;
		var $$$ = self.$$$.bind(this);
		var price = self.txtNewPrice.val();
		price = price.substring(0,price.length).trim();

		chrome.storage.sync.set({'postMenuStatus': 'copy'});

		$$$('clsCopy.doOnePost...star to read the post!');


		var curURL = document.location.href;

		var msg = {from: 'clsCopy', subject: 'backupCurURL', curURL: curURL};

		chrome.runtime.sendMessage(

			msg,

			function(response){

				$$$('clsCopy.doOnePost.get backup current url.result: ', response.backupCurURL);

				self.paginator.cgTable.currentListing.copy(price, Debug.disable);
			}
		)
	
		

	}

	doCatPosts(){

		var self = this;
		var $$$ = self.$$$.bind(this);
		$$$('clsCopy.inside doCatPosts...');

	}

	checkStatus(){

		var self = this;
		var $$$ = self.$$$.bind(this);
		$$$('clsCopy.inside checkStatus...');

		chrome.runtime.sendMessage(

			{from: 'clsCopy', subject: 'fetchCgNewPost'},

			function(response){

				//var newPost = new NewPost();
				if(response.cgNewPost){
					$$$('=====>clsCopy.checkStatus...post MenuStatus is copy');
					chrome.storage.sync.get([

						'CategoryID', 
						'PostingTitle',
						'PostalCode',
						'Price',
						'PostingBody',
						'ContactPhone',
						'ContactName',
						'Street',
						'CrossStreet',
						'City',
						'Region',
						'OK4Others'

						], function(result){


						$$$('=====>clsCopy.Get the new post fields', result);

						var newPost = new NewPost();

						sleep(2000);

						newPost.doNewPost();
					})
				}
		
			}

		)
			
	}

	

	$$$(dbg, msg){

		var self = this;
		var debug = dbg == 0 ? Debug.disable : (parseInt(dbg) || self.debug || Debug.disable);

		switch (debug)
		{
			case Debug.logLocal:
				console.warn(arguments);
				break;
			case Debug.logBackground:
				chrome.runtime.sendMessage(

					{from: 'clsDelete', subject: 'logMessage', log: arguments},

					function(response){
						//to do sth.
					}

					)
				break;
			case Debug.disable:
				break;

			default:
				console.warn(arguments);
				break;
		}

		return self;
	}

}

export default Copy;

