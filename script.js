let mode, input, display, result, num1, num2;

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  // add exception for dividing against zero
  return a / b;
}

function operate() {
  switch (mode) {
    case "+":
      result = add(num1, num2);
      break;
    case "-":
      result = subtract(num1, num2);
      break;
    case "*":
      result = multiply(num1, num2);
      break;
    case "/":
      result = divide(num1, num2);
      break;
  }
}

function clear() {
  // clear input
}

function decimal() {
  // disable button if decimal is used
}

function backspace() {
  // remove intput[input.length - 1]
}

const digit = document.querySelectorAll('.digit'); // all 10 numbers
const dot = document.querySelector('.dot');
const plus = document.querySelector('.plus');
const minus = document.querySelector('.minus');
const times = document.querySelector('.times');
const slash = document.querySelector('.slash');
const equal = document.querySelector('.equal');
const wipe = document.querySelector('.wipe');
const drop = document.querySelector('.drop'); // consider merging decimal, all operators and functions under one class


plus.addEventListener('click', () => {
  result = add(num1, num2);
})

