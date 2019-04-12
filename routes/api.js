const request = require('request');
const async = require('async');
const fs = require('fs');
const path = require("path");

var phantom = require('phantom');
var _ph, _page, _outObj;

const cheerio = require('cheerio');
const { Parser } = require('json2csv');
const MLB     = require('../models/MLB');

//git add .;git commit -am "mlb data concept";git push heroku master;

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
      //console.log('Product json == '+gameData);
      console.log(err)
      var jsonGameData = JSON.stringify(gameData);
      var jsonParseGameData = JSON.parse(JSON.stringify(gameData));
      const fields = ['homeTeam', 'awayTeam', 'homePitcherID', 'awayPitcherID', 'line', 'o/u'];
      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(jsonParseGameData);


      console.log('Product json == '+jsonGameData);
      console.log('Product csv == '+csv);
      // res.end(gameData);
      return res.json({'csv':csv});
    });


    //const url = 'https://sports.yahoo.com/mlb/scoreboard/';

    // phantom.create().then(function(ph) {
    //   ph.createPage().then(function(page) {
    //     page.property('customHeaders', {'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4'})
    //     page.open(url).then(function(status) {
    //       console.log('status == ' +status);
    //          setTimeout(function() { // give it some time to load
    //           page.property('content').then(function(content) {
    //             var $ = cheerio.load(content),
    //                     data = content,
    //                     json = [];

    //             //console.log('content == '+content);

    //             $('#scoreboard-group-2 ul li').filter(function() {
    //               console.log('scoreboard group == '+$(this));
    //             });
    //           });
    //             page.close();
    //             ph.exit();
    //          }, 5000);
    //     });
    //   });
    // });


  });

};
