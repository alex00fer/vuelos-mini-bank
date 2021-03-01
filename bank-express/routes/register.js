var express = require("express");
var router = express.Router();
const crud = require("../db/crud");

router.post("/", function (req, res, next) {
  function between(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
  const cardNumber = between(10000000, 99999999).toString();
  const pin = between(1000, 9999).toString();
  crud.register(cardNumber, pin).then((result) => {
    res.json(result);
  });
});

module.exports = router;
