export class AppSuccess {
	message: string;
  
	constructor(message: string) {
	  this.message = message;
	  this.display();
	}
  
	display() {
	    alert(this.message); 
	}
  }
  