let mode, num1 = undefined, num2 = undefined, result, decimalFlag = false, numberFlag = false, clearFlag = false, zeroFlag = false, lastOperation = "", input = "", previousMode = "";

const digit = document.querySelectorAll('.digit');
const operator = document.querySelectorAll('.operator');

const previousOperation = document.querySelector('.previousOperation');
const currentInput = document.querySelector('.currentInput');

function test() {
  console.log("num1 = " + num1);
  console.log("num2 = " + num2);
  console.log("previousMode = " + previousMode);
  console.log("result = " + result);
}

const operators = {
  add: (a, b) => result = a + b, // does not sum exponentials correctly, concatenated instead
  subtract: (a, b) => result = a - b,
  multiply: (a, b) => result = a * b,
  divide: (a, b) => {
    if (b == 0) {
      zeroFlag = true;
    }
    else {
      result = a / b;
    }
  },
}

operator.forEach(sign => sign.addEventListener('click', (e) => operate(e)));

function operate(e) {
  decimalFlag = false;
  if (num1 == undefined) {
    num1 = input;
    previousMode = `${e.target.textContent}`;
    previousOperation.textContent = `${exponentialChecker(num1)} ${e.target.textContent}`;
    mode = e.target.getAttribute('id');
  } else {
    num2 = input;
    switch (mode) {
      case "plus":
        operators.add(parseFloat(num1), parseFloat(num2));
        break;
      case "minus":
        operators.subtract(parseFloat(num1), parseFloat(num2));
        break;
      case "times":
        operators.multiply(parseFloat(num1), parseFloat(num2));
        break;
      case "slash":
        operators.divide(parseFloat(num1), parseFloat(num2));
        break;
    }
    result = result.toString();
    mode = e.target.getAttribute('id');
    if (zeroFlag) {
      previousOperation.textContent = "TO INFINITY";
      currentInput.textContent = "AND BEYOND!";
      clearFlag = true;
    } else if (mode != "equal") {
      previousMode = `${e.target.textContent}`;
      previousOperation.textContent = `${exponentialChecker(result)} ${e.target.textContent}`;
      currentInput.textContent = `${exponentialChecker(result)}`;
      num1 = result;
    } else {
      previousOperation.textContent = `${exponentialChecker(num1)} ${previousMode} ${exponentialChecker(num2)} =`;
      currentInput.textContent = `${exponentialChecker(result)}`;
      clearFlag = true;
    }
  }
  numberFlag = true;
  input = "";
}

function exponentialChecker(numAsString) {
  if (numAsString.match(/\d/g).length > 7) {
    return parseFloat(parseFloat(numAsString).toPrecision(7)).toExponential();
  } else {
    return numAsString;
  }
}

const wipe = document.querySelector('#wipe');
wipe.addEventListener('click', clear);

function clear() {
  previousOperation.textContent = currentInput.textContent = lastOperation = input = previousMode = "";
  num1 = num2 = result = undefined;
  numberFlag = decimalFlag = zeroFlag = false;
}

const dot = document.querySelector('#dot');
dot.addEventListener('click', () => {
  if (!decimalFlag) {
    decimalOn();
  }
});

function decimalOn() {
  if (input.match(/\d/g) == null || input.match(/\d/g).length < 8) {
    if (clearFlag) {
      clear();
      clearFlag = false;
    } else if (numberFlag) {
      numberFlag = false;
    }
    input = `${input}.`;
    currentInput.textContent = `${input}`;
    decimalFlag = true;
  } else {
    alert("Maximum digit limit reached! Decimals are disabled.");
  }
}

const drop = document.querySelector('#drop');
drop.addEventListener('click', backspace);

function backspace() {
  if (input.slice(-1) == "." && decimalFlag == true) {
    decimalFlag = false;
  }
  input = input.slice(0, -1);
  currentInput.textContent = input;
}

digit.forEach(number => number.addEventListener('click', (e) => {
  enterDigit(e);
}));

function enterDigit(e) { // add countermeasure against spamming digits, implement limit on input
  if (input.match(/\d/g) == null || input.match(/\d/g).length < 8) {
    if (clearFlag) {
      clear();
      input = `${e.target.textContent}`;
      currentInput.textContent = input;
      clearFlag = false;
    } else if (numberFlag) {
      input = `${e.target.textContent}`;
      currentInput.textContent = input;
      numberFlag = false;
    } else if (!numberFlag) {
      input = `${input}${e.target.textContent}`;
      currentInput.textContent = input;
    }
  } else {
    alert("Maximum digit limit reached!");
  }
}