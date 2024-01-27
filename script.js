const inputP = document.querySelector('#input');
const displayP = document.querySelector('#display');
const negativeBtn = document.querySelector('#negative');
const clearBtn = document.querySelector('#clear');
const backspaceBtn = document.querySelector('#backspace');
const operatorBtns = document.querySelectorAll('.operator');
const digitBtns = document.querySelectorAll('.digit');

let mode = '';
let operand1 = '';
let operand2 = '';
let shouldReset = false;
let shouldClear = false;

function clearScreen() {
  inputP.textContent = '';
  displayP.textContent = '0';
  operand1 = '';
  operand2 = '';
  mode = '';
  shouldClear = false;
}

function resetDisplay() {
  displayP.textContent = '0';
  shouldReset = false;
}

function backspaceDisplay() {
  shouldClear
    ? clearScreen()
    : shouldReset
      ? resetDisplay()
      : null;
  displayP.textContent.length === 1
    ? displayP.textContent = '0'
    : displayP.textContent = displayP.textContent.slice(0, -1);
}

function appendNumber(number) {
  shouldClear
    ? clearScreen()
    : shouldReset
      ? resetDisplay()
      : null;
  if (displayP.textContent.length > 9) {
    return alert('Maximum digit limit reached!');
  }
  displayP.textContent === '0'
    ? displayP.textContent = number
    : displayP.textContent += number;
}

function appendDecimal() {
  shouldClear
    ? clearScreen()
    : shouldReset
      ? resetDisplay()
      : null;
  if (!displayP.textContent.includes('.')) {
    displayP.textContent += '.';
  }
}

function toggleNegative() {
  if (displayP.textContent === 'AND BEYOND!') {
    clearScreen();
  } else if (shouldClear) {
    inputP.textContent = '';
    operand1 = '';
    operand2 = '';
    mode = '';
    shouldClear = false;
  }
  if (displayP.textContent === '0') return;
  displayP.textContent.startsWith('-')
    ? displayP.textContent = displayP.textContent.slice(1)
    : displayP.textContent = '-' + displayP.textContent;
}

function trimDisplay() {
  let num = displayP.textContent;
  if (num === '') {
    num = '0';
  }
  return parseFloat(num).toString();
}

function roundAndExponent(num) {
  if (num.toString().length > 9) {
    if (/e\+0/.test(num.toExponential(4))) {
      return num.toExponential(4).slice(0, -3);
    } else {
      return num.toExponential(4);
    }
  } else {
    return num;
  }
}

function operate(num1, num2, operator) {
  num1 = Number(num1);
  num2 = Number(num2);
  let num = operator === '+'
    ? num1 + num2
    : operator === '-'
      ? num1 - num2
      : operator === '×'
        ? num1 * num2
        : operator === '÷'
          ? num1 / num2
          : null;
  return roundAndExponent(num);
}

function setMode(operator) {
  mode = operator === '*'
    ? '×'
    : operator === '/'
      ? '÷'
      : operator === 'Enter'
        ? '='
        : operator;
}

function evaluate() {
  if (displayP.textContent === 'AND BEYOND!') return;
  if (mode === '=') { // repeated evaluation without operating
    mode = '';
    operand1 = trimDisplay();
    shouldReset = true;
  } else if (shouldClear) { // repeated evaluation
    operand1 = trimDisplay();
  } else {
    operand2 = trimDisplay();
    shouldClear = true;
    if (mode === '÷' && operand2 === '0') { // dividing by zero
      inputP.textContent = 'TO INFINITY';
      displayP.textContent = 'AND BEYOND!';
      return;
    }
  }
  inputP.textContent = `${operand1} ${mode} ${operand2} = `;
  displayP.textContent = operate(operand1, operand2, mode);
}

function setDisplay(operation) {
  if (displayP.textContent === 'AND BEYOND!') return;
  if (mode !== '' && shouldReset) { // select operation after clicking another one
    operand1 = trimDisplay();
  } else if (mode !== '' && shouldClear) { // start an operation using evaluated result
    shouldClear = false;
    shouldReset = true;
    operand1 = trimDisplay();
  } else if (mode !== '' && !shouldClear) { // append new operation
    operand2 = trimDisplay();
    if (mode === '÷' && operand2 === '0') { // dividing by zero
      shouldClear = true;
      inputP.textContent = 'TO INFINITY';
      displayP.textContent = 'AND BEYOND!';
      return;
    } else {
      shouldReset = true;
      displayP.textContent = operate(operand1, operand2, mode);
      operand1 = trimDisplay();
    }
  } else if (mode === '') { // first operation
    shouldReset = true;
    operand1 = trimDisplay();
  }
  setMode(operation);
  inputP.textContent = `${operand1} ${mode}`;
}

negativeBtn.addEventListener('click', toggleNegative);
clearBtn.addEventListener('click', clearScreen);
backspaceBtn.addEventListener('click', backspaceDisplay);

operatorBtns.forEach(operator => {
  operator.addEventListener('click', e => {
    e.target.id === 'equal' && mode !== ''
      ? evaluate()
      : setDisplay(e.target.dataset.key);
  })
})

digitBtns.forEach(digit => {
  digit.addEventListener('click', e => {
    e.target.id !== 'decimal'
      ? appendNumber(e.target.textContent)
      : appendDecimal();
  })
})

window.addEventListener('keydown', e => {
  const button = document.querySelector(`[data-key*='${e.key}']`);
  if (button) {
    button.classList.add('active');
    ['n', 'N'].includes(e.key)
      ? toggleNegative()
      : ['Escape', 'c', 'C'].includes(e.key)
        ? clearScreen()
        : ['Backspace', 'Delete'].includes(e.key)
          ? backspaceDisplay()
          : ['+', '-', '*', '/'].includes(e.key)
            ? setDisplay(e.key)
            : parseFloat(e.key) >= 0 && parseFloat(e.key) <= 9
              ? appendNumber(e.key)
              : e.key === '.'
                ? appendDecimal()
                : ['Enter', '='].includes(e.key) && mode != ''
                  ? evaluate()
                  : null;
  }
})

window.addEventListener('keyup', e => {
  const button = document.querySelector(`[data-key*='${e.key}']`);
  if (button) {
    button.classList.remove('active');
  }
})
