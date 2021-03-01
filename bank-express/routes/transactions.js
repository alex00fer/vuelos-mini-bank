var express = require("express");
var router = express.Router();
const crud = require("../db/crud");

// middleware verify card details
router.post("/*", function (req, res, next) {
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
  crud.transactions(req.body.card)
  .then((result) => {
    res.json(result);
  })
});

module.exports = router;
