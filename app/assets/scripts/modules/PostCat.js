//Post Category

class PostCat{

	constructor(){

		this.form = $('form.picker');
		this.automotiveServices = $('input[value="106"]');
		this.computerServices = $('input[value="76"]');
		this.realEstateServices = $('input[value="105"]');
		this.btnContinue = $('button[value="Continue"]');

		this.selectType();
	}

	selectType(){

		this.realEstateServices.prop('checked', true);
		this.form.submit();
		
	}
}

export default PostCat;