//Location class

class PostLocation{

	constructor(){

		this.form= $('form.picker');
		this.vancouver = $('input[value="1"]');
		this.northShore = $('input[value="2"]');
		this.burnabyNewWest = $('input[value="3"]');
		this.deltaSurreyLangley = $('input[value="4"]');
		this.tricitiesPittMaple = $('input[value="5"]');
		this.richmond = $('input[value="6"]');
		
		this.btnContinue = $('button[value="Continue"]');

		this.selectType();
	}

	selectType(){

		this.deltaSurreyLangley.prop('checked', true);
		this.form.submit();
		
	}
}

export default PostLocation;

	