//Post a new cgListing

class NewPost{
	
	constructor(){

		this.area = $('select[name="areaabb"]');
		this.form = $('form.new_posting_thing');

		chrome.storage.sync.set({'postMenuStatus': 'new'});

		this.setArea();

		chrome.storage.sync.get(['postMenuStatus'], function(result){
			this.setArea();
			console.log('clsNewPost.read postMenuStatus: ', result.postMenuStatus);
		})
		
		setTimeout(function(){}, 10000);
		
	}

	setArea(){

		this.area.val('van');
	}

	doNewPost(){

		this.form.submit();
	};

}

export default NewPost;