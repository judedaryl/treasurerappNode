var express = require("express");
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
var models = require("../models");
var Expense = models.Expense;

module.exports = () => {
  /* GET users listing. */
  router.post("/create", function (req, res, next) {
    Expense.Create(req.body, (err, doc) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.send({
          ExpenseServerID: doc._id
        });
      }
    });
  });

  router.post('/convert', function(req, res, next) {
    console.log(req.body);
    res.send(req.body);
  });

  router.post("/sync", function (req, res, next) {
    var creator = 0;
    var docu = req.body.Data;
    Expense.find({CreatedBy: creator}, (err, serverDocs) => {
      serverDox = [];
      serverDocs.forEach(e => {
        serverDox.push({
          DateCreated: e.DateCreated.getTime().toString()
        });
      });

      function checkExist(dx) {
        return serverDox.some(el => el.DateCreated == dx.DateCreated);
      }

      documentsToAdd = docu.filter(d => !checkExist(d));
      documentsToUpdate = docu.filter(d => checkExist(d));

      // CREATE PROMISE = (0), UPDATE PROMISE = (1,2,3....)
      var CreateOrUpdatePromises = [];
      // CREATE PROMISE
      var CreatePromise = new Promise((resolve, reject) => {
        Expense.insertMany(documentsToAdd, (c_err, c_doc) => {
          if (err) reject(c_err);
          else resolve(c_doc);
        });
      });

      // PUSH CREATE PROMISE TO PROMISES ARRAY
      CreateOrUpdatePromises.push(CreatePromise);

      // UPDATE PROMISES
      documentsToUpdate.forEach(e => {

        var UpdatePromise = new Promise((resolve, reject) => {
          var objid = new ObjectID(e.ExpenseServerID);

          Expense.find({ _id: objid, CreatedBy: creator}, (err_, toUpdateDoc) => {
            if(!toUpdateDoc.Active) toSetActive = false;
            else toSetActive = e.Active;
            if(err_) reject(err_)
            else {
              Expense.findOneAndUpdate({
                _id: objid, CreatedBy: 0
              }, {
                $set: {
                  ExpenseValue: e.ExpenseValue,
                  ExpenseType: e.ExpenseType,
                  ExpenseDescription: e.ExpenseDescription,
                  Active: e.Active,
                  CreatedBy: e.CreatedBy,
                  DateCreated: e.DateCreated,
                  DateModified: e.DateModified
                }
              }, {
                new: true
              },
              (err, doc) => {
                console.log(doc)
                if (err) reject(err);
                else resolve(doc);
              });
            }
          });
        });
        CreateOrUpdatePromises.push(UpdatePromise);
      });

      Promise.all(CreateOrUpdatePromises).then(
        resolve => {
          // WHEN PROMISES ARE OK RETRIEVE LATEST DATA AND RETURN ALL
          Expense.find({CreatedBy: creator}, (err, everydoc) => {
            if (err) res.status(400).send({
              err: err
            });
            var everydocs_ = [];
            everydoc.forEach(e => {
              var data_ = {
                ExpenseServerID: e._id,
                ExpenseType: e.ExpenseType,
                ExpenseValue: e.ExpenseValue,
                ExpenseDescription: e.ExpenseDescription,
                CreatedBy: e.CreatedBy,
                Active: e.Active,
                DateCreated: e.DateCreated.getTime(),
                DateModified: e.DateModified.getTime()
              };
              everydocs_.push(data_);
            });
            res.status(200).send({
              Data: resolve
            });
          })
        },
        reject => {
          console.log(reject);
        }
      )
    });
  });

  router.post('/temp', (req,res) => {
    e=req.body.Data;
    Expense.findOneAndUpdate({DateCreated: e.DateCreated},
      {$set: {
        ExpenseValue: e.ExpenseValue,
        ExpenseType: e.ExpenseType,
        ExpenseDescription: e.ExpenseDescription,
        Active: e.Active,
        CreatedBy: e.CreatedBy,
        DateCreated: e.DateCreated,
        DateModified: e.DateModified
      }}, (err, doc) => {
        res.send(doc);
      })}
  );


  router.get("/superUpdate", function (req, res, next) {
    var promises = [];
    Expense.find({}, (err, doc) => {
      console.log(doc);
      doc.forEach(e => {
        promises.push(UpdateDis(e));
      });

      Promise.all(promises).then(
        resolve => console.log(resolve),
        reject => console.log(reject)
      );
    });
  });

  router.get("/get/all", function (req, res, next) {
    Expense.find({}, (err, doc) => {
      if (err) {
        res.status(400).send(err);
      } else {
        var datas = [];
        doc.forEach(e => {
          var data = {
            // ExpenseID: e.ExpenseID,
            ExpenseServerID: e._id,
            ExpenseType: e.ExpenseType,
            ExpenseValue: e.ExpenseValue,
            ExpenseDescription: e.ExpenseDescription,
            Active: e.Active,
            CreatedBy: e.CreatedBy,
            DateCreated: e.DateCreated.getTime(),
            DateModified: e.DateModified.getTime()
          };
          datas.push(data);
        });

        res.send({
          Data: datas
        });
      }
    });
  });

  router.get("/get/all/raw", function (req, res, next) {
    Expense.find({}, (err, doc) => {
      if (err) {
        res.status(400).send(err);
      } else {
        var datas = doc
        res.send({
          Data: datas
        });
      }
    });
  });

  router.post("/get/except", function (req, res, next) {
    Expense.find({
        DateCreated: {
          $nin: JSON.parse(req.body.DatesCreated)
        },
        CreatedBy: parseInt(req.body.CreatedBy)
      },
      (err, doc) => {
        if (err) {
          res.status(400).send(err);
        } else {
          var datas = [];
          doc.forEach(e => {
            var data = {
              // ExpenseID: e.ExpenseID,
              ExpenseServerID: e._id,
              ExpenseType: e.ExpenseType,
              ExpenseValue: e.ExpenseValue,
              ExpenseDescription: e.ExpenseDescription,
              CreatedBy: e.CreatedBy,
              DateCreated: e.DateCreated.getTime(),
              DateModified: e.DateModified.getTime(),
              Active: e.Active
            };
            datas.push(data);
          });
          console.log(datas);
          res.send({
            Data: datas
          });
        }
      }
    );
  });

  return router;
};

function UpdateDis(docx) {
  // Setting URL and headers for request
  var options = {
    url: "https://api.github.com/users/narenaryan",
    headers: {
      "User-Agent": "request"
    }
  };
  // Return new promise
  return new Promise((resolve, reject) => {
    // Do async job
    Expense.update({
        DateCreated: docx.DateCreated,
        DateModified: docx.DateModified
      }, {
        Active: true
      }, {
        new: true,
        multi: true
      },
      (err, doc) => {
        console.log(doc);
        if (err) reject(err);
        else resolve(doc);
      }
    );
  });
}