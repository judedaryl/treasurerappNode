var express = require('express');
var router = express.Router();

var models = require('../models');
var Expense = models.Expense;
module.exports = () => {
  /* GET users listing. */
  router.post('/create', function (req, res, next) {
    Expense.Create(req.body, (err, doc) => {
      if (err) {
        res.status(400).send(err)
      } else {
        res.send({
          ExpenseServerID: doc._id
        });
      }
    });
  });

  router.get('/get/all', function (req, res, next) {
    Expense.find({}, (err, doc) => {
      if (err) {
        res.status(400).send(err)
      } else {
        var datas = [];
        doc.forEach(
          e => {
            var data = {
              ExpenseID: e.ExpenseID,
              ExpenseServerID: e._id,
              ExpenseType: e.ExpenseType,
              ExpenseValue: e.ExpenseValue,
              ExpenseDescription: e.ExpenseDescription,
              CreatedBy: e.CreatedBy,
              DateCreated: e.DateCreated.getTime(),
              DateModified: e.DateModified.getTime(),
            }
            datas.push(data);
          });

        res.send({
          Data: datas
        });
      }
    })
  });

  router.post('/get/except', function (req, res, next) {
    Expense.find({
      DateCreated: {$nin: JSON.parse(req.body.DatesCreated)}, 
      CreatedBy: parseInt(req.body.CreatedBy)
    }, (err, doc) => {
      if (err) {
        res.status(400).send(err)
      } else {
        var datas = [];
        doc.forEach(
          e => {
            var data = {
              ExpenseID: e.ExpenseID,
              ExpenseServerID: e._id,
              ExpenseType: e.ExpenseType,
              ExpenseValue: e.ExpenseValue,
              ExpenseDescription: e.ExpenseDescription,
              CreatedBy: e.CreatedBy,
              DateCreated: e.DateCreated.getTime(),
              DateModified: e.DateModified.getTime(),
            }
            datas.push(data);
          });

        res.send({
          Data: datas
        });
      }
    })
  });

  return router;


}