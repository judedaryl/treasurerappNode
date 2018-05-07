var mongoose = require('mongoose');
var schema = mongoose.Schema;
/* Model */

module.exports = () => {
    var Expense = new schema({
        ExpenseID: {
            unique: false,
            type: Number,
            require: true
        },
        ExpenseType: {
            unique: false,
            type: Number,
            required: true
        },
        ExpenseValue: {
            unique: false,
            type: Number,
            required: true
        },
        ExpenseDescription: {
            unique: false,
            type: String,
            required: true
        },
        ExpenseCategory: {
            unique: false,
            type: String,
            required: false,
        },
        ExpenseTags: {
            unique: false,
            type: String,
            required: false,
        },
        Active: {
            unique: false,
            type: Boolean,
            required: false,
        },
        CreatedBy: {
            unique: false,
            type: Number,
            required: true
        },
        DateCreated: {
            unique: false,
            type: Date,
            required: true
        },
        DateModified: {
            unique: false,
            type: Date,
            required: true
        },
    });

    Expense.statics.Create = function (params, callback) {
        this.findOne({
            $or: [{
                ExpenseID: 0
            }]
        }, (err, doc) => {
            if (err) return callback(err);
            if (doc) return callback(new Error("Expense exists"), null);
            else {
                var model = mongoose.model("expenses", Expense);
                var newExpense = model({
                    ExpenseID: params.ExpenseID,
                    ExpenseType: params.ExpenseType,
                    ExpenseValue: params.ExpenseValue,
                    ExpenseDescription: params.ExpenseDescription,
                    CreatedBy: 0,
                    DateCreated: new Date(parseInt(params.DateCreated, 10)),
                    DateModified: new Date(parseInt(params.DateModified, 10))
                });

                newExpense.save(function (err) {
                    if (err) return callback(err);
                    return callback(null, newExpense);
                })
            }
        });
    }

    Expense.statics.CreateMany = function(object, callback) {
        var model = mongoose.model("expenses", Expense);
        
    }

    return mongoose.model("Expense", Expense);
}