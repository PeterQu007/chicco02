//edit the post fields
//change the price automatically

import $ from 'jquery';

const Debug = {logLocal: 1, logBackground: 2, logBG: 2, disable: 3 }; //BG === Background

const selID = '#edit';

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

class Edit{

	constructor(paginator, debug){

		this.debug = debug || Debug.disable;
		this.paginator = paginator; 
		this.$$$("^^^Inside Edit module");

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
		
		$$$('clsEdit.bindMenuEvents.postTitle: ', postTitle);
		this.lblPostTitle.text('<Edit Cat Posts: >' + postTitle);
		
		(function events(self){

			self.menu.click(self.toggleMenuContent.bind(self, sels.menuContent, Debug.logBG));

			self.optCat.click(self.changeOption.bind(self, Debug.logBG));

			self.btnOne.click(self.doOnePost.bind(self, Debug.logBG));

			self.btnCat.click(self.doCatPosts.bind(self, Debug.logBG));
			
			chrome.runtime.onMessage.addListener(self.updateCurPost.bind(self));
				
		})(this);

	}

	updateCurPost(msg, sender, response){

		var self = this;
		var $$$ = self.$$$.bind(self);

		$$$("clsEdit.onUpdateCurPost: ");

		if(msg.from = "background", msg.subject = "currentListingUpdated"){

			$$$("clsEdit.updateCurPost: ");

			var postTitle = self.paginator.cgTable.currentListing.title;
			var curPrice = self.paginator.cgTable.currentListing.price;

			chrome.runtime.sendMessage(

				{from: 'clsEdit', subject: 'bg.11.backupPostTitle', PostTitle: postTitle},

				function(response){

					$$$('clsEdit.updateMenuContent...Post Title backuped: ', response.backupPostTitle);
					self.lblPostTitle.text('<Edit Cat Posts: >' + postTitle);
					self.txtCurPrice.val(curPrice);

				}
			)
		}
	}

	toggleMenuContent(mnuContentSel){

		var self = this;
		var $$$ = this.$$$.bind(self);
		var postTitle = self.paginator.cgTable.currentListing.title;
		
		$$$('clsEdit.toggleMenuContent.postTitle: ', postTitle);

		chrome.runtime.sendMessage(

			{from: 'clsEdit', subject: 'bg.11.backupPostTitle', PostTitle: postTitle},

			function(response){

				$$$('clsEdit.toggleMenuContent...Post Title backuped: ', response.backupPostTitle);
				self.lblPostTitle.text('<Edit Cat Posts: >' + postTitle);
				self.txtCurPrice.val(curPrice);
				self.menuContent.toggleClass('hideMenuContent');

			}

		)
	
	}

	changeOption(){

		var self = this;
		var $$$ = self.$$$;

		$$$('clsEdit.Option changed...');

		if(self.optCat.is(':checked')){
			
		}else{
			
		}
	}

	doOnePost(){

		var self = this;
		var $$$ = self.$$$.bind(this);
		var price = self.txtNewPrice.val();
		price = price.substring(0,price.length).trim();

		if(parseInt(price) > 0) {

			chrome.storage.sync.set({'newPrice': price, 'postMenuStatus': 'edit'});

			var listing = self.paginator.cgTable.currentListing.edit(price);

		}else{

			$$$('clsEdit.doOnePost...the new price is wrong!');
		}
		

	}

	doCatPosts(){

	}

	
	checkStatus(){

		var self = this;
		var $$$ = this.$$$.bind(self);

		chrome.runtime.sendMessage(

			{from: 'clsEdit', subject: 'bg.14.fetchCgManagerStatus'},

			function(response){

				if(response.curCgManagerStatus == 'edit'){

					var postID = response.postID;

					var catPost = self.paginator.cgTable.listings.find(function(post){

						return post.postID == postID && post.status == 'Active';
					});

					$$$('clsEdit.checkStatus...find the next edit post: ', catPost);
					setTimeout(function(catPost){

						catPost.edit();

					}(catPost), timeIntv);
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

}////end of classEdit

export default Edit;