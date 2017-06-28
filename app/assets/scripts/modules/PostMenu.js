//add post menu

const Debug = {logLocal: 1, logBackground: 2, logBG: 2, disable: 3 }; //BG === Background


class PostMenu{
	
	constructor(insertAfterSelector, debug){

		this.debug = debug || Debug.disable;
		this.$$$("^^^Inside PostMenu module");

		this.insertAfterSelector = insertAfterSelector;
		this.delMenuContent = '';
		this.repMenuContent = '';
		this.editMenuContent = '';
		this.copyMenuContent = '';
	
		this.addPostMenu(this.insertAfterSelector);

		this.addDelMenu(this.delMenuContent);
		this.addRepMenu(this.repMenuContent);
		this.addEditMenu(this.editMenuContent);
		this.addCopyMenu(this.copyMenuContent);

	}

	addPostMenu(insertAfterSelector){

		//craigslist : insertAfterSelector = "#account-homepage-form"
		var postmenu = '#postmenu';

		$("<div id='postmenu' class='postmenu'>Post Menu: </div>").insertAfter(insertAfterSelector);

		$("<input type='submit' id='newpost' value='new' />").appendTo(postmenu);
		$("<input type='submit' id='copypost' value='copy' />").appendTo(postmenu);
		$("<input type='submit' id='editpost' value='edit' />").appendTo(postmenu);
		$("<input type='submit' id='delpost' value='delete' />").appendTo(postmenu);
		$("<input type='submit' id='repost' value='repost' />").appendTo(postmenu);
		$("<input type='submit' id='nextpost' value='next' />").appendTo(postmenu);
		$("<input type='submit' id='favpost' value='favourite' />").appendTo(postmenu);
		$("<input type='submit' id='myposts' value='myposts' />").appendTo(postmenu);

		//div for menucontent
		$("<div id='delmenucontent' class='delmenucontent hideMenuContent'></div>").insertAfter(postmenu);
		$("<div id='repmenucontent' class='repmenucontent'></div>").insertAfter(postmenu);
		$("<div id='editmenucontent' class='editmenucontent'></div>").insertAfter(postmenu);
		$("<div id='copymenucontent' class='copymenucontent'></div>").insertAfter(postmenu);

		this.delMenuContent = '#delmenucontent';
		this.repMenuContent = '#repmenucontent';
		this.editMenuContent = '#editmenucontent';
		this.copyMenuContent = '#copymenucontent';

	}

	addDelMenu(menuSelector){

		var self = this;
		var $$$ = self.$$$.bind(self);
				
		var delMenu = $('<div id="delMenu" class="menuContent"></div>');
		var delMenuOption = $('<input type="checkbox" name="delOption" id="delCat" value="delCat">');
		var optSpan = $('<span id="delCheckboxText">'+ 'Delete The Category Posts: '+ 'listingTitle' + '</span></br>');	

		var submitBox = $('<div id="delSubmitBox"></div>'); 
		var delOneSubmit = $('<input type="submit" id="delCurPostSubmit" value="del current post">');
		var delCatSubmit = $('<input type="submit" id="delCatPostsSubmit" value="del one cat posts">')
		
		$$$('class.PostMenu.addDelMenu...delMenu delMenuOption optSpan: ', delMenu, delMenuOption, optSpan);
		
		delMenu.appendTo(menuSelector);
		delMenuOption.appendTo('#delMenu');
		optSpan.insertAfter('#delCat');

		submitBox.insertAfter('#delCheckboxText');
		delOneSubmit.appendTo('#delSubmitBox');
		delCatSubmit.insertAfter('#delCurPostSubmit');

	}

	addRepMenu(menuSelector){

		var self = this;
		var $$$ = self.$$$.bind(self);
				
		var repMenu = $('<div id="repMenu" class="hideMenuContent"></div>');
		var repMenuOption = $('<input type="checkbox" name="repOption" id="repSel" value="repSel">');
		var optSpan = $('<span id="repCheckboxText">'+ 'Repost The Category Posts: '+ 'listingTitle' + '</span></br>');	

		var submitBox = $('<div id="repSubmitBox"></div>'); 
		var repOneSubmit = $('<input type="submit" id="repCurPostSubmit" value="repost current post">');
		var repSelSubmit = $('<input type="submit" id="repSelPostsSubmit" value="repost selected posts">')
		
		$$$('class.PostMenu.addRepMenu...repMenu repMenuOption optSpan: ', repMenu, repMenuOption, optSpan);
		
		repMenu.appendTo(menuSelector);
		repMenuOption.appendTo('#repMenu');
		optSpan.insertAfter('#repSel');

		submitBox.insertAfter('#repCheckboxText');
		repOneSubmit.appendTo('#repSubmitBox');
		repSelSubmit.insertAfter('#repCurPostSubmit');

	}

	addEditMenu(menuContent){

		var self = this;
		var $$$ = self.$$$.bind(self);
		$$$('class.PostMenu.addEditMenu...editMenu editMenuOption optSpan: ');

		var $optContent = $('<div />').attr({id: 'editOptContent', class: 'optContent'});
			var $optCat = $('<input type="checkbox">').attr({name: "editOptCat", id: "editOptCat", value: "editOptCat"});
			var $lblPostTitle = $('<label>').attr({id: "editCheckboxLabel"}).text('Edit The Category Posts: '+ 'listingTitle');	
			var $lblCurPrice = $('<label>').text('Current Price: ').attr({id: 'editLblCurPrice', name: 'priceLabel'});
			var $txtCurPrice = $('<input type="text">').attr({id: 'editTxtCurPrice'});
			var $lblNewPrice = $('<label>').text('New Price: ').attr({id: 'editLblNewPrice', name: 'priceLabel'});
			var $txtNewPrice = $('<input type="text">').attr({id: 'editTxtNewPrice'});
		$optContent.append($optCat).append($lblPostTitle).append($('</br>'))
					.append($lblCurPrice).append($txtCurPrice)
				   	.append($lblNewPrice).append($txtNewPrice);
	
		var $btnContent = $('<div />').attr({id: "editBtnContent"}); 
			var $btnOne = $('<input type="submit">').attr({id: "editCurPostSubmit", value: "edit current post"});
			var $btnCat = $('<input type="submit">').attr({id: "editCatPostsSubmit", value: "edit cat posts"});
			
		$btnContent.append($btnOne).append($btnCat);
		
		$(menuContent).append($optContent).append($btnContent);

	}

	addCopyMenu(menuContent){

		var self = this;
		var $$$ = self.$$$.bind(self);
		$$$('class.PostMenu...addCopyMenu: ');

		var $optContent = $('<div />').attr({id: 'copyOptContent', class: 'optContent'});
			var $optCat = $('<input type="checkbox">').attr({name: "copyOptCat", id: "copyOptCat", value: "copyOptCat"});
			var $lblPostTitle = $('<label>').attr({id: "copyCheckboxLabel"}).text('copy The Category Posts: '+ 'listingTitle');	
			var $lblCurPrice = $('<label>').text('Current Price: ').attr({id: 'copyLblCurPrice', name: 'priceLabel'});
			var $txtCurPrice = $('<input type="text">').attr({id: 'copyTxtCurPrice'});
			var $lblNewPrice = $('<label>').text('New Price: ').attr({id: 'copyLblNewPrice', name: 'priceLabel'});
			var $txtNewPrice = $('<input type="text">').attr({id: 'copyTxtNewPrice'});
		$optContent.append($optCat).append($lblPostTitle).append($('</br>'))
					.append($lblCurPrice).append($txtCurPrice)
				   	.append($lblNewPrice).append($txtNewPrice);
	
		var $btnContent = $('<div />').attr({id: "copyBtnContent"}); 
			var $btnOne = $('<input type="submit">').attr({id: "copyCurPostSubmit", value: "copy current post"});
			var $btnCat = $('<input type="submit">').attr({id: "copyCatPostsSubmit", value: "copy cat posts"});
			
		$btnContent.append($btnOne).append($btnCat);
		
		$(menuContent).append($optContent).append($btnContent);

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

export default PostMenu