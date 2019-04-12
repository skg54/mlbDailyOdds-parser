const mysql = require('mysql2');
const async = require('async');
const fs = require('fs');

const phantom = require('phantom');
const cheerio = require('cheerio');

var _ph, _page, _outObj, _espn;


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
        _page.property('customHeaders', {'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4'});
        return _page.open(url);
      })
      .then(() => {
          return _page.includeJs('https://code.jquery.com/jquery-3.1.1.min.js');
      })
      .then(status => {
        console.log(status);
        return _page.property('content');
      })
      .then(content => {
        
        var scoreboardData = _page.evaluate(function() {
            return window.espn.scoreboardData;
        })
        .then ( espn => { 
          _espn = espn;
          //console.log('overUnder == '+JSON.stringify(espn.events[1].competitions[0].odds[0].overUnder))

          var gameArray = new Array ();
          var overUnderArray = new Array ();
          var $ = cheerio.load(content);

          var l;
          for (l = 0; l < _espn.events.length; l++) {

            var gameEvt = _espn.events[l]

            if(gameEvt.competitions[0].hasOwnProperty('odds'))
            {
              var overUnder = gameEvt.competitions[0].odds[0].overUnder;
              console.log('overUnder == '+overUnder);
              overUnderArray.push(overUnder);
            }
          }

          var i = 0;
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

            if(line.length > 1)
            {
                var gameObj = {
                  'homeTeam': homeTeam.text(),
                  'awayTeam': awayTeam.text(),
                  'homePitcherID': homePitcherID,
                  'awayPitcherID': awayPitcherID,
                  'line': line,
                  'o/u': overUnderArray[i]
                };
                gameArray.push(gameObj);
            }
            i++;

          });

          _page.close();
          _ph.exit();

          return callback(null, gameArray);
        });
        
      })
    .catch(e => console.log(e));

    // phantom.create().then(function(ph) {
    //   ph.createPage().then(function(page) {
    //     //page.property('customHeaders', {'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4'});

    //     //page.settings.userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4';
    //     //page.property('viewportSize', {width: 480, height: 800});
    //     //page.property('viewportSize', {width: 1920, height: 1080});
    //     _page = page;

    //     _page.open(url).then(function(status) {
    //       console.log('status == ' +status);
    //          setTimeout(function() { // give it some time to load

    //           _page.property('content').then(function(content) {
    //             var gameArray = new Array ();
    //             var $ = cheerio.load(content);

    //             $('.scoreboard-wrapper').filter(function() {
    //               var lineScore = $(this).find('.sb-linescore');
    //               //console.log('lineScore == '+lineScore);

    //               var line = $(this).find('.line').text();

    //               var awayTeam = $(this).find('#teams').find('.away .sb-team-abbrev');
    //               var homeTeam = $(this).find('#teams').find('.home .sb-team-abbrev');

    //               var awayPitcher = $(this).find('#teams').find('.away .pitchers').find('a').attr('href');
    //               var homePitcher = $(this).find('#teams').find('.home .pitchers').find('a').attr('href');

    //               var awayPitcherID = '';
    //               var homePitcherID = '';
    //               if (awayPitcher) 
    //               {
    //                 awayPitcherID += awayPitcher.substring(awayPitcher.lastIndexOf("/") + 1, awayPitcher.length);
    //                 homePitcherID += homePitcher.substring(homePitcher.lastIndexOf("/") + 1, homePitcher.length);
    //               }

    //               if (line.length > 1) 
    //               {
    //                   var gameObj = {
    //                     'homeTeam': homeTeam.text(),
    //                     'awayTeam': awayTeam.text(),
    //                     'homePitcherID': homePitcherID,
    //                     'awayPitcherID': awayPitcherID,
    //                     'line': line
    //                   };
    //                   gameArray.push(gameObj);
    //               }

    //             });
    //             // var bracketData = JSON.stringify(json, null, 4);
    //             // callback(bracketData);

    //             page.close();
    //             ph.exit();
    //             //var gameData = JSON.stringify(json);
    //             return callback(null, gameArray);
    //             // console.log('Product json == '+JSON.stringify(json));
    //           });

    //           // _page.evaluate(function() {
    //           // });


    //          }, 5000);
    //     });
    //   });
    // });
}


module.exports = MLB;
