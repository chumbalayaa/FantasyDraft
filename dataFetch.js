//This file handles the fetching of data from fantasypros.com
//The main point of this file is to populate the playerObject variable
//which contains all the player information (as of now it's only QB, 
//RB, WR, and TE).

var request = require('request'),
    jsdom = require('jsdom');

function fetchPlayerData(done) {
    var playerObject = {};

    function gotData() {
        if (playerObject.QBObject && playerObject.RBObject && playerObject.WRObject && playerObject.TEObject) {
            done(playerObject)
        }
    }

    function qbReady(errors, window) {
	    var $ = window.$;
	    var table = $("tbody:gt(0)").hide();
	    var QBObject = [];
	    table.find("tr").each(function (i, el) {
	        var $tds = $(this).find('td');
	        QBObject.push({
	    	    'position': 'qb',
                'name': $tds.eq(0).text(),
                'passing_attempts': $tds.eq(1).text(),
                'completions': $tds.eq(2).text(),
                'passing_yards': $tds.eq(3).text().replace(',',''),
                'passing_tds': $tds.eq(4).text(),
                'interceptions': $tds.eq(5).text(),
                'rushing_attempts': $tds.eq(6).text(),
                'rushing_yards': $tds.eq(7).text().replace(',',''),
                'rushing_tds': $tds.eq(8).text(),
                'fumbles_lost': $tds.eq(9).text(),
                'standard_projection': $tds.eq(10).text().replace(',','')
		    });
	    });
	    playerObject.QBObject = QBObject;
	    gotData();
    }

    function rbReady(errors, window) {
	    var $ = window.$;
	    var table = $("tbody:gt(0)").hide();
	    var RBObject = [];
	    table.find("tr").each(function (i, el) {
	        var $tds = $(this).find('td');
	        RBObject.push({
	    	    'position': 'rb',
                'name': $tds.eq(0).text(),
                'rushing_attempts': $tds.eq(1).text().replace(',',''),
                'rushing_yards': $tds.eq(2).text().replace(',',''),
                'rushing_tds': $tds.eq(3).text(),
                'receptions': $tds.eq(4).text().replace(',',''),
                'receiving_yards': $tds.eq(5).text().replace(',',''),
                'receiving_tds': $tds.eq(6).text(),
                'fumbles_lost': $tds.eq(7).text(),
                'standard_projection': $tds.eq(8).text().replace(',','')
		    });
	    });
	    playerObject.RBObject = RBObject;
	    gotData();
    }

    function wrReady(errors, window) {
	    var $ = window.$;
	    var table = $("tbody:gt(0)").hide();
	    var WRObject = [];
	    table.find("tr").each(function (i, el) {
	        var $tds = $(this).find('td');
	        WRObject.push({
	    	    'position': 'wr',
                'name': $tds.eq(0).text(),
                'rushing_attempts': $tds.eq(1).text().replace(',',''),
                'rushing_yards': $tds.eq(2).text().replace(',',''),
                'rushing_tds': $tds.eq(3).text(),
                'receptions': $tds.eq(4).text().replace(',',''),
                'receiving_yards': $tds.eq(5).text().replace(',',''),
                'receiving_tds': $tds.eq(6).text(),
                'fumbles_lost': $tds.eq(7).text(),
                'standard_projection': $tds.eq(8).text().replace(',','')
		    });
	    });
	    playerObject.WRObject = WRObject;
	    gotData();
    }

    function teReady(errors, window) {
	    var $ = window.$;
	    var table = $("tbody:gt(0)").hide();
	    var TEObject = [];
	    table.find("tr").each(function (i, el) {
	        var $tds = $(this).find('td');
	        TEObject.push({
	    	    'position': 'te',
                'name': $tds.eq(0).text(),
                'receptions': $tds.eq(1).text().replace(',',''),
                'receiving_yards': $tds.eq(2).text().replace(',',''),
                'receiving_tds': $tds.eq(3).text(),
                'fumbles_lost': $tds.eq(4).text(),
                'standard_projection': $tds.eq(5).text().replace(',','')
		    });
	    });
	    playerObject.TEObject = TEObject;
	    gotData();
    }

    /*function kReady(errors, window) {
	    var $ = window.$;
	    var table = $("tbody:gt(0)").hide();
	    var KObject = [];
	    table.find("tr").each(function (i, el) {
	        var $tds = $(this).find('td');
	        KObject.push({
	    	    'position': 'k',
                'name': $tds.eq(0).text(),
                'fg': $tds.eq(1).text(),
                'fga': $tds.eq(2).text(),
                'xpts': $tds.eq(3).text(),
                'standard_projection': $tds.eq(4).text()
		    });
	    });
	    playerObject.KObject = KObject;
	    gotData();
    }*/

    jsdom.env({
	    url: 'http://www.fantasypros.com/nfl/projections/qb.php',
	    scripts: ["http://code.jquery.com/jquery.js"],
    	done: qbReady
    });

    jsdom.env({
        url: 'http://www.fantasypros.com/nfl/projections/rb.php',
        scripts: ["http://code.jquery.com/jquery.js"],
        done: rbReady 
    });

    jsdom.env({
        url: 'http://www.fantasypros.com/nfl/projections/wr.php',
        scripts: ["http://code.jquery.com/jquery.js"],
        done: wrReady 
    });

    jsdom.env({
        url: 'http://www.fantasypros.com/nfl/projections/te.php',
        scripts: ["http://code.jquery.com/jquery.js"],
        done: teReady 
    });

    /*jsdom.env({
        url: 'http://www.fantasypros.com/nfl/projections/k.php',
        scripts: ["http://code.jquery.com/jquery.js"],
        done: kReady 
    });*/
}

module.exports = {
    fetchPlayerData: fetchPlayerData
};