var express = require('express');
var router = express.Router();

var fetch = require('../dataFetch');
var rank = require('../projectionRanking');



/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});

/* GET draft page. This will return rankings in standard projection*/
router.get('/draft', function(req, res) {
	res.render('draft', { title: "Draft"});  
});

/* POST to draft page. Render a draft page with custom projection*/
router.post('/draft', function(req, res) {
	fetch.fetchPlayerData(function(data) {
		console.log(req.body);
		rank.addProjections(req.body, data, function(finalData) {
			console.log(finalData);
			res.render('draft', { title: "Draft", data: finalData });
		})  
    })  
});


module.exports = router;
