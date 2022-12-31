var mode = operand1 = operand2 = "", shouldReset = shouldClear = false;

const previous = document.querySelector('.previous');
const current = document.querySelector('.current');
const buttons = document.querySelectorAll('button');

buttons.forEach(button => {
  button.addEventListener('click', e => {
    switch (e.target.className) {
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
        setOperation(e.target.value);
        break;
      case 'digit':
        if (e.target.value == 'decimal') {
          appendDecimal();
        } else {
          appendNumber(e.target.value);
        }
        break;
    }
  })
})

window.addEventListener('keydown', e => {
  const button = document.querySelector(`button[data-code*="${e.code}"]`);
  button.classList.add("active");
  if (e.code == "Escape") {
    clear();
  } else if (e.code == "Backspace" || e.code == "Delete") {
    backspace();
  } else if (e.code == "NumpadAdd") {
    setOperation("plus");
  } else if (e.code == "NumpadSubtract" || e.code == "Minus") {
    setOperation("minus");
  } else if (e.code == "NumpadMultiply") {
    setOperation("multiply");
  } else if (e.code == "NumpadDivide") {
    setOperation("divide");
  } else if (e.code == "NumpadEnter" || e.code == "Equal") {
    setOperation("equal");
  } else if (e.code == "NumpadDecimal" || e.code == "Period") {
    appendDecimal();
  } else if (parseFloat(e.key) >= 0 && parseFloat(e.key) <= 9) {
    appendNumber(e.key);
  }
})

window.addEventListener('keyup', e => {
  const button = document.querySelector(`button[data-code*="${e.code}"]`);
  button.classList.remove("active");
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

function operate(num1, num2, operator) {
  num1 = Number(num1);
  num2 = Number(num2);
  switch (operator) {
    case "+":
      return num1 + num2;
    case "-":
      return num1 - num2;
    case "×":
      return num1 * num2;
    case "÷":
      return num1 / num2;
  }
}

function setOperation(operation) {
  if (shouldClear) {
    shouldClear = false;
  }
  if (mode != "" && !shouldReset) {
    evaluate();
  }
  switch (operation) {
    case "plus":
      mode = "+";
      break;
    case "minus":
      mode = "-";
      break;
    case "multiply":
      mode = "×";
      break;
    case "divide":
      mode = "÷";
      break;
    case 'equal':
      evaluate();
      shouldClear = true;
      return;
  }
  if (shouldReset) {
    previous.textContent = `${operand1} ${mode}`;
    return;
  }
  if (!shouldClear) {
    operand1 = trim(current.textContent);
    previous.textContent = `${operand1} ${mode}`;
    shouldReset = true;
  }
}

function evaluate() {
  if (mode == "" || shouldClear) {
    return;
  }
  operand2 = trim(current.textContent);
  if (mode == "÷" && operand2 == "0") {
    previous.textContent = "TO INFINITY";
    current.textContent = "AND BEYOND!";
    shouldClear = true;
  } else {
    previous.textContent = `${operand1} ${mode} ${operand2} = `;
    current.textContent = roundAndExponent(operate(operand1, operand2, mode));
    mode = "";
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