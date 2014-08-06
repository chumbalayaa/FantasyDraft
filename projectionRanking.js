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
		//Quaterbacks TODO: grab sack information
		for (var i=0; i < playerObject.QBObject.length; i++) {
            var newTotal = 0,
            qb = playerObject.QBObject[i];
 
            newTotal += parseFloat(req.pointsPerPassingTD) * parseFloat(qb.passing_tds);
            newTotal -= parseFloat(req.pointsPerInterceptionThrown) * parseFloat(qb.interceptions);
            newTotal += parseFloat(req.pointsPerPassingYard) * parseFloat(qb.passing_yards);
            newTotal += parseFloat(req.pointsPerRushingTD) * parseFloat(qb.rushing_tds);
            newTotal += parseFloat(req.pointsPerRushingYard) * parseFloat(qb.rushing_yards);
            newTotal -= parseFloat(req.pointsPerFumble) * parseFloat(qb.fumbles_lost);
            qb.custom_projection = newTotal;
		}
		//Runningbacks
		for (var i=0; i < playerObject.RBObject.length; i++) {
            var newTotal = 0,
            rb = playerObject.RBObject[i];
 
            newTotal += parseFloat(req.pointsPerRushingTD) * parseFloat(rb.rushing_tds);
            newTotal += parseFloat(req.pointsPerRushingYard) * parseFloat(rb.rushing_yards);
            newTotal += parseFloat(req.pointsPerReception) * parseFloat(rb.receptions);
            newTotal += parseFloat(req.pointsPerReceivingYard) * parseFloat(rb.receiving_yards);
            newTotal += parseFloat(req.pointsPerReceivingTD) * parseFloat(rb.receiving_tds);
            newTotal -= parseFloat(req.pointsPerFumble) * parseFloat(rb.fumbles_lost);
            rb.custom_projection = newTotal;
		}
		//Receivers
		for (var i=0; i < playerObject.WRObject.length; i++) {
            var newTotal = 0,
            wr = playerObject.WRObject[i];

            newTotal += parseFloat(req.pointsPerRushingTD) * parseFloat(wr.rushing_tds);
            newTotal += parseFloat(req.pointsPerRushingYard) * parseFloat(wr.rushing_yards);
            newTotal += parseFloat(req.pointsPerReception) * parseFloat(wr.receptions);
            newTotal += parseFloat(req.pointsPerReceivingYard) * parseFloat(wr.receiving_yards);
            newTotal += parseFloat(req.pointsPerReceivingTD) * parseFloat(wr.receiving_tds);
            newTotal -= parseFloat(req.pointsPerFumble) * parseFloat(wr.fumbles_lost);
            wr.custom_projection = newTotal;
		}
		//Tight Ends
		for (var i=0; i < playerObject.TEObject.length; i++) {
            var newTotal = 0,
            te = playerObject.TEObject[i];
            
            newTotal += parseFloat(req.pointsPerReception) * parseFloat(wr.receptions);
            newTotal += parseFloat(req.pointsPerReceivingYard) * parseFloat(wr.receiving_yards);
            newTotal += parseFloat(req.pointsPerReceivingTD) * parseFloat(wr.receiving_tds);
            newTotal -= parseFloat(req.pointsPerFumble) * parseFloat(wr.fumbles_lost);
            te.custom_projection = newTotal;
		}
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