'use strict';

var request = require('request');

function CurrencyController(options) {
  this.node = options.node;
  var refresh = options.currencyRefresh || CurrencyController.DEFAULT_CURRENCY_DELAY;
  this.currencyDelay = refresh * 60000;
  this.exchangeRate = 0;
  //this.timestamp = Date.now();
}

CurrencyController.DEFAULT_CURRENCY_DELAY = 10;

CurrencyController.prototype.index = function(req, res, sym) {
   var self = this;
   var currentTime = Date.now();
   if (this.checkTime == null) {this.checkTime = 0};

   if (currentTime >= this.checkTime) {
     this.checkTime = currentTime + this.currencyDelay; 
    var url = 'https://api.coingecko.com/api/v3/simple/price?ids=zero&vs_currencies='
    //get USD/ZER
    request(url+'usd', function(err, response, body) {
        if (err) {
            self.node.log.error(err);
        }
        if (!err && response.statusCode == 200) {
            try {
                self.usd = JSON.parse(body).zero.usd;
            } catch(ee) {
                console.log(ee);
            }
        }
    });

    //get BTC/ZER
    request(url+'btc', function(err, response, body) {
        if (err) {
            self.node.log.error(err);
        }
        if (!err && response.statusCode == 200) {
            try {
                self.usd = JSON.parse(body).zero.btc;
            } catch(ee) {
                console.log(ee);
            }
        }
   });
 }

 res.jsonp({
     status: 200,
      data: {
         usd: self.usd,
         btc: self.btc
       }
   });
};

module.exports = CurrencyController;
