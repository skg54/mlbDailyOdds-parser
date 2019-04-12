const request = require('request');
const async = require('async');
const fs = require('fs');
const path = require("path");

var phantom = require('phantom');
var _ph, _page, _outObj;

const cheerio = require('cheerio');
const { Parser } = require('json2csv');
const MLB     = require('../models/MLB');

//git add .;git commit -am "mlb game overunder added";git push heroku master;

// Routes for authentication (signup, login, logout)
module.exports = function(app) {

  app.get('/', function(req, res, next) {
    res.redirect('/index');
  });
  
  app.get('/index', function(req, res, next) {
    res.render('index');
  });

  app.post('/scrape',function(req,res) {

    MLB.getAnalyticsForAdvantagePlayer(function(err, gameData) {
      console.log(err)
      var jsonParseGameData = JSON.parse(JSON.stringify(gameData));
      var fields = ['homeTeam', 'awayTeam', 'homePitcherID', 'awayPitcherID', 'line', 'overUnder'];
      var json2csvParser = new Parser({ fields });
      var csv = json2csvParser.parse(jsonParseGameData);

      // console.log('Product json == '+JSON.stringify(gameData));
      // console.log('Product csv == '+csv);
      return res.json({'csv':csv});
    });

  });

};
