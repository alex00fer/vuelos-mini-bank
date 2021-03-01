const db = require("./config");

function checkCardDetails(reqCard, reqPin) {
  return new Promise(function (resolve) {
    if (reqCard != null && reqPin != null) {
      db.query(
        `SELECT balance FROM cards WHERE number="${reqCard}" AND pin=${reqPin}`,
        (error, result) => {
          if (error) resolve( { ok: false, msg: "Query error", error: error });
          if (result.length == 1) {
            resolve({ ok: true, balance: result[0].balance });
          } else {
            resolve({ ok: false, msg: "Wrong card details" });
          }
        }
      );
    } else {
      resolve({ ok: false, msg: "Invalid parameters" });
    }
  });
}

function withdrawl(reqCard, reqPin, reqAmount, reqBalance) {
  return new Promise(function (resolve) {
    if (reqCard != null && reqPin != null && reqAmount != null) {
      if (reqAmount <= reqBalance) {
        db.query(
          `UPDATE cards SET balance = balance - ${reqAmount} WHERE number="${reqCard}" AND pin=${reqPin}`,
          (error, result) => {
            if (error) resolve( { ok: false, msg: "Query error", error: error });
            if (result.affectedRows == 1) {
              resolve({ ok: true, msg: "Payment suceeded" });
            } else {
              resolve({ ok: false, msg: "Payment failed" });
            }
          }
        );
      } else {
        resolve({ ok: false, msg: "Insufficient funds" });
      }
    } else {
      resolve({ ok: false, msg: "Invalid parameters" });
    }
  });
}

function deposit(targetCard, reqAmount) {
  return new Promise(function (resolve) {
    if (reqAmount != null && targetCard) {
      db.query(
        `UPDATE cards SET balance = balance + ${reqAmount} WHERE number="${targetCard}"`,
        (error, result) => {
          if (error) resolve({ ok: false, msg: "Query error", error: error });
          if (result.affectedRows == 1) {
            resolve({ ok: true, msg: "Deposit suceeded" });
          } else {
            resolve({ ok: false, msg: "Deposit failed" });
          }
        }
      );
    } else {
      resolve({ ok: false, msg: "Invalid parameters" });
    }
  });
}

function transactions(reqCard) {
  return new Promise(function (resolve) {
    if (reqCard != null) {
      db.query(
        `SELECT * FROM transactions WHERE card="${reqCard}" ORDER BY time DESC LIMIT 20`,
        (error, result) => {
          if (error) resolve({ ok: false, msg: "Query error", error: error });
          if (result.length > 0) {
            resolve({ ok: true, transactions: result });
          } else {
            resolve({ ok: false, msg: "There are no transactions yet" });
          }
        }
      );
    } else {
      resolve({ ok: false, msg: "Invalid parameters" });
    }
  });
}

function register(card, pin) {
  return new Promise(function (resolve) {
    if (card != null && pin) {
      db.query(
        `INSERT INTO cards (number, pin) VALUES ("${card}", ${pin})`,
        (error, result) => {
          if (error) 
            resolve({ ok: false, msg: "Query error", error: error });
          else if (result.affectedRows == 1) {
            resolve({ ok: true, msg: "Card created", card: card, pin: pin });
          } else {
            resolve({ ok: false, msg: "Card could not be created. Try again later." });
          }
        }
      );
    } else {
      resolve({ ok: false, msg: "Invalid parameters" });
    }
  });
}

exports.checkCardDetails = checkCardDetails;
exports.withdrawl = withdrawl;
exports.deposit = deposit;
exports.transactions = transactions;
exports.register = register;
