var express = require("express");
var router = express.Router();
const crud = require("../db/crud");

// middleware verify card details
router.post("/*", function (req, res, next) {
  console.log (req.body)
  crud.checkCardDetails(req.body.card, req.body.pin).then((result) => {
    console.log (result)
  if (result.ok) {
    req.balance = result.balance;
    next();
  }
  else {
    res.json(result);
  }
  })
});

router.post("/", function (req, res, next) {
  crud.checkCardDetails(req.body.card, req.body.pin).then((result) => {
    console.log (result)
  if (result.ok) {
    req.balance = result.balance;
    res.json(result);
  }
  else {
    res.json(result);
  }
  })
});

router.post("/withdraw", function (req, res, next) {
  crud.withdrawl(req.body.card, req.body.pin, req.body.amount, req.balance)
  .then((result) => {
    res.json(result);
  })
});

router.post("/deposit", function (req, res, next) {

  crud.withdrawl(req.body.card, req.body.pin, req.body.amount, req.balance)
  .then((result) => {
    if (result.ok) {
      crud.deposit( req.body.targetCard, req.body.amount).then((result) => {
        if (result.ok == false) {
          crud.deposit( req.body.card, req.body.amount)
        }
        res.json(result);
      })
    }
    else {
      res.json(result);
    }
  })
});

module.exports = router;
