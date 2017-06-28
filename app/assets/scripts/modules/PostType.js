//Posting Type

class PostType{

	constructor(){

		this.form = $('form.picker');
		this.jobOffered = $('input[value="jo"]');
		this.gigOffered = $('input[value="go"]');
		this.serviceOffered = $('input[value="so"]');
		this.btnContinue = $('button[value="Continue"]');

		this.selectType();
	}

	selectType(){

		this.serviceOffered.prop('checked', true);
		this.form.submit();
		
	}
}

export default PostType;