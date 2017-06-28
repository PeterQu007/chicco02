//Read the fields of a post , prepare to creat a new post

import $ from 'jquery';

const Debug = {logLocal: 1, logBackground: 2, logBG: 2, disable: 3 }; //BG === Background

const selID = '#';

const sels = {

			form : selID + 'postingForm',
				CategoryID : 'select[name="CategoryID"] option:selected',
				PostingTitle : selID + 'PostingTitle',
				PostalCode : selID + 'postal_code',
				PostingBody : selID + 'PostingBody',
				Price : 'input[name="Ask"]',
				ContactPhone : selID + 'contact_phone',
				ContactName : selID + 'contact_name',
				Street : selID + 'xstreet0',
				CrossStreet : selID + 'xstreet1',
				City : selID + 'city',
				Region : selID + 'region',
				OK4Others : selID + 'oc',
			form2 : 'section.body form:nth-child(2)',
				CancelEdit : 'button[value="cancel edit"]'

		};

const Mode = { read: 0, write: 1 };

const timeIntv = 2000;

class ReadWritePost{

	constructor(mode, debug){

		this.debug = debug || Debug.disable;
		this.$$$("^^^Inside ReadWritePost module");

		this.form = $(sels.form);
		this.CategoryID = $(sels.CategoryID);
		this.PostingTitle = $(sels.PostingTitle);
		this.PostalCode = $(sels.PostalCode);
		this.PostingBody = $(sels.PostingBody);
		this.Price = $(sels.Price);
		this.ContactPhone = $(sels.ContactPhone);
		this.ContactName = $(sels.ContactName);
		this.Street = $(sels.Street);
		this.CrossStreet = $(sels.CrossStreet);
		this.City = $(sels.City);
		this.Region = $(sels.Region);
		this.OK4Others = $(sels.OK4Others);
		this.form2 = $(sels.form2);
		this.CancelEdit = $(sels.CanelEdit);

		switch(mode){

			case Mode.read:
				this.readPost();
				break;
			case Mode.write:
				this.writePost();
				break;

		}

		
	}

	
	readPost(){

		var self = this;
		var $$$ = self.$$$.bind(this);

		var CategoryID = this.CategoryID.val();
		var PostingTitle = this.PostingTitle.val();
		var PostalCode = this.PostalCode.val();
		var PostingBody = this.PostingBody.val();
		var Price = this.Price.val() ;
		var ContactPhone = this.ContactPhone.val();
		var ContactName = this.ContactName.val();
		var Street = this.Street.val();
		var CrossStreet = this.CrossStreet.val();
		var City = this.City.val();
		var Region = this.Region.val();
		var OK4Others = this.OK4Others.val();
		
		$$$('clsReadPost.doOnePost...Ready to read: ');

		var post = {	'CategoryID': CategoryID, 
						'PostingTitle': PostingTitle,
						'PostalCode': PostalCode,
						'PostingBody': PostingBody,
						'Price': Price,
						'ContactPhone': ContactPhone,
						'ContactName': ContactName,
						'Street': Street,
						'CrossStreet': CrossStreet,
						'City': City,
						'Region': Region,
						'OK4Others': OK4Others

								}
	
		chrome.storage.sync.set(post);

		$$$('clsReadWritePost.readPost...Ready to read: ', post);

	}

	writePost(post){

		var self = this;
		var $$$ = self.$$$.bind(this);
		
		$$$('clsReadWritePost.writePost...Ready to write: ');

		chrome.storage.sync.get([
				'CategoryID', 
				'PostingTitle',
				'PostalCode',
				'PostingBody',
				'Price',
				'ContactPhone',
				'ContactName',
				'Street',
				'CrossStreet',
				'City',
				'Region',
				'OK4Others'
				
			], function(post){

				//this.CategoryID.val(post.CategoryID);
				
				self.PostingTitle.val(post.PostingTitle);
				self.PostalCode.val(post.PostalCode);
				self.PostingBody.val(post.PostingBody);
				self.Price.val(post.Price);
				self.ContactPhone.val(post.ContactPhone);
				self.ContactName.val(post.ContactName);
				self.Street.val(post.Street);
				self.CrossStreet.val(post.CrossStreet);
				self.City.val(post.City);
				self.Region.val(post.Region);
				self.OK4Others.val(post.OK4Others);

				setTimeout(self.doNewPost.bind(self), 2000);
				
		});

		
	}

	goHomePage(){

		var msg = {from: 'clsReadWritePost', subject: 'fetchBackupCurrentURL'}

		chrome.runtime.sendMessage(

			msg, 

			function(response){
				
				var backupHomeURL = response.backupCurURL;

				if(backupHomeURL){

					chrome.runtime.sendMessage(

						{from: 'clsReadWritePost', subject: 'setCgNewPost', cgNewPost: true},

						function(response){

							//jquery rediret
							//https://stackoverflow.com/questions/503093/how-to-redirect-to-another-webpage-in-javascript-jquery
							window.location.replace(backupHomeURL);

						}

						)
					
				}else{
					window.history.back();
				}
			} 

		)

	}

	doNewPost(){

		var self = this;

		chrome.storage.sync.set({'postMenuStatus': 'writePost.doNewPost'});

		chrome.runtime.sendMessage(

			{from: 'clsReadWritePost', subject: 'setCgNewPost', cgNewPost: false},

			function(response){

				self.form.submit();

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

export default ReadWritePost;

