//console

console.log("MLS Tax Result iframe");


$(function(){

	var linkReadyTimer = setInterval(checkLink, 100);


	function checkLink(){


		var taxDetailsLink = $('#grid a')[0];

		console.log(taxDetailsLink);

		if (taxDetailsLink){

			clearInterval(linkReadyTimer);

			taxDetailsLink.click();

		}
	

	}
	

})

