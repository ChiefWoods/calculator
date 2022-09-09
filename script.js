let mode, num1 = undefined, num2 = undefined, result, decimalFlag = false, decimalCounter = 0, lastOperation = "", input = "", previousMode = "";

const digit = document.querySelectorAll('.digit'); // all 10 numbers
const operator = document.querySelectorAll('.operator'); // + - * /

const previousOperation = document.querySelector('.previousOperation');
const currentInput = document.querySelector('.currentInput');

function add(a, b) {
  result = a + b;
}

function subtract(a, b) {
  result = a - b;
}

function multiply(a, b) {
  result = a * b;
}

function divide(a, b) {
  result = a / b;
}

const operators = {
  add: (a, b) => result = a + b,
  subtract: (a, b) => result = a - b,
  multiply: (a, b) => result = a * b,
  divide: (a, b) => result = a / b,
}

operator.addEventListener('click', operate());

function operate() {
  decimalOff();
  if (num1 == undefined) {
    num1 = parseFloat(input);
    previousMode = `${this.target.textContent}`;
    lastOperation = `${num1} ${this.target.textContent}`;
    previousOperation.textContent = lastOperation;
  } else {
    num2 = parseFloat(input);
    switch (mode) {
      case "plus":
        operators.add(num1, num2);
        break;
      case "minus":
        operators.subtract(num1, num2);
        break;
      case "times":
        operators.multiply(num1, num2);
        break;
      case "slash":
        operators.divide(num1, num2);
        break;
    }
    if (mode != "equal") {
      previousMode = `${this.target.textContent}`;
      lastOperation = `${result} ${this.target.textContent}`;
      previousOperation.textContent = lastOperation;
      currentInput.textContent = result;
      num1 = num2;
    } else {
      lastOperation = `${num1} ${previousMode} ${num2} =`;
      previousOperation.textContent = lastOperation;
      currentInput.textContent = result;
      num1 = num2 = undefined;
    }
  }
  mode = operator.getAttribute('id');

}

const wipe = document.querySelector('#wipe');
wipe.addEventListener('click', clear());

function clear() {
  previousOperation.textContent = currentInput.textContent = lastOperation = input = previousMode = "";
  num1 = num2 = result = undefined;
  decimalOff();
}

const dot = document.querySelector('#dot');
dot.addEventListener('click', () => {
  if (!decimalFlag) {
    decimalOn();
  }
});

function decimalOn() {
  input = `${input}.`;
  currentInput.textContent = `${input}`;
  decimalFlag = true;
  digit.addEventListener('click', () => {
      decimalAppendInput(this);
  });
}

function decimalAppendInput(e) {
  input = `${input}${e.target.textContent}`;
  currentInput.textContent = `${input}`;
}

function decimalOff() {
  decimalFlag = false;
  digit.removeEventListener('click', () => {
      decimalAppendInput(this);
  });
}

const drop = document.querySelector('#drop');
drop.addEventListener('click', backspace());

function backspace() {
  if (input.slice(-1) == "." && decimalFlag == true) {
    decimalOff();
  }
  input = input.slice(0, -1);
}

// add functionality to reenable decimal for backspace

digit.addEventListener('click', enterDigit(this));

function enterDigit(e) {
  input = `${input}${e.target.textContent}`;
  currentInput.textContent = input;
}

