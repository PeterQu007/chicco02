//background script, event mode
//message passed between background - defaultpage - iframes

import database from '../assets/scripts/modules/Database';

var db = new database();
var $fx = L$();

(function () {

	//console.log("Hello!-1");

	chrome.storage.sync.set({ landValue: 0, improvementValue: 0, totalValue: 0, curTabID: null });

	chrome.browserAction.onClicked.addListener(function (activeTab) {

		//open a link
		var newURL = "http://idp.gvfv.clareitysecurity.net/idp/Authn/UserPassword";
		//var newURL = "http://stackoverflow.com/"
		chrome.tabs.create({ url: newURL });

	});

	chrome.webNavigation.onCompleted.addListener(function (details) {
		console.log("Completed!");
		//alert("Completed!");

	}, {
			url: [{ hostContains: '.paragonrels.com' }]
		});

	//receive message from iframes, then transfer the message to Main Page content script
	chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

		console.log("eventPage got a message", request);

		//message from Warning iframe
		if (request.todo == "warningMessage") {

			console.log("I got the warning message!");
			//pass the message to defaultpage(Main Home Page)
			chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
				chrome.tabs.sendMessage(tabs[0].id, { todo: "ignoreWarning" })
			});
		}

		//message from Logout iframe
		if (request.todo == "logoutMessage") {

			console.log("I got logout message!");
			//pass the message to defaultpage(Main Home Page)
			chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
				chrome.tabs.sendMessage(tabs[0].id, { todo: "logoutMLS" })
			});
		}

		if (request.todo == "switchTab") {

			console.log("I got switch Tab message!");
			//pass the message to defaultpage(Main Home Page)
			chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
				chrome.tabs.sendMessage(tabs[0].id, { todo: "switchTab", showResult: request.showResult, saveResult: request.saveResult })
			});

			sendResponse("switchTab done!!!");
		}

		if (request.todo == "taxSearch") {
			//get request to search tax info of Property with PID saved to storage
			console.log(">>>I got tax search command!");

			chrome.storage.sync.get('PID', function (result) {
				//check database, if assess exist, send it back
				console.log(">>>PID is: ", result.PID);
				db.readAssess(result.PID, function (assess) {
					console.log(">>>read from , assess is: ", assess)
					if (!assess) {
						//other wise , send out tax research command:
						chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
							chrome.tabs.sendMessage(tabs[0].id, { todo: "taxSearch" })
						});
					}
				});
			});
			sendResponse(">>>tax search has been processed in eventpage: ");
		}

		if (request.todo == "searchStrataPlanSummary") {
			//get request to search tax info of Property with PID saved to storage
			console.log(">>>I got search StrataPlanSummary command!");

			chrome.storage.sync.get(['strataPlan', 'complexName'], function (result) {
				//check database, if assess exist, send it back
				console.log(">>>strataPlan is: ", result.strataPlan);
				var strataPlan = result.strataPlan;
				var complexName = result.complexName;
				if (!strataPlan || strataPlan == 'PLAN' || strataPlan == 'PL') { return; };
				var today = $fx.getToday();
				db.readStrataPlanSummary(strataPlan + '-' + today, function (strataPlanSummaryToday) {
					console.log(">>>read from , strataPlanSummary is: ", strataPlanSummaryToday)
					if (!strataPlanSummaryToday) {
						//other wise , send out tax research command:
						chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
							chrome.tabs.sendMessage(tabs[0].id, {
								todo: "searchComplex",
								showResult: true, saveResult: true,
								strataPlan: strataPlan, complexName: complexName
							})
						});
					}
				});
			});
			sendResponse(">>>complex search has been processed in eventpage: ");
		}

		if(request.todo == 'searchComplex'){
			var complexID = request._id;
			db.readComplex(complexID, function(complexInfo){
				console.log('>>>read the complex info from database:', complexInfo);
				if(complexInfo && complexInfo.complexName.length>0){
					chrome.storage.sync.set(complexInfo, function(){
						console.log('complexInfo has been updated to storage for report listeners');
					})
				}
			})
		}

		if(request.todo == 'saveComplex'){
			var complexID = request._id;
			db.writeComplex(request);
		}

		if (request.todo == "saveTax") {

			console.log(">>>I got save tax info: ");
			var assess = request.taxData;
			db.writeAssess(assess);
			sendResponse(assess);

		}

		if (request.todo == "saveStrataPlanSummary") {

			console.log(">>>I got save Complex info: ");
			var spSummary = request.spSummaryData;
			db.writeStrataPlanSummary(spSummary);
			sendResponse(spSummary);

		}

		if (request.todo == "updateTopLevelTabMenuItems") {

			console.log("I got Update Top Level Tab Menu Items Command!");

			chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
				chrome.tabs.sendMessage(tabs[0].id, { todo: "updateTopLevelTabMenuItems" })
			});

			sendResponse("Update Top Level Tab Menu Items Command sent out!");
		}

		if (request.todo == "readCurTabID") {

			console.log("New Command: readCurTabID");

			chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
				chrome.tabs.sendMessage(tabs[0].id, { todo: "readCurTabID" })
			});

			sendResponse("readCurTabID Command sent out!");
		}

		if (request.todo == "syncTabToContent"){
			console.log("New Command: syncTabToContent");

			chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
				chrome.tabs.sendMessage(tabs[0].id, { todo: "syncTabToContent" })
			});
		}

		if (request.todo == "hideQuickSearch"){
			console.log("New Command: showQuickSearch");

			chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
				chrome.tabs.sendMessage(tabs[0].id, { todo: "hideQuickSearch", tabID: request.tabID })
			});
		}
	});

	//End of Main Function

}());



