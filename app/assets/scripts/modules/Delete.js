//Delete out of date listings

import $ from 'jquery';
//import Paginator from './Paginator';

const Debug = {logLocal: 1, logBackground: 2, logBG: 2, disable: 3 }; //BG === Background

const selID = '#del';

const sels = {

			menu : selID + 'post',
			menuContent : selID + 'menucontent',
			menuOptDiv : selID + 'Menu',
			optDelCat : selID + 'Cat',
			lblPostTitle : selID + 'CheckboxText',
			menuBtnDiv : selID + 'SubmitBox',
			btnDelOne : selID + 'CurPostSubmit',
			btnDelCat : selID + 'CatPostsSubmit'

		}

const timeIntv = 2000;

class Delete{

	constructor(paginator, debug){

		this.debug = debug || Debug.disable;
		this.paginator = paginator; 
		this.$$$("^^^Inside Delete module");
	
		this.menu = null;
		this.menuContent = null;
		this.btnDelOne = null; //submit delete current post button
		this.btnDelCat = null; //submit delete category button
		this.optDelCat = null; //checkbox
		this.lblPostTitle = null; //checkbox label
		this.catPosts = null; //cat listings

		this.bindMenuEvents({menu: sels.menu, menuContent: sels.menuContent, 
							btnDelOne: sels.btnDelOne, btnDelCat: sels.btnDelCat, 
							optDelCat: sels.optDelCat, lblPostTitle: sels.lblPostTitle});

		this.checkStatus();
		
	};

	bindMenuEvents(){

		for (var n in arguments[0]) { this[n] = $(arguments[0][n]); }

		var $$$ = this.$$$.bind(this);
		var postTitle = this.paginator.cgTable.currentListing.title;
		
		$$$('clsDelete.bindMenuEvents.postTitle: ', postTitle);
		this.lblPostTitle.text('<Delete Cat Posts: >' + postTitle);
		
		(function events(self){

			self.menu.click(self.toggleMenuContent.bind(self, sels.menuContent, Debug.logBG));

			self.optDelCat.click(self.changeOption.bind(self, Debug.logBG));

			self.btnDelOne.click(self.doOnePost.bind(self, Debug.logBG));

			self.btnDelCat.click(self.doCatPosts.bind(self, Debug.logBG));
			
			chrome.runtime.onMessage.addListener(self.updateCurPost.bind(self));
				
		})(this);
	}
	
	updateCurPost(msg, sender, response){
	//get the message from background
	//if the current listing updated, the delete menu will be updated

		var self = this;
		var $$$ = self.$$$.bind(self);

		$$$("clsDelete.onUpdateCurPost: ");

		if(msg.from = "background", msg.subject = "currentListingUpdated"){

			$$$("clsDelete.updateCurPost: ");

			var postTitle = self.paginator.cgTable.currentListing.title;

			chrome.runtime.sendMessage(

				{from: 'clsDelete', subject: 'bg.11.backupPostTitle', PostTitle: postTitle},

				function(response){

					$$$('clsDelete.updateMenuContent...Post Title backuped: ', response.backupPostTitle);
					self.lblPostTitle.text('<Delete Cat Posts: >' + postTitle);
				}
			)
		}
	}

	toggleMenuContent(mnuContentSel){

		var self = this;
		var $$$ = this.$$$.bind(self);
		var postTitle = self.paginator.cgTable.currentListing.title;
		
		$$$('clsDelete.toggleMenuContent.postTitle: ', postTitle);

		chrome.runtime.sendMessage(

			{from: 'clsDelete', subject: 'bg.11.backupPostTitle', PostTitle: postTitle},

			function(response){

				$$$('clsDelete.toggleMenuContent...Post Title backuped: ', response.backupPostTitle);
				self.lblPostTitle.text('<Delete Cat Posts: >' + postTitle);
				self.menuContent.toggleClass('hideMenuContent');

			}

		)
	
	}

	changeOption(){

		var self = this;
		var $$$ = self.$$$;

		$$$('clsDelete.Option changed...');

		if(self.optDelCat.is(':checked')){
			
		}else{
			
		}
	}

	doOnePost(){
		//locate the delete row in the table
		//click delete button
		//follow the delete sequence
		//back to the same table
		//loop to the table end
		var self = this;
		var $$$ = self.$$$.bind(self);

		var post = self.paginator.cgTable.currentListing;
		
		var curURL = document.location.href;

		chrome.storage.sync.set({'delStatus':'deletingOnePost'});

		var msg = {from: 'clsDelete', subject: 'backupCurURL', curURL: curURL};

		chrome.runtime.sendMessage(

			msg,

			function(response){

				$$$('clsDelete.delOnePost.get backup current url.result: ', response.backupCurURL);

				post.delete(Debug.logLocal);
			}
		)
	}

	doCatPosts(){

		var self = this;
		var $$$ = self.$$$.bind(self);

		chrome.storage.sync.set({'delStatus':'deletingCatPosts'});

		$$$('clsDelete.doCatPosts...: ');

		var posts = self.paginator.cgTable.listings.filter(function(post){
			return post.status == 'Active';
		});
				
		var doCatPosts;

		chrome.runtime.sendMessage(

			{from: 'clsDelete', subject: 'bg.12.fetchBackupPostTitle'},

			function(response){
				
				var postTitle = response.backupPostTitle;

				doCatPosts = posts.filter(function(post){

					$$$(0, 'clsDelete.doCatPosts...post title', post.title);

					return post.title.indexOf(postTitle) != -1;
				});

				$$$('clsDelete.doCatPosts...filter the delete posts: ', doCatPosts);

				self.catPosts = doCatPosts;

				$$$('clsDelete.doCatPosts...Posts: ', doCatPosts);

				chrome.runtime.sendMessage(

					{from: 'clsDelete', subject: 'bg.13.backupCatPosts', catPosts: doCatPosts},

					function(response){

						$$$('clsDelete.doCatPosts...all posts ready for deleting');
						
						self.checkStatus();

	}	)	}	)	}

	checkStatus(){

		var self = this;
		var $$$ = this.$$$.bind(self);

		chrome.runtime.sendMessage(

			{from: 'clsDelete', subject: 'bg.14.fetchCgManagerStatus'},

			function(response){

				if(response.curCgManagerStatus == 'del'){

					var postID = response.postID;

					var catPost = self.paginator.cgTable.listings.find(function(post){

						return post.postID == postID && post.status == 'Active';
					});

					$$$('clsDelete.checkStatus...find the next del post: ',catPost);
					setTimeout(function(catPost){

						catPost.delete(Debug.logLocal);

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
}

export default Delete;