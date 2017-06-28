import cgPages from '../assets/scripts/modules/Pages';
import ReadWritePost from '../assets/scripts/modules/ReadWritePost';;

var _$ = console.log;
const Debug = {logLocal: 1, logBackground: 2, logBG: 2, disable: 3 }; //BG === Background
const Mode = {read: 0, write: 1};

$(function(){

	console.log('=====================================AUTO POST A LISTING');

	setTimeout(move, 1000);

	function move(){

		if (document.location.href.indexOf('edit')>-1) {

			chrome.storage.sync.get(['postMenuStatus'], function(status){

				_$("autoPost.1.0...get storage postMenuStatus: ", status.postMenuStatus);


				switch (status.postMenuStatus){

					case 'repost':
						_$("autoPost.1.1...auto repost: ");
						chrome.storage.sync.set({'postMenuStatus':'repost'});
						$('#postingForm').submit();
						break;
					case 'edit': 
						//wait for edit the page
						_$("autoPost.1.2...edit listing: ");
						chrome.storage.sync.set({'postMenuStatus':'repost'});
						chrome.storage.sync.get(['newPrice'], function(result){
							var price = result.newPrice;
							var element = $("#postingForm div.posting fieldset label:contains('price')");
							_$("autoPost.1.2.1...find the price element: ", element);
							element.find('input[type="text"]').first().val(price);
							$('#postingForm').submit();
						}) 
						break;
					case 'copy':
						_$("autoPost.1.3...start to copy listing: ");
						var readPost = new ReadWritePost(Mode.read, Debug.logLocal);
						_$("autoPost.1.3.1...show the post fields: ", readPost);
						setTimeout(readPost.goHomePage, 2000);
						break;
					case 'new':
						_$("autoPost.1.4...start to write a new post: ");
						var writePost = new ReadWritePost(Mode.write, Debug.logLocal);
						//setTimeout(writePost.doNewPost, 2000);
						break;
					case '':
						_$("autoPost.1.5...manually edit the post: ")
						break;
					default:
						break;
				}

			})
			
		}

		if (document.location.href.indexOf('preview')>-1) {

			chrome.storage.sync.get(['postMenuStatus'], function(status){

				_$("autoPost.2.0.get storage postMenuStatus: ", status);

				switch (status.postMenuStatus){

					case 'repost':
					//case 'writePost.doNewPost':
						chrome.storage.sync.set({'postMenuStatus':'repost'});
						$('#publish_top').submit();
						break;

					case 'edit':
						//wait for edit the page
						_$("autoPost.2.1.start to edit listing: ");
						chrome.storage.sync.set({'postMenuStatus':'edit'});
						$('div.preview-edit-buttons form:first').submit();
						
						break;
					case 'copy':
						_$("autoPost.2.2.start to read-copy listing: ");
						chrome.storage.sync.set({'postMenuStatus':'copy'});
						$('div.preview-edit-buttons form:first').submit();

					case 'new':

						break;

					case '':
						_$('autoPost.2.4...manual edit: ');
						break;

					default:

						break;
				}

				
				
			})
		}

		if (document.location.href.indexOf('redirect')>-1){
			//get previous page number
			_$("autoPost.redirect.1.0: ")
			var msg = {from: "repost", subject: "fetchBackupCurrentPage"};

			chrome.runtime.sendMessage(
					msg,

					function(response){
						_$('redirect.get response of fetchbackupCurrentPage: ', response);
						var previousPage = response.backupCurrentPage.toString().trim();
						var cgRedirectPage = cgPages.cgRedirect.replace("filter_page=2","filter_page="+previousPage);
						_$("autoPost.1.2.show the cgRedirectPage href: ", cgRedirectPage);
						$($('section.body ul.ul li a')[2]).attr('href', cgRedirectPage);
						$('section.body ul.ul li a')[2].click();
					}
				)
			
		}

	}

	

}())