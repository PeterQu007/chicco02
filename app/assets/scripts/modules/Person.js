//ES5 syntax
/*
function Person(fullName, favColor){
	this.name = fullName;
	this.favoriteColor = favColor;
	this.greet=function(){
	console.log("hello object, my name is " + this.name + "and my color is " + this.favoriteColor);
}

}
*/
//import $ from 'jquery';

//ES6 syntax
class Person{

	constructor(fullName, favColor){
		this.name = fullName;
		this.favoriteColor = favColor;
		this.checkbox = $('input[type=checkbox]');
		this.events();
	}

	events(){
		//var self = this;
		//self.checkbox.on("click",console.log("hello checkbox!"));

		$('input[type="checkbox"]').change(function(){
    var id=$(this).attr('id');
    var something = $(this).attr('data-something');
    var value=$(this).val();
    if ($(this).prop('checked')){
        // do something
        alert('id:'+id+' something:'+something+' value:'+value);
        }
  });
	}

	greet(){
		console.log("hello object, my name is " + this.name + "and my color is " + this.favoriteColor);
	}
}


module.exports=Person;