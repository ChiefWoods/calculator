let mode = "", operand1 = "", operand2 = "", operator = "", shouldResetInput = false, shouldClear = false;

const wipe = document.querySelector('#clear');
const drop = document.querySelector('#backspace');
const decimal = document.querySelector('#decimal');
const equal = document.querySelector('#equal');
const numbers = document.querySelectorAll('.number');
const operators = document.querySelectorAll('.operator');
const other = document.querySelectorAll('.other');
const erase = document.querySelectorAll('.erase');
const previousOperation = document.querySelector('.previousOperation');
const currentInput = document.querySelector('.currentInput');

const operations = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => a / b,
}

wipe.addEventListener('click', clear);
drop.addEventListener('click', backspace);
decimal.addEventListener('click', appendDecimal);
equal.addEventListener('click', () => {
  evaluate();
  shouldClear = true;
});
numbers.forEach(number => number.addEventListener('click', () => appendNumber(number.textContent)));
operators.forEach(operator => operator.addEventListener('click', () => setOperation(operator.textContent)));
window.addEventListener('keydown', (e) => handleKeyboardInput(e));
window.addEventListener('keydown', (e) => addButtonClass(e));
window.addEventListener('keyup', (e) => removeButtonClass(e));

function resetInput() {
  currentInput.textContent = "";
  shouldResetInput = false;
}

function clear() {
  previousOperation.textContent = "";
  currentInput.textContent = "0";
  operand1 = "";
  operand2 = "";
  operator = "";
  shouldClear = false;
}

function backspace() {
  if (shouldClear) {
    previousOperation.textContent = "";
    operand1 = "";
    operand2 = "";
    operator = "";
    shouldClear = false;
  }
  currentInput.textContent = currentInput.textContent.slice(0, -1);
}

function appendNumber(number) {
  if (shouldClear) clear();
  if (currentInput.textContent === "0" || shouldResetInput) resetInput();
  if (currentInput.textContent.length > 8) return alert("Maximum digit limit reached!");
  currentInput.textContent += number;
}

function appendDecimal() {
  if (shouldClear) clear();
  else if (shouldResetInput) resetInput();
  if (currentInput.textContent.includes(".")) return;
  if (currentInput.textContent === "") currentInput.textContent = "0";
  currentInput.textContent += ".";
}

function setOperation(mode) {
  if (shouldClear) return;
  if (operator !== "") evaluate();
  operator = mode;
  operand1 = trim(currentInput.textContent);
  previousOperation.textContent = `${operand1} ${operator}`;
  shouldResetInput = true;
}

function evaluate() {
  if (operator === "" || shouldResetInput) return;
  operand2 = trim(currentInput.textContent);
  if (operator === "/" && operand2 === "0") {
    previousOperation.textContent = "TO INFINITY";
    currentInput.textContent = "AND BEYOND!";
    shouldClear = true;
  } else {
    previousOperation.textContent = `${operand1} ${operator} ${operand2} = `;
    currentInput.textContent = roundAndExponent(operate(operand1, operand2, operator));
    operator = "";
  }
}

function operate(num1, num2, operator) {
  num1 = Number(num1);
  num2 = Number(num2);
  switch (operator) {
    case "+":
      return operations.add(num1, num2);
    case "-":
      return operations.subtract(num1, num2);
    case "*":
      return operations.multiply(num1, num2);
    case "/":
      return operations.divide(num1, num2);
  }
}

function roundAndExponent(num) {
  if (num.toString().length > 9) return num.toExponential(6);
  else return num;
}

function trim(string) {
  return parseFloat(string).toString();
}

function handleKeyboardInput(e) {
  if (e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/") setOperation(e.key);
  else if (parseFloat(e.key) >= 0 && parseFloat(e.key) <= 9) appendNumber(e.key);
  else if (e.key === ".") appendDecimal();
  else if (e.key === "Enter") {
    evaluate();
    shouldClear = true;
  }
  else if (e.key === "Backspace" || e.key === "Delete") backspace();
  else if (e.key === "Escape") clear();
}

function addButtonClass(e) {
  const button = document.querySelector(`button[data-key="${e.keyCode}"]`);
  if (e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/") button.classList.add('operator-active');
  else if (parseFloat(e.key) >= 0 && parseFloat(e.key) <= 9) button.classList.add('number-active');
  else if (e.key === "." || e.key === "Enter") button.classList.add('other-active');
  else if (e.key === "Backspace" || e.key === "Delete" || e.key === "Escape") button.classList.add('erase-active');
}

function removeButtonClass(e) {
  const button = document.querySelector(`button[data-key="${e.keyCode}"]`);
  if (e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/") button.classList.remove('operator-active');
  else if (parseFloat(e.key) >= 0 && parseFloat(e.key) <= 9) button.classList.remove('number-active');
  else if (e.key === "." || e.key === "Enter") button.classList.remove('other-active');
  else if (e.key === "Backspace" || e.key === "Delete" || e.key === "Escape") button.classList.remove('erase-active');
}