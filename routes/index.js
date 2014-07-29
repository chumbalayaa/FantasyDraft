var express = require('express');
var router = express.Router();

var fetch = require('../dataFetch');


/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});

/* GET draft page. This will return rankings in standard projection*/
router.get('/draft', function(req, res) {
	fetch.fetchPlayerData(function(data) {
	    res.render('index', { title: data.QBObject });
    })   
});

/* POST to draft page. Render a draft page with custom projection*/
router.post('/draft', function(req, res) {
    res.send(dataFetch.playerObject);
});

module.exports = router;
