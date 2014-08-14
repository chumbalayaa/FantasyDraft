//This file will take in a JSON object of all of
//the players. It will then calculate (given a
//set of rules in the POST request parameter)
//their new projected fantasy points for the season.
//Then, it will calculate their fantasyPositionIndex (FPI)
//which will be used to determine their final ranking. 
//These new attributes will simply be added to the existing
//JSON object that is inputted. 
//Stupid change

function addProjections(req, playerObject, done) {
	doneProj = false;
	doneFPI = false;

	function finish(playerObject) {
		if (doneProj && doneFPI) {
            var testObj = playerObject.QBObject.concat(playerObject.RBObject);
            testObj = testObj.concat(playerObject.WRObject);
            testObj = testObj.concat(playerObject.TEObject);
            testObj = testObj.concat(playerObject.KObject);
            testObj = testObj.concat(playerObject.DObject);
            console.log(sortByKey(testObj, 'FPI'));
			done(playerObject);
		}
	}

	function sortByKey(array, key) {
        return array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? 1 : ((x > y) ? -1 : 0));
        });
    }


    //This function will add a customProjection attribute to the input JSON (playerObject).
	function addCustomProjections(req, playerObject, callback) {
		//Quaterbacks TODO: grab sack information
		for (var i=0; i < playerObject.QBObject.length; i++) {
            var newTotal = 0,
            qb = playerObject.QBObject[i];
 
            newTotal += parseFloat(req.pointsPerPassingTD) * parseFloat(qb.passing_tds);
            newTotal -= parseFloat(req.pointsLostPerInterceptionThrown) * parseFloat(qb.interceptions);
            newTotal += parseFloat(req.pointsPerPassingYard) * parseFloat(qb.passing_yards);
            newTotal += parseFloat(req.pointsPerRushingTD) * parseFloat(qb.rushing_tds);
            newTotal += parseFloat(req.pointsPerRushingYard) * parseFloat(qb.rushing_yards);
            newTotal -= parseFloat(req.pointsLostPerFumble) * parseFloat(qb.fumbles_lost);
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
            newTotal -= parseFloat(req.pointsLostPerFumble) * parseFloat(rb.fumbles_lost);
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
            newTotal -= parseFloat(req.pointsLostPerFumble) * parseFloat(wr.fumbles_lost);
            wr.custom_projection = newTotal;
		}
		//Tight Ends
		for (var i=0; i < playerObject.TEObject.length; i++) {
            var newTotal = 0,
            te = playerObject.TEObject[i];

            newTotal += parseFloat(req.pointsPerReception) * parseFloat(te.receptions);
            newTotal += parseFloat(req.pointsPerReceivingYard) * parseFloat(te.receiving_yards);
            newTotal += parseFloat(req.pointsPerReceivingTD) * parseFloat(te.receiving_tds);
            newTotal -= parseFloat(req.pointsLostPerFumble) * parseFloat(te.fumbles_lost);
            te.custom_projection = newTotal;
		}
        //Kickers
        for (var i=0; i < playerObject.KObject.length; i++) {
            var newTotal = 0,
            k = playerObject.KObject[i];

            var fg1_39 = k.fg1_39.split("/");
            var fg40_49 = k.fg40_49.split("/");
            var fg50 = k.fg50.split("/");
            var xpts = k.xpts.split("/");
            var diff = parseFloat(xpts[1]) - parseFloat(xpts[0]);

            newTotal += parseFloat(req.fieldGoalZeroToThirtyNine) * parseFloat(fg1_39[0]);
            newTotal += parseFloat(req.fieldGoalFortyToFortyNine) * parseFloat(fg40_49[0]);
            newTotal += parseFloat(req.fieldGoalFiftyPlus) * parseFloat(fg50[0]);
            newTotal += parseFloat(req.pointsPerPAT) * parseFloat(k.xpts[0]);
            newTotal -= parseFloat(req.pointsLostPerMissedFG) * diff;
            k.custom_projection = newTotal;
        }
        //D/ST
        for (var i=0; i < playerObject.DObject.length; i++) {
            var newTotal = 0,
            d = playerObject.DObject[i];

            var pointsAgainstPerGame = parseFloat(d.points_against) / 16.0;

            newTotal += parseFloat(req.pointsPerSack) * parseFloat(d.sacks);
            newTotal += parseFloat(req.pointsPerInterception) * parseFloat(d.ints);
            newTotal += parseFloat(req.pointsPerFumbleRecovery) * parseFloat(d.fumble_recoveries);
            newTotal += parseFloat(req.pointsPerReturnTD) * parseFloat(d.tds);

            switch (true) {
                case (pointsAgainstPerGame == 0):
                    newTotal += parseFloat(req.zeroPointsAllowed) * 16;
                    break;
                case (pointsAgainstPerGame <= 6):
                    newTotal += parseFloat(req.oneToSixPointsAllowed) * 16;
                    break;
                case (pointsAgainstPerGame <= 13):
                    newTotal += parseFloat(req.sevenToThirteenPointsAllowed) * 16;
                    break;
                case (pointsAgainstPerGame <= 17):
                    newTotal += parseFloat(req.fourteenToSeventeenPointsAllowed) * 16;
                    break;
                case (pointsAgainstPerGame <= 27):
                    newTotal += parseFloat(req.eighteenToTwentySevenPointsAllowed) * 16;
                    break;
                case (pointsAgainstPerGame <= 34):
                    newTotal += parseFloat(req.twentyEightToThirtyFourPointsAllowed) * 16;
                    break;
                case (pointsAgainstPerGame <= 45):
                    newTotal += parseFloat(req.thirtyFiveToFortyFivePointsAllowed) * 16;
                    break;
                default:
                    newTotal += parseFloat(req.fortyFivePlusPlusPointsAllowed) * 16;
                    break;
            }

            d.custom_projection = newTotal;
        }
        doneProj = true;
        callback(req, playerObject, finish);        
	}


    //This function will add fpi attribute to the input JSON (playerObject).
	function addFPI(req, playerObject, callback) {
        //Number of Starters
        numQBs = parseFloat(req.numQuarterbacks) * parseFloat(req.numTeams);
        numRBs = parseFloat(req.numRunningBacks) * parseFloat(req.numTeams);
        numWRs = parseFloat(req.numWideReceivers) * parseFloat(req.numTeams);
        numTEs = parseFloat(req.numTightEnds) * parseFloat(req.numTeams);
        numKs = parseFloat(req.numKickers) * parseFloat(req.numTeams);
        numDs = parseFloat(req.numDefense) * parseFloat(req.numTeams);

        //Quaterbacks
        QB_FPI_BASE = sortByKey(playerObject.QBObject, 'custom_projection')[numQBs-1].custom_projection;
        for (var i=0; i < playerObject.QBObject.length; i++) {
            qb = playerObject.QBObject[i];
            FPI = qb.custom_projection - QB_FPI_BASE;
            qb.FPI = FPI;
		}

		//Runningbacks
        RB_FPI_BASE = sortByKey(playerObject.RBObject, 'custom_projection')[numRBs-1].custom_projection;
        for (var i=0; i < playerObject.RBObject.length; i++) {
            rb = playerObject.RBObject[i];
            FPI = rb.custom_projection - RB_FPI_BASE;
            rb.FPI = FPI;
		}

		//Wide Receivers
        WR_FPI_BASE = sortByKey(playerObject.WRObject, 'custom_projection')[numWRs-1].custom_projection;
        for (var i=0; i < playerObject.WRObject.length; i++) {
            wr = playerObject.WRObject[i];
            FPI = wr.custom_projection - WR_FPI_BASE;
            wr.FPI = FPI;
		}

		//Tight Ends
        TE_FPI_BASE = sortByKey(playerObject.TEObject, 'custom_projection')[numTEs-1].custom_projection;
        for (var i=0; i < playerObject.TEObject.length; i++) {
            te = playerObject.TEObject[i];
            FPI = te.custom_projection - TE_FPI_BASE;
            te.FPI = FPI;
		} 

        //Kickers
        K_FPI_BASE = sortByKey(playerObject.KObject, 'custom_projection')[numKs-1].custom_projection;
        for (var i=0; i < playerObject.KObject.length; i++) {
            k = playerObject.KObject[i];
            FPI = k.custom_projection - K_FPI_BASE;
            k.FPI = FPI;
        } 

        //D/ST
        D_FPI_BASE = sortByKey(playerObject.DObject, 'custom_projection')[numDs-1].custom_projection;
        for (var i=0; i < playerObject.DObject.length; i++) {
            d = playerObject.DObject[i];
            FPI = d.custom_projection - D_FPI_BASE;
            d.FPI = FPI;
        }        

        doneFPI = true;
        callback(playerObject);
	}

	addCustomProjections(req, playerObject, addFPI);
}


module.exports = {
    addProjections: addProjections
};





