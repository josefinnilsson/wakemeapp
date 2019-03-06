'use strict';

var bodyParser = require('body-parser');
var express = require('express');
var request = require('request');

var app = express();
var router = express.Router();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(router);
app.set('port', process.env.PORT || 3001);

app.listen(app.get('port'), function () {
    console.log('Listening on ' + app.get('port'));
});

router.get('/test', function (req, res, next) {
    var names = [{ name: "test1" }, { name: "test2" }, { name: "test3" }];
    res.json(names);
});

module.exports = router;