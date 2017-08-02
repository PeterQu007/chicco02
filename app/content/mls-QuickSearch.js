//QuickSearch Page
//show / hide as per needed

var quickSearch = {

    init: function(){
        //link to iframe's tabID
		this.tabID = this.getTabID(window.frameElement.src);
        console.warn('QuickSearch=====>window.frameElement.id', this.tabID);
        this.$tabContentContainer = $('div#'+this.tabID, top.document)
        this.onMessage();
    },

    getTabID: function (str) {
		let src = str;
		let start = src.indexOf('searchID=');
		src = src.substring(start);
		console.log(src);
		
		start = src.indexOf('=tab');
		src = src.substring(start + 1);
		end = src.indexOf('_');
		//only need the main tab id, remove the sub tab ids:
		src = src.substring(0,end);
		console.log('QuickSearch Page\'s tabID is:', src);
		return src
    },

    getTabStatus: function(){
        let self = this;
        chrome.storage.sync.get('showTabQuickSearch', function(result){

            if(result.showTabQuickSearch){
                self.showQuickSearch();
            }else{
                self.hideQuickSearch();
            }
        })
    },
    
    showQuickSearch: function() {
        chrome.runtime.sendMessage({
            from: 'QuickSearch',
            todo: 'showQuickSearch',
            tabID: this.tabID
        })
    },

    hideQuickSearch: function() {
        chrome.runtime.sendMessage({
            from: 'QuickSearch',
            todo: 'hideQuickSearch',
            tabID: this.tabID
        })
    }
}