// Initialize a flag variable which is used to decide when to remove the blinking underscore whenever populateDisplay is called.
// This ensures that no characters are appended to original html (i.e. the blinking underscore).
let flag = 0;

// Define operators which parse expressions into floats and fix their result to 14 decimal places.
let operators = {
    '+': function(a, b) {
        return parseFloat((a + b).toFixed(14));
    },
    '-': function(a, b) {
        return parseFloat((a - b).toFixed(14));
    },
    '*': function(a, b) {
        return parseFloat((a * b).toFixed(14));
    },
    '/': function(a, b) {
    	if (b === 0) {
    		alert('Cannot divide by zero!');
    		clearDisplay();
    		return;
    	}
        return parseFloat((a / b).toFixed(14));
    }
};

// Add an eventlistener for keypresses.
document.addEventListener('keydown', logKey);

// Keyboard support.
function logKey(e) {
  switch(`${e.code}`) {
  		case 'Numpad1':
  			populateDisplay(1);
  			break;
  		case 'Numpad2':
  			populateDisplay(2);
  			break;
  		case 'Numpad3':
  			populateDisplay(3);
  			break;
  		case 'Numpad4':
  			populateDisplay(4);
  			break;
  		case 'Numpad5':
  			populateDisplay(5);
  			break;
  		case 'Numpad6':
  			populateDisplay(6);
  			break;
  		case 'Numpad7':
  			populateDisplay(7);
  			break;
  		case 'Numpad8':
  			populateDisplay(8);
  			break;
  		case 'Numpad9':
  			populateDisplay(9);
  			break;
  		case 'Numpad0':
  			populateDisplay(0);
  			break;
  		case 'Backspace':
  			backspace();
  			break;
  		case 'NumpadAdd':
  			populateDisplay('+');
  			break;
  		case 'NumpadSubtract':
  			populateDisplay('-');
  			break;
  		case 'NumpadMultiply':
  			populateDisplay('*');
  			break;
  		case 'NumpadDivide':
  			populateDisplay('/');
  			break;
  		case 'NumpadEnter':
  			getResult();
  			break;
  		case 'NumpadDecimal':
  			populateDisplay('.');
  			break;
  		default:
  			break;
  }
}

// Deletes character in calculator display. If there are no characters remaining after deleting, clearDisplay is called.
function backspace() {
	expression = document.getElementById("calculatorDisplay").innerHTML;
	if (expression.length === 1) {
		clearDisplay();
		return;
	}
	expression = expression.substring(0, expression.length - 1);
	document.getElementById("calculatorDisplay").innerHTML = expression;
}

// Ensures no more than 27 characters fill the calculator display. This function is always called whenever populateDisplay is called.
function checkDisplayLength () {
	expression = document.getElementById("calculatorDisplay").innerHTML;

	if (expression.length >= 27) {
		clearDisplay();
		alert('Error: Exceeded maximum expression length of 27 characters.');
		return true;
	}
}

// Clears the display and resets the flag to 0.
function clearDisplay() {

	flag = 0;

	// Set the calculator display to a blinking underscore.
	document.getElementById("calculatorDisplay").innerHTML = '<blink>_</blink>';
	
}

// Called whenever a calculator symbol is clicked/pressed.
function populateDisplay(displayChar) {

	// Call this function to ensure the calculator display is no more than 27 characters.
	if (checkDisplayLength() === true) {
		return;
	}

	// Remove the blinking underscore before updating the inner HTML of the calculator Display.
	if(flag === 0){

		document.getElementById("calculatorDisplay").innerHTML = '';
	};

	// Set the flag to 1 so that the calculator display will not be cleared whenever there is at least 1 character in the calculator display.
	flag = 1;

	// Add additional characters to calculator display without removing previous characters.
	document.getElementById("calculatorDisplay").innerHTML += displayChar;
}

// Check if the string held in the calculator display is a proper expression before being evaluated by getResult. Uses regular expressions heavily.
function checkExpression (expression) {

	// Pressing '=' while the blinking underscore is present (i.e. no calculator symbol has been pressed yet) does nothing.
	if (expression === "<blink>_</blink>") {
		return true;
	}

	// Check for any invalid characters.
	if (/[^\d\+\-\*\/\.]/.test(expression)) {
		clearDisplay();
		alert('Error: Invalid character(s) - Must only include digits 0-9 and operator symbols.');
		return true;
	}

	// Check whether the expression starts with an operator symbol besides minus (negative).
	if (/^\+|^\*|^\//.test(expression)) {
		clearDisplay();
		alert('Error: Incomplete expression - Cannot start with +, *, or /.');
		return true;
	}

	// Check whether expression ends with an operator symbol.
	if (/\+$|\*$|\/$|\-$/.test(expression)) {
		clearDisplay();
		alert('Error: Incomplete expression - Cannot end with +, -, *, or /.');
		return true;
	}

	// Check whether expression has has 2 or more consecutive operator symbols and/or decimals. Exceptions are: +-, --, *-, and /- due to additive inverse arithmetic.
	if (/\+{2,}?|\-{3,}?|\*{2,}?|\/{2,}?|\.{2,}?|[\+|\*|\-|\/][\+|\*|\/]|[\+|\*|\-|\/][\+|\*|\-|\/][\+|\*|\-|\/]/.test(expression)) {
		clearDisplay();
		alert('Error: Invalid sequence - Cannot have 2 or more consecutive operator symbols and/or decimals. Exceptions are: +-, --, *-, and /-');
		return true;
	}

	// Change a decimal followed by an arbitrary amount of zeroes to '0' (e.g. .000000).
	if (/\.0{1,}$/.test(expression)) {
		document.getElementById("calculatorDisplay").innerHTML = '0';
		return true;
	}

	// Check whether a number has 2 or more decimals (e.g. 3.79.5).
	if (/\.[0-9]{0,}\./.test(expression)) {
		clearDisplay();
		alert('Error: Invalid sequence - Cannot have 2 or more decimals in a number.');
		return true;
	}

	// Check whether a decimal is followed by an operator(s).
	if (/\.[\+\-\*\/]{1,}/.test(expression)) {
			clearDisplay();
			alert('Error: Cannot have a decimal followed by an operator(s).');
			return true;
		}

	// Check whether a number ends in a decimal. If so, remove the decimal and update the calculator display.
	if (/[0-9]{1,}\.$/.test(expression)) {
		expression = expression.substring(0, expression.length - 1);
		document.getElementById("calculatorDisplay").innerHTML = expression;
		return true;
	}
}

