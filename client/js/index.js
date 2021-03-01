var cardDetails = null;

document.querySelectorAll(".logged-tab").forEach((value) => value.style.display = "none")

function login(form) {
  try {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/payments/");
    xhr.onload = function (event) {
      const response = JSON.parse(event.target.response);

      if (response.ok) {
        document.getElementById("card-number").innerText = formData.get("card");
        document.getElementById("card-pin").innerText = "PIN " + formData.get("pin");
        document.getElementById("card-balance").innerText = response.balance + "€";
        document.querySelectorAll(".login-tab").forEach((value) => value.style.display = "none")
        document.querySelectorAll(".logged-tab").forEach((value) => value.style.display = "")
        cardDetails = {pin: formData.get("pin"), card: formData.get("card")};
        transactionsUpdate();
      } else {
        alert(response.msg);
      }
    };
    xhr.onerror = function () {
      alert("Error");
    };
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var formData = new FormData(form);

    xhr.send(urlencodeFormData(formData));
  } catch (err) {
    console.error(err);
  }
  return false;
}


function loginRequest(card, pin) {
  try {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/payments/");
    xhr.onload = function (event) {
      const response = JSON.parse(event.target.response);

      if (response.ok) {
        document.getElementById("card-number").innerText = card;
        document.getElementById("card-pin").innerText = "PIN " + pin;
        document.getElementById("card-balance").innerText = response.balance + "€";
        document.querySelectorAll(".login-tab").forEach((value) => value.style.display = "none")
        document.querySelectorAll(".logged-tab").forEach((value) => value.style.display = "")
        cardDetails = {pin: pin, card: card};
        transactionsUpdate();
      } else {
        alert(response.msg);
      }
    };
    xhr.onerror = function () {
      alert("Error");
    };
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(JSON.stringify({card, pin}));
  } catch (err) {
    console.error(err);
  }
  return false;
}

function urlencodeFormData(fd) {
  var s = "";
  function encode(s) {
    return encodeURIComponent(s).replace(/%20/g, "+");
  }
  for (var pair of fd.entries()) {
    if (typeof pair[1] == "string") {
      s += (s ? "&" : "") + encode(pair[0]) + "=" + encode(pair[1]);
    }
  }
  return s;
}

var updating = false;
function transactionsUpdate() {
  if (updating == true) return;
  updating = true;
  setInterval( () => {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "http://localhost:3000/transactions/");
      xhr.onload = function (event) {
        const response = JSON.parse(event.target.response);
        //alert(JSON.stringify(response));
        if (response.ok) {
          const table =  document.getElementById("transactions-table");
          table.innerHTML = "";
          document.getElementById("transactions-msg").innerText = "";
          response.transactions.forEach( (t) => {
            const isWithdraw = t.amount < 0;
            table.innerHTML += `
                                            <tr class="${isWithdraw ? "table-danger" : "table-success"}">
                                                   <th scope="row">${t.id}</th>
                                                   <td>${isWithdraw ? "Withdrawal" : "Deposit"}</td>
                                                   <td>${t.amount}</td>
                                                   <td>${t.old_balance}</td>
                                                   <td>${t.new_balance}</td>
                                                   <td>${t.time}</td>
                                            </tr>
            `
          })
        } else {
          //alert(response.msg);
          document.getElementById("transactions-msg").innerText = response.msg;
        }
      };
      xhr.onerror = function () {
        alert("Connection error");
      };
      xhr.setRequestHeader("Content-Type", "application/json");
      //alert (JSON.stringify(cardDetails))
      xhr.send(JSON.stringify(cardDetails));
    } catch (err) {
      console.error(err);
    }

    loginRequest(cardDetails.card, cardDetails.pin)

  } , 1000 )
  
}


function register() {
  try {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/register/");
    xhr.onload = function (event) {
      const response = JSON.parse(event.target.response);
      //alert(JSON.stringify(response));
      if (response.ok) {
        loginRequest(response.card, response.pin);
      } else {
        alert(response.msg);
      }
    };
    xhr.onerror = function () {
      alert("Connection error");
    };
    xhr.send();
  } catch (err) {
    console.error(err);
  }
}

function transfer(form) {
  try {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/payments/deposit");
    xhr.onload = function (event) {
      const response = JSON.parse(event.target.response);

      if (response.ok) {
        //alert(response.msg);
      } else {
        alert(response.msg);
      }
    };
    xhr.onerror = function () {
      alert("Error");
    };
    xhr.setRequestHeader("Content-Type", "application/json");
    var formData = new FormData(form);
    xhr.send(JSON.stringify({
      targetCard: formData.get("targetCard"), amount: formData.get("amount"), 
      card: cardDetails.card, pin: cardDetails.pin}));
  } catch (err) {
    console.error(err);
  }
  return false;
}