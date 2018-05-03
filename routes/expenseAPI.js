var express = require("express");
var router = express.Router();

var models = require("../models");
var Expense = models.Expense;

var server = [
  {
    _id: "5aea95d5fa9ac803bad12003",
    ExpenseType: 0,
    ExpenseValue: 180,
    ExpenseDescription: "Daryl Expenses",
    CreatedBy: 0,
    DateCreated: "2018-05-01T07:37:20.473Z",
    DateModified: "2018-05-01T07:37:20.473Z",
    Active: true,
    __v: 0
  },
  {
    _id: "5aea95d5fa9ac803bad12004",
    ExpenseType: 0,
    ExpenseValue: 5500,
    ExpenseDescription: "Bhouse",
    CreatedBy: 0,
    DateCreated: "2018-05-01T07:37:39.493Z",
    DateModified: "2018-05-01T07:37:39.493Z",
    Active: true,
    __v: 0
  }
];

function check(doc) {
  return server.some(e => e.DateCreated == doc.DateCreated);
}
module.exports = () => {
  /* GET users listing. */
  router.post("/create", function(req, res, next) {
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

  router.post("/create/many", function(req, res, next) {
    var docu = req.body;
    // docu.forEach(e => {
    //   (e.DateCreated = new Date(parseInt(e.DateCreated, 10))),
    //     (e.DateModified = new Date(parseInt(e.DateModified, 10)));
    // });

    Expense.find({}, (err, serverDocs) => {
      serverDox = [];
      serverDocs.forEach( e => {
        serverDox.push({
          DateCreated: e.DateCreated.getTime().toString()
        });
      });

      function checkExist(dx) {
        return serverDox.some(el => el.DateCreated == dx.DateCreated);
      }

      documentsToAdd = docu.filter(d => !checkExist(d));


      Expense.insertMany(documentsToAdd, (errs, doc) => {
        if(errs) res.status(400).send({err :errs});
        else {
          Expense.find({}, (err, everydoc) => {
            if(err) res.status(400).send({err :err});
            var everydocs_ = [];
            everydoc.forEach(e => {
              var data_ = {
                // ExpenseID: e.ExpenseID,
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
              Data: everydocs_
            });
          })
        }
  
      });

    });


 

    // Expense.insertMany()
  });

  router.put("/update", function(req, res, next) {
    Expense.u(req.body, (err, doc) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.send({
          ExpenseServerID: doc._id
        });
      }
    });
  });

  router.get("/superUpdate", function(req, res, next) {
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

  router.get("/get/all", function(req, res, next) {
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

  router.post("/get/except", function(req, res, next) {
    Expense.find(
      {
        DateCreated: { $nin: JSON.parse(req.body.DatesCreated) },
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
    Expense.update(
      {
        DateCreated: docx.DateCreated,
        DateModified: docx.DateModified
      },
      {
        Active: true
      },
      {
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
