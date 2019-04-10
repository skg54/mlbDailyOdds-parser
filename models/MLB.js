const mysql = require('mysql2');
const async = require('async');
const fs = require('fs');

const phantom = require('phantom');
const cheerio = require('cheerio');

var _ph, _page, _outObj;


function MLB() 
{

}


MLB.getAnalyticsForAdvantagePlayer = function(callback) {

    var dateObj = new Date();

    var month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
    // make date 2 digits
    var date = ('0' + dateObj.getDate()).slice(-2);
    // get 4 digit year
    var year = dateObj.getFullYear();
    var dateForUrl = year + month + date;

    var url = 'http://www.espn.com/mlb/scoreboard/_/date/'+dateForUrl;

    phantom
      .create()
      .then(ph => {
        _ph = ph;
        return _ph.createPage();
      })
      .then(page => {
        _page = page;
        return _page.open(url);
      })
      .then(status => {
        console.log(status);
        return _page.property('content');
      })
      .then(content => {

        var gameArray = new Array ();
        var $ = cheerio.load(content);

        $('.scoreboard-wrapper').filter(function() {
          var lineScore = $(this).find('.sb-linescore');
          //console.log('lineScore == '+lineScore);

          var line = $(this).find('.line').text();

          var awayTeam = $(this).find('#teams').find('.away .sb-team-abbrev');
          var homeTeam = $(this).find('#teams').find('.home .sb-team-abbrev');

          var awayPitcher = $(this).find('#teams').find('.away .pitchers').find('a').attr('href');
          var homePitcher = $(this).find('#teams').find('.home .pitchers').find('a').attr('href');

          var awayPitcherID = '';
          var homePitcherID = '';
          if (awayPitcher) 
          {
            awayPitcherID += awayPitcher.substring(awayPitcher.lastIndexOf("/") + 1, awayPitcher.length);
            homePitcherID += homePitcher.substring(homePitcher.lastIndexOf("/") + 1, homePitcher.length);
          }


          // console.log('line == '+line);
          // console.log('awayTeam == '+awayTeam.text());
          // console.log('homeTeam == '+homeTeam.text());
          // console.log('awayPitcherID == '+awayPitcherID);
          // console.log('homePitcherID == '+homePitcherID);

          if (line.length > 1) 
          {
              var gameObj = {
                'homeTeam': homeTeam.text(),
                'awayTeam': awayTeam.text(),
                'homePitcherID': homePitcherID,
                'awayPitcherID': awayPitcherID,
                'line': line
              };
              gameArray.push(gameObj);
          }

        });

        _page.close();
        _ph.exit();

        return callback(null, gameArray);
      })
    .catch(e => console.log(e));

    // phantom.create().then(function(ph) {
    //   ph.createPage().then(function(page) {
    //     page.property('customHeaders', {'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4'})
    //     page.open(url).then(function(status) {
    //       console.log('status == ' +status);
    //          setTimeout(function() { // give it some time to load
    //           page.property('content').then(function(content) {
    //             var $ = cheerio.load(content),
    //                     data = content;

    //             $('.scoreboard-wrapper').filter(function() {
    //               var lineScore = $(this).find('.sb-linescore');
    //               //console.log('lineScore == '+lineScore);

    //               var line = $(this).find('.line').text();

    //               var awayTeam = $(this).find('#teams').find('.away .sb-team-abbrev');
    //               var homeTeam = $(this).find('#teams').find('.home .sb-team-abbrev');

    //               var awayPitcher = $(this).find('#teams').find('.away .pitchers').find('a').attr('href');
    //               var homePitcher = $(this).find('#teams').find('.home .pitchers').find('a').attr('href');

    //               var awayPitcherID = awayPitcher.substring(awayPitcher.lastIndexOf("/") + 1, awayPitcher.length);
    //               var homePitcherID = homePitcher.substring(homePitcher.lastIndexOf("/") + 1, homePitcher.length);


    //               // console.log('line == '+line);

    //               // console.log('awayTeam == '+awayTeam.text());
    //               // console.log('homeTeam == '+homeTeam.text());

    //               // console.log('awayPitcherID == '+awayPitcherID);
    //               // console.log('homePitcherID == '+homePitcherID);

    //               json.push({
    //                 'homeTeam': homeTeam,
    //                 'awayTeam': awayTeam,
    //                 'homePitcherID': homePitcherID,
    //                 'awayPitcherID': awayPitcherID,
    //                 'line': line
    //               });

    //             });
    //             // var bracketData = JSON.stringify(json, null, 4);
    //             // callback(bracketData);

    //             page.close();
    //             ph.exit();
    //             //var gameData = JSON.stringify(json);
    //             return callback(null, json);
    //             // console.log('Product json == '+JSON.stringify(json));
    //           });


    //          }, 5000);
    //     });
    //   });
    // });
}


module.exports = MLB;
