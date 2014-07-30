//This file will take in a JSON object of all of
//the players. It will then calculate (given a
//set of rules in the POST request parameter)
//their new projected fantasy points for the season.
//Then, it will calculate their fantasyPositionIndex (FPI)
//which will be used to determine their final ranking. 
//These new attributes will simply be added to the existing
//JSON object that is inputted. 


function addProjections(req, playerObject, done) {
	doneProj = false;
	doneFPI = false;

	function finish(playerObject) {
		if (doneProj && doneFPI) {
			done(playerObject);
		}
	}

    //This function will add a customProjection attribute
    //to the input JSON (playerObject).
	function addCustomProjections(req, playerObject, callback) {
        console.log("Custom Projection");
        doneProj = true;
        callback(req, playerObject, finish);        
	}

    //This function will add fpi attribute to the input
    //JSON (playerObject).
	function addFPI(req, playerObject, callback) {
        console.log("Adding FPI");
        doneFPI = true;
        callback(playerObject);
	}

	addCustomProjections(req, playerObject, addFPI);
}


module.exports = {
    addProjections: addProjections
};