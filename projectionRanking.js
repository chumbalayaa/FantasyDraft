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
	function addCustomProjections(req, playerObject) {
        console.log("Custom Projection");
        doneProj = true;
        addFPI(req, playerObject);
	}

    //This function will add fpi attribute to the input
    //JSON (playerObject).
	function addFPI(req, playerObject) {
        console.log("Adding FPI");
        doneFPI = true;
        finish(playerObject);
	}

	addCustomProjections(req, playerObject);
}


module.exports = {
    addProjections: addProjections
};