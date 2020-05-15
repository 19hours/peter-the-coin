var historical = [];
var customGap;
let xhr = new XMLHttpRequest();
xhr.addEventListener("readystatechange", function () {
  if (this.readyState === 4) {
    let transactions = JSON.parse(this.responseText);
    transactions.forEach((transaction) => {
      historical.push(parseInt(transaction.amount));
    });
    customGap = pillarGap(historical)
    let script = document.createElement("script");
    script.src = "./js/pepebird.js";
    script.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(script);
  }
});
xhr.open("GET", "https://razerhackathon.sandbox.mambu.com/api/savings/8a8e871f7215f3000172173205ae0a47/transactions");
xhr.setRequestHeader("authorization", "Basic VGVhbTk0OnBhc3MxMTU2MjdDQkU1");
xhr.send();

function normalizer(i) {
  let squash = sigmoid(i);
  if (i < 0) {
    return 85-squash;
  } else {
    return 85+squash;
  }
}

function pillarGap(transactions) {
  let totalAmt = transactions.reduce((prev, curr) => prev + curr);
  let avgAmt = totalAmt / transactions.length;
  let lastAmt = transactions[transactions.length-1];
  let gap = lastAmt - avgAmt;
  if (gap != 0) {
    return normalizer(gap);
  } else {
    return 85;
  }
}

function sigmoid(i) {
  return 130/(1+Math.pow(Math.E, -(i-95)));
}