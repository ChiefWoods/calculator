const input = document.querySelector('#input');
const display = document.querySelector('#display');
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
  input.textContent = '';
  display.textContent = '0';
  operand1 = '';
  operand2 = '';
  mode = '';
  shouldClear = false;
}

function resetDisplay() {
  display.textContent = '0';
  shouldReset = false;
}

function backspaceDisplay() {
  if (shouldClear) clearScreen();
  if (shouldReset) resetDisplay();

  display.textContent = display.textContent.length === 1
    ? '0'
    : display.textContent.slice(0, -1);
}

function appendNumber(number) {
  if (shouldClear) clearScreen();
  if (shouldReset) resetDisplay();

  if (display.textContent.length > 9) {
    return alert('Maximum digit limit reached!');
  }

  display.textContent === '0'
    ? display.textContent = number
    : display.textContent += number;
}

function appendDecimal() {
  if (shouldClear) clearScreen();
  if (shouldReset) resetDisplay();

  if (!display.textContent.includes('.')) {
    display.textContent += '.';
  }
}

function toggleNegative() {
  if (display.textContent === 'AND BEYOND!') {
    clearScreen();
  } else if (shouldClear) {
    input.textContent = '';
    operand1 = '';
    operand2 = '';
    mode = '';
    shouldClear = false;
  }

  if (display.textContent === '0') return;

  display.textContent = display.textContent.startsWith('-')
    ? display.textContent.slice(1)
    : '-' + display.textContent;
}

function trimDisplay() {
  let num = display.textContent;

  if (num === '') {
    num = '0';
  }

  return parseFloat(num).toString();
}

function operate(num1, num2, operator) {
  num1 = Number(num1);
  num2 = Number(num2);

  let num = operator === '+'
    ? num1 + num2
    : operator === '−'
      ? num1 - num2
      : operator === '×'
        ? num1 * num2
        : operator === '÷'
          ? num1 / num2
          : num1;

  num = Math.round(num * 10000) / 10000;

  return num.toString().length > 9
    ? num.toExponential(4)
    : num;
}

function setMode(operator) {
  mode = operator === '*'
    ? '×'
    : operator === '/'
      ? '÷'
      : operator === '-'
        ? '−'
        : operator;
}

function evaluate() {
  if (display.textContent === 'AND BEYOND!') return;

  if (mode === '=') {
    // repeated evaluation without operating
    mode = '';
    operand1 = trimDisplay();
    shouldReset = true;
  } else if (shouldClear) {
    // repeated evaluation
    operand1 = trimDisplay();
  } else {
    operand2 = trimDisplay();
    shouldClear = true;
    if (mode === '÷' && operand2 === '0') {
      // dividing by zero
      input.textContent = 'TO INFINITY';
      display.textContent = 'AND BEYOND!';
      return;
    }
  }

  input.textContent = `${operand1} ${mode} ${operand2} = `;
  display.textContent = operate(operand1, operand2, mode);
}

function setDisplay(operation) {
  if (display.textContent === 'AND BEYOND!') return;

  if (mode !== '' && shouldReset) {
    // select operation after choosing another one
    operand1 = trimDisplay();
  } else if (mode !== '' && shouldClear) {
    // start an operation using evaluated result
    shouldClear = false;
    shouldReset = true;
    operand1 = trimDisplay();
  } else if (mode !== '' && !shouldClear) {
    // append new operation
    operand2 = trimDisplay();
    if (mode === '÷' && operand2 === '0') {
      // dividing by zero
      shouldClear = true;
      input.textContent = 'TO INFINITY';
      display.textContent = 'AND BEYOND!';
      return;
    } else {
      shouldReset = true;
      display.textContent = operate(operand1, operand2, mode);
      setMode(operation);
      operand1 = trimDisplay();
    }
  } else if (mode === '') {
    // first operation
    shouldReset = true;
    operand1 = trimDisplay();
  }

  setMode(operation);
  input.textContent = `${operand1} ${mode}`;
}

negativeBtn.addEventListener('click', toggleNegative);
clearBtn.addEventListener('click', clearScreen);
backspaceBtn.addEventListener('click', backspaceDisplay);

operatorBtns.forEach(operator => {
  operator.addEventListener('click', e => {
    e.target.id === 'equal' && mode !== ''
      ? evaluate()
      : e.target.dataset.key.match(/(=|Enter)/)
        ? setDisplay('=')
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
                : ['Enter', '='].includes(e.key) && mode !== ''
                  ? evaluate()
                  : ['Enter', '='].includes(e.key) && mode === ''
                    ? setDisplay('=')
                    : null;
  }
})

window.addEventListener('keyup', e => {
  const button = document.querySelector(`[data-key*='${e.key}']`);

  if (button) {
    button.classList.remove('active');
  }
})
