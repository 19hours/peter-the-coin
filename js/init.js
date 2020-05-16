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
    script.src = "./js/peter.js";
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
  // let totalAmt = transactions.reduce((prev, curr) => prev + curr);
  // let avgAmt = totalAmt / transactions.length;
  // let lastAmt = transactions[transactions.length-1];
  // let gap = lastAmt - avgAmt;

  let arr1 = transactions.slice(0,5)
  let arr2 = transactions.slice(1,6)
  let arr3 = transactions.slice(2,7)
  let totalAmt1 = arr1.reduce((prev, curr) => prev + curr);
  let totalAmt2 = arr2.reduce((prev, curr) => prev + curr);
  let totalAmt3 = arr3.reduce((prev, curr) => prev + curr);

  let avgAmt1 = totalAmt1 / 5;
  let avgAmt2 = totalAmt2 / 5;
  let avgAmt3 = totalAmt3 / 5;

  let gap = (arr1[4]-avgAmt1+arr2[4]-avgAmt2+arr3[4]-avgAmt3)/3

  if (gap != 0) {
    return normalizer(gap);
  } else {
    return 85;
  }
}

function sigmoid(i) {
  return 150/(1+Math.pow(Math.E, -(i-100)));
}