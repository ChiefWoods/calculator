const input = document.querySelector('.input');
const output = document.querySelector('.output');
const negative = document.querySelector('#negative');
const clear = document.querySelector('#clear');
const backspace = document.querySelector('#backspace');
const operators = document.querySelectorAll('.operator');
const digits = document.querySelectorAll('.digit');

let mode = '';
let operand1 = '';
let operand2 = '';
let shouldReset = false;
let shouldClear = false;

function clearScreen() {
  input.textContent = '';
  output.textContent = '0';
  operand1 = '';
  operand2 = '';
  mode = '';
  shouldClear = false;
}

function resetOutput() {
  output.textContent = '0';
  shouldReset = false;
}

function backspaceOutput() {
  shouldClear
    ? clearScreen()
    : shouldReset
      ? resetOutput()
      : null;
  output.textContent.length === 1
    ? output.textContent = '0'
    : output.textContent = output.textContent.slice(0, -1);
}

function appendNumber(number) {
  shouldClear
    ? clearScreen()
    : shouldReset
      ? resetOutput()
      : null;
  if (output.textContent.length > 9) {
    return alert('Maximum digit limit reached!');
  }
  output.textContent === '0'
    ? output.textContent = number
    : output.textContent += number;
}

function appendDecimal() {
  shouldClear
    ? clearScreen()
    : shouldReset
      ? resetOutput()
      : null;
  if (!output.textContent.includes('.')) {
    output.textContent += '.';
  }
}

function toggleNegative() {
  if (output.textContent === 'AND BEYOND!') {
    clearScreen();
  } else if (shouldClear) {
    input.textContent = '';
    operand1 = '';
    operand2 = '';
    mode = '';
    shouldClear = false;
  }
  if (output.textContent === '0') return;
  output.textContent.startsWith('-')
    ? output.textContent = output.textContent.slice(1)
    : output.textContent = '-' + output.textContent;
}

function trimOutput() {
  let num = output.textContent;
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
  if (output.textContent === 'AND BEYOND!') return;
  if (mode === '=') { // repeated evaluation without operating
    mode = '';
    operand1 = trimOutput();
    shouldReset = true;
  } else if (shouldClear) { // repeated evaluation
    operand1 = trimOutput();
  } else {
    operand2 = trimOutput();
    shouldClear = true;
    if (mode === '÷' && operand2 === '0') { // dividing by zero
      input.textContent = 'TO INFINITY';
      output.textContent = 'AND BEYOND!';
      return;
    }
  }
  input.textContent = `${operand1} ${mode} ${operand2} = `;
  output.textContent = operate(operand1, operand2, mode);
}

function setDisplay(operation) {
  if (output.textContent === 'AND BEYOND!') return;
  if (mode !== '' && shouldReset) { // select operation after clicking another one
    operand1 = trimOutput();
  } else if (mode !== '' && shouldClear) { // start an operation using evaluated result
    shouldClear = false;
    shouldReset = true;
    operand1 = trimOutput();
  } else if (mode !== '' && !shouldClear) { // append new operation
    operand2 = trimOutput();
    if (mode === '÷' && operand2 === '0') { // dividing by zero
      shouldClear = true;
      input.textContent = 'TO INFINITY';
      output.textContent = 'AND BEYOND!';
      return;
    } else {
      shouldReset = true;
      output.textContent = operate(operand1, operand2, mode);
      operand1 = trimOutput();
    }
  } else if (mode === '') { // first operation
    shouldReset = true;
    operand1 = trimOutput();
  }
  setMode(operation);
  input.textContent = `${operand1} ${mode}`;
}

negative.addEventListener('click', toggleNegative);
clear.addEventListener('click', clearScreen);
backspace.addEventListener('click', backspaceOutput);

operators.forEach(operator => {
  operator.addEventListener('click', e => {
    e.target.id === 'equal' && mode !== ''
      ? evaluate()
      : setDisplay(e.target.dataset.key);
  })
})

digits.forEach(digit => {
  digit.addEventListener('click', e => {
    e.target.id !== 'decimal'
      ? appendNumber(e.target.textContent)
      : appendDecimal();
  })
})

window.addEventListener('keydown', e => {
  console.log(e.key)
  console.log(['Backspace', 'Delete'].includes(e.key))
  const button = document.querySelector(`[data-key='${e.key}']`);
  console.log(button)
  if (button) {
    button.classList.add('active');
    e.key === 'n'
      ? toggleNegative()
      : e.key === 'Escape'
        ? clearScreen()
        : e.key === 'Backspace'
          ? backspaceOutput()
          : ['+', '-', '*', '/'].includes(e.key)
            ? setDisplay(e.key)
            : parseFloat(e.key) >= 0 && parseFloat(e.key) <= 9
              ? appendNumber(e.key)
              : e.key === '.'
                ? appendDecimal()
                : e.key === 'Enter' && mode != ''
                  ? evaluate()
                  : null;
  }
})

window.addEventListener('keyup', e => {
  const button = document.querySelector(`[data-key='${e.key}']`);
  if (button) {
    button.classList.remove('active');
  }
})
