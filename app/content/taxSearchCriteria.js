//Query tax information

//console.log("MLS tax search iframe");

// chrome.storage.sync.get("PID",function(result){
	
// 	var inputPID = $('#f_22');
// 	inputPID.focus().val(result.PID).blur();

// 	var btnSearch = $('#Search');

// 	btnSearch.click();
	
// })

chrome.runtime.onMessage.addListener(function (msg, sender, response) {

	if(String(msg.todo).indexOf('taxSearchFor')>-1){

        //console.log("I am in mls-tax.js");
        //console.log("mls-tax got msg: ", msg);
        response("mls-tax got a message");

      	chrome.storage.sync.get("PID",function(result){
	
			var inputPID = $('#f_22');
			var liPID = $('div[rel="f_22"] ul li.acfb-data');
			var inputHidenPID = $('#hdnf_22');
			liPID.remove();
			inputHidenPID.val('');
			inputHidenPID.val("['" + result.PID + "']");

			inputPID.focus().val(result.PID).blur();

			
			var btnSearch = $('#Search');

			chrome.storage.sync.set({

				totalValue: 0,
				landValue: 0,
				improvementValue: 0,
				taxSearchRequester: msg.todo
			})

			btnSearch.click();
			
		})

      }
    
    })