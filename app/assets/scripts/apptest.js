import Person from './modules/Person';

console.log('Hello:', Person);

var p = new Person("Peter","red");

class adult extends Person {
	paytax(){
		console.log("paid tax!");
	}
}

console.log(p);

console.log(p.greet());

var a = new adult("Peter","blue");

console.log(a.paytax());
console.log(a.greet());