function getResult() {
	// Grab the calculator display string.
	expression = document.getElementById("calculatorDisplay").innerHTML;

	// Call checkExpression and terminate the function if any tests are passed.
	if (checkExpression(expression) === true) {
		return;
	}

	// Append a zero to expression string if it starts with a '-'. This ensures the algorithm works properly.
	if (expression.charAt(0) === '-') {
		expression = '0' + expression;
	}

	// Replace any instances of '+-' with '-' since they are the same.
	if (/\+\-/.test(expression)) {
		expression = expression.replace(/\+\-/g, '-');
	}

	// Replace any instances of '--' with '+' since they are the same.
	if (/\-\-/.test(expression)) {
		expression = expression.replace(/\-\-/g, '+');
	}

	// Split the expression string up by operators and remove any empty spaces that arise(Not entirely sure why that happens). 
	// Create a copy of the expression array.
	expression = expression.split(/(\+|\-|\*|\/)/);
	expression = expression.filter(e => e != '');
	expressionCopy = expression.slice(0);

	// Perform arithmetic in accordance with PEMDAS until array is 1 character long which will be the result.
	while(expression.length > 1) {
		// Initialize two variables: keepGoing which will decide when to exit upcoming for loop and tempVal which will be used to update expression array.
		keepGoing = true;
		tempVal = 0;

		// Iterate over expression array performing appropriate operations. Whenever keepGoing is set to false, expression is updated and passed through this for loop again.
		// This is to ensure PEMDAS is considered and correct evaluation occurs.
		for (let i = 0; i < expression.length; i++) {

			// Handle '*' and '/' first.
			if (/\*|\//.test(expression.join(''))) {
				switch (expression[i]) {
					case '*':
						// Check for '*-' which means multiplication by a negative number. Evaluate result and replace all numbers/operators involved by the resulting number.
						if (expression[i+1] === '-') {
							tempVal = operators['*'](parseFloat(expression[i-1]), parseFloat(expression[i+2]));
							tempVal = tempVal * (-1);
							expressionCopy.splice((i-1), 4, tempVal);
							keepGoing = false;
							break;
						}
						else {
							tempVal = operators['*'](parseFloat(expression[i-1]), parseFloat(expression[i+1]));
							expressionCopy.splice((i-1), 3, tempVal);
							keepGoing = false;
							break;
						}
					case '/':
						// Check for '/-' which means multiplication by a negative number. Evaluate result and replace all numbers/operators involved by the resulting number.
						if (expression[i+1] === '-') {
							tempVal = operators['/'](parseFloat(expression[i-1]), parseFloat(expression[i+2]));
							tempVal = tempVal * (-1);
							expressionCopy.splice((i-1), 4, tempVal);
							keepGoing = false;
							break;
						}
						else {
							tempVal = operators['/'](parseFloat(expression[i-1]), parseFloat(expression[i+1]));
							expressionCopy.splice((i-1), 3, tempVal);
							keepGoing = false;
							break;
						}
				}
				// Exit for loop once an operation has taken place.
				if (!keepGoing) break;
			}
			if (!keepGoing) break;

			// Check for addition and/or subtraction while also ensure there is no more multiplication and/or division to be performed
			if (/\+|\-/.test(expression.join('')) && !/\*|\//.test(expression.join(''))) {
				switch (expression[i]) {
					case '+':
						tempVal = operators['+'](parseFloat(expression[i-1]), parseFloat(expression[i+1]));
						expressionCopy.splice((i-1), 3, tempVal);
						keepGoing = false;
						break;
					case '-':
						tempVal = operators['-'](parseFloat(expression[i-1]), parseFloat(expression[i+1]));
						expressionCopy.splice((i-1), 3, tempVal);
						keepGoing = false;
						break;
				}
				if (!keepGoing) break;
			}
			if (!keepGoing) break;
		}

		// Update expression with expressionCopy after the previous operation.
		expression = expressionCopy.slice(0);
		expressionCopy = expression.slice(0);
	}

	// Display the result in the calculator display. This is the first and only character in the expression array.
	document.getElementById("calculatorDisplay").innerHTML = `${expression[0]}`;
	
}