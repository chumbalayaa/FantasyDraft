var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/draft', function(req, res) {
  res.render('index', { title: 'Draft' });
});

/* POST to draft page. */
router.post('/draft/:dataObj?', function(req, res) {
  res.send("This is the draft page with data = " + req.params.dataObj);
});

module.exports = router;
