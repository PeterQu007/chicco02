import Person from './modules/Person';
//import Pages from './modules/Pages';

//console.log('Hello:', Pages.cgHomePage);

var p = new Person("Peter","red");

class adult extends Person {
	paytax(){
		console.log("paid tax!");
	}
}

