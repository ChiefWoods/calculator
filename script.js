var mode = operand1 = operand2 = "", shouldReset = shouldClear = isNegative = false, num;

const previous = document.querySelector('.previous');
const current = document.querySelector('.current');
const buttons = document.querySelectorAll('button');

buttons.forEach(button => {
  button.addEventListener('click', e => {
    switch (e.target.className) {
      case 'negative':
        setNegative();
        break;
      case 'erase':
        switch (e.target.value) {
          case 'clear':
            clear();
            break;
          case 'backspace':
            backspace();
            break;
        }
        break;
      case 'operator':
        if (e.target.value == "equals" && mode != "") {
          evaluate();
        } else {
          setDisplay(e.target.value);
        }
        break;
      case 'digit':
        if (e.target.value == 'decimal') {
          appendDecimal();
        } else {
          appendNumber(e.target.textContent);
        }
        break;
    }
  })
})

window.addEventListener('keydown', e => {
  const button = document.querySelector(`button[data-code*="${e.code}"]`);
  if (button != null) {
    button.classList.add("active");
    if (e.code == "KeyN") {
      setNegative();
    } else if (e.code == "Escape" || e.code == "KeyC") {
      clear();
    } else if (e.code == "Backspace" || e.code == "Delete") {
      backspace();
    } else if (e.code == "NumpadAdd") {
      setDisplay("plus");
    } else if (e.code == "NumpadSubtract" || e.code == "Minus") {
      setDisplay("minus");
    } else if (e.code == "NumpadMultiply") {
      setDisplay("multiply");
    } else if (e.code == "NumpadDivide") {
      setDisplay("divide");
    } else if (e.code == "NumpadEnter" || e.code == "Equal" && mode != "") {
      evaluate();
    } else if (e.code == "NumpadDecimal" || e.code == "Period") {
      appendDecimal();
    } else if (parseFloat(e.key) >= 0 && parseFloat(e.key) <= 9) {
      appendNumber(e.key);
    }
  }
})

window.addEventListener('keyup', e => {
  const button = document.querySelector(`button[data-code*="${e.code}"]`);
  if (button != null) {
    button.classList.remove("active");
  }
});

function reset() {
  current.textContent = "0";
  shouldReset = false;
}

function clear() {
  previous.textContent = "";
  current.textContent = "0";
  operand1 = "";
  operand2 = "";
  mode = "";
  shouldClear = false;
}

function backspace() {
  if (shouldClear) {
    clear();
  }
  if (shouldReset) {
    reset();
  }
  current.textContent = current.textContent.slice(0, -1);
  if (current.textContent == "") {
    current.textContent = "0";
  }
}

function appendNumber(number) {
  if (shouldClear) {
    clear();
  }
  if (shouldReset) {
    reset();
  }
  if (current.textContent.length > 9) {
    return alert("Maximum digit limit reached!");
  }
  if (current.textContent == "0") {
    current.textContent = number;
  } else {
    current.textContent += number;
  }
}

function appendDecimal() {
  if (shouldClear) {
    clear();
  }
  if (shouldReset) {
    reset();
  }
  if (!current.textContent.includes(".")) {
    current.textContent += ".";
  }
}

function setNegative() {
  if (shouldClear) {
    clear();
  }
  if (shouldReset) {
    reset();
  }
  if (current.textContent != "0") {
    if (!isNegative) {
      isNegative = true;
      current.textContent = "-" + current.textContent;
    } else {
      isNegative = false;
      current.textContent = current.textContent.slice(1);
    }
  }
}

function operate(num1, num2, operator) {
  num = 0;
  num1 = Number(num1);
  num2 = Number(num2);
  switch (operator) {
    case "+":
      num = num1 + num2;
      break;
    case "-":
      num = num1 - num2;
      break;
    case "×":
      num = num1 * num2;
      break;
    case "÷":
      num = num1 / num2;
      break;
  }
  return roundAndExponent(num);
}

function setOperation(arithmetic) {
  switch (arithmetic) {
    case "add":
      mode = "+";
      break;
    case "subtract":
      mode = "-";
      break;
    case "multiply":
      mode = "×";
      break;
    case "divide":
      mode = "÷";
      break;
  }
}

function setDisplay(operation) {
  if (current.textContent != "AND BEYOND!") {
    if (mode != "" && shouldReset) { // select operation after clicking another one
    } else if (mode != "" && shouldClear) { // start an operation using evaluated result
      shouldClear = false;
      shouldReset = true;
      operand1 = trim(current.textContent);
    } else if (mode != "" && !shouldClear) { // append new operation
      operand2 = trim(current.textContent);
      if (mode == "÷" && operand2 == "0") {
        shouldClear = true;
        previous.textContent = "TO INFINITY";
        current.textContent = "AND BEYOND!";
        return;
      } else {
        shouldReset = true;
        current.textContent = operate(operand1, operand2, mode);
        operand1 = trim(current.textContent);
      }
    } else if (mode == "") { // first operation
      shouldReset = true;
      operand1 = trim(current.textContent);
    }
    isNegative = false;
    setOperation(operation);
    previous.textContent = `${operand1} ${mode}`;
  }
}

function evaluate() {
  if (current.textContent != "AND BEYOND!") {
    if (shouldClear) { // repeated evaluation
      operand1 = trim(current.textContent);
    } else {
      operand2 = trim(current.textContent);
      shouldClear = true;
      if (mode == "÷" && operand2 == "0") { // dividing by zero
        previous.textContent = "TO INFINITY";
        current.textContent = "AND BEYOND!";
        return;
      }
    }
    isNegative = false;
    previous.textContent = `${operand1} ${mode} ${operand2} = `;
    current.textContent = operate(operand1, operand2, mode);
  }
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

function trim(string) {
  if (string == "") {
    string = "0";
  }
  return parseFloat(string).toString();
}