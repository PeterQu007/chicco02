//go back to previous URL
//get the backupCurrentURL
//redirect to the backupCurrentURL

$(function(){

	var msg = {from: 'goBackPrevURL', subject: 'fetchBackupCurrentURL'}

	chrome.runtime.sendMessage(

		msg, 

		function(response){
			
			var backupURL = response.backupCurURL;

			if(backupURL){
				//jquery rediret
				//https://stackoverflow.com/questions/503093/how-to-redirect-to-another-webpage-in-javascript-jquery
				window.location.replace(response.backupCurURL);
			}else{
				window.history.back();
			}
		} 

	)
})