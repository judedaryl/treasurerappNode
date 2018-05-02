var express = require('express');
var router = express.Router();
var request = require('request');
var models = require('../models');
var Expense = models.Expense;

// CommonJS
const implementjs = require('implement-js')
const implement = implementjs.default
const {
  Interface,
  type
} = implementjs

module.exports = () => {
  /* GET users listing. */
  router.post('/exam/parse', function (req, res, next) {


    var tEntity = [];
    i = 1;

    var promises = [];
    for (i = 1; i < 50; i++) {
      promises.push(initialize(i));
    }
    Promise.all(promises).then((result) => {
        for (x = 0; x < 50; x ++ ) {
          conso
          result[0].forEach(wew => {
            tEntity.push(wew);
          })
          if(x==49) {
            console.log(tEntity.length);
            res.send(tEntity);
          }

        }
      })
      .catch((e) => {
        // handle errors here
      });


  });

  router.post('/read/parse', (req, res, next) => {
    var u = req.body;
    var rEntities = [];
    u.forEach(e => {
      var q = e.question;
      var rEntity = new readingEntity(q.question, q.answer, q.choice);
      rEntities.push(rEntity);
    });
    res.send(rEntities);
  });

  return router;


}

function parseRead(readEntities) {
  var rEntities = [];
  readEntities.forEach(e => {
    var q = e.question;
    var rEntity = new readingEntity(q.question, q.answer, q.choice);
    rEntities.push(rEntity);
  });
  return rEntities;
}

function getReadingEntity(num, callback) {
  request("http://api.takenexam.com/reading/questions/id/2501d243-305c-4412-acd1-9e243a726d7e/2", {
      headers: {
        Authorization: "Bearer Dz111qqp8tlVZQos1CG3_QRTStKdG8t-qw9AtwFnXSwdTL1_zQgp-E9bvcP-dM6txy7b3gUhPNej7ltB1LqfJI0uu-gY4xR4X-1gJfvgpVruthZMYeuTHRLB_soeV7Zcyrts7_-sfA7OwOOn7wTsd7mKftkpv9gYDtz9zvgHjkVzZhW4a5umkUiHbPJG8vzyG_lk9Zv5-j8RyqzLvQfAiv5dpPcqQGq1pVzXAL9Y0u151LtqrEIbmZ_TagMl9H2mluqfKH-SQ75oYqhev-scYMPe13z4Y2PuKVedhA3ACs7HiaeQNI_6fMZH7xog9erRQMN2wgp9VyF48L6a31vmVg"
      },
    },
    (err, resp, body) => {
      callback(null, parseRead(JSON.parse(resp.body)));

    });
}
class readingEntity {
  constructor(question, answer, choice) {
    this.question = question;
    this.answer = answer;
    this.choice = choice;
  }
}

function initialize(num) {
  // Setting URL and headers for request
  var options = {
    url: 'https://api.github.com/users/narenaryan',
    headers: {
      'User-Agent': 'request'
    }
  };
  // Return new promise 
  return new Promise((resolve, reject) => {
    // Do async job
    request("http://api.takenexam.com/reading/questions/id/2501d243-305c-4412-acd1-9e243a726d7e/2", {
        headers: {
          Authorization: "Bearer Dz111qqp8tlVZQos1CG3_QRTStKdG8t-qw9AtwFnXSwdTL1_zQgp-E9bvcP-dM6txy7b3gUhPNej7ltB1LqfJI0uu-gY4xR4X-1gJfvgpVruthZMYeuTHRLB_soeV7Zcyrts7_-sfA7OwOOn7wTsd7mKftkpv9gYDtz9zvgHjkVzZhW4a5umkUiHbPJG8vzyG_lk9Zv5-j8RyqzLvQfAiv5dpPcqQGq1pVzXAL9Y0u151LtqrEIbmZ_TagMl9H2mluqfKH-SQ75oYqhev-scYMPe13z4Y2PuKVedhA3ACs7HiaeQNI_6fMZH7xog9erRQMN2wgp9VyF48L6a31vmVg"
        },
      },
      (err, resp, body) => {
        resolve(parseRead(JSON.parse(resp.body)));
      });
  });

}