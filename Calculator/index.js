document.addEventListener('DOMContentLoaded', startCalculator);

let currentInput = ''; // Det nuvarande värdet man matar in.
let currentOperator = null; // Den nuvarande operatorn.
let lastResult = 0; // Det senaste resultatet.
let isNewNumber = true; // Indikerar om man börjat skriva in ett nytt tal.
let ongoingExpression = ''; // Det pågående uttrycket.

// Hämtar element från HTML som ska uppdateras.
const resultElement = document.getElementById('result');
const inputElement = document.getElementById('input');
const historyElement = document.querySelector('.history');


function startCalculator() {
    // Uppdaterar displayen med nuvarande input och resultat.
    function updateDisplay() {
        inputElement.textContent = currentInput || '0';
        resultElement.textContent = lastResult;
    }

    // Lägger till historik.
    function addHistoryEntry(expression, result) {
        const li = document.createElement('li');
        li.innerHTML = `<code>${expression} = ${result}</code>`;
        historyElement.appendChild(li);
    }

    // Rensar miniräknaren och historik/Reset.
    function clear() {
        currentInput = '';
        currentOperator = null;
        lastResult = 0;
        isNewNumber = true;
        ongoingExpression = '';
        updateDisplay();
        historyElement.innerHTML = '';
    }

    // Utför beräkningar baserat på input och operator.
    function calculate() {
        const inputNumber = parseFloat(currentInput);
        if (isNaN(inputNumber) && currentOperator !== '√x' && currentOperator !== 'x^2') return;

        // Uträkningsätt.
        let expression = ongoingExpression;
        if (currentOperator) {
            switch (currentOperator) {
                case '+':
                    lastResult += inputNumber;
                    expression += ` ${inputNumber}`;
                    break;
                case '-':
                    lastResult -= inputNumber;
                    expression += ` ${inputNumber}`;
                    break;
                case '*':
                    lastResult *= inputNumber;
                    expression += ` ${inputNumber}`;
                    break;
                case '/':
                    lastResult /= inputNumber;
                    expression += ` ${inputNumber}`;
                    break;
                case '√x':
                    lastResult = Math.sqrt(lastResult);
                    expression = `√${lastResult}`;
                    break;
                case 'x^2':
                    lastResult = Math.pow(lastResult, 2);
                    expression = `${lastResult}^2`;
                    break;
                default:
                    lastResult = inputNumber;
                    expression = `${inputNumber}`;
                    break;
            }
        } else {
            lastResult = inputNumber;
            expression = `${inputNumber}`;
        }

        ongoingExpression = expression;
        addHistoryEntry(expression, lastResult);

        currentInput = '';
        isNewNumber = true;
        updateDisplay();
        setButtonState(true); // vänta på siffra.
    }

    // Ställer in knapparnas tillstånd (om de är aktiva eller ej)
    function setButtonState(expectNumber) {
        // Aktivera eller inaktivera sifferknappar.
        document.querySelectorAll('.digit').forEach(button => {
            if (expectNumber) {
                button.removeAttribute('disabled');
            } else {
                button.setAttribute('disabled', 'disabled');
            }
        });
        // Aktivera eller inaktivera operator-knappar.
        document.querySelectorAll('.op').forEach(button => {
            if (expectNumber) {
                button.setAttribute('disabled', 'disabled');
            } else {
                button.removeAttribute('disabled');
            }
        });
    }

    // Lägg till klickhändelser för siffer-knapparna.
    document.querySelectorAll('.digit').forEach(function (button) {
        button.addEventListener('click', function () {
            // Hantera knapptryckningar beroende på om vi väntar på ett nytt tal.
            if (isNewNumber) {
                currentInput = button.textContent;
                isNewNumber = false;
            } else {
                currentInput += button.textContent;
            }
            updateDisplay();
            setButtonState(false); // Stäng av siffror , ta emot operator.
        });
    });

    // Lägg till klickhändelser för operator-knapparna.
    document.querySelectorAll('.op').forEach(function (button) {
        button.addEventListener('click', function () {
            const operator = button.textContent.trim();

            if (operator === 'Clear') {
                // Rensa miniräknaren om 'Clear' är valt.
                clear();
                addHistoryEntry('Clear', '');
                setButtonState(true); // Stäng av operator, ta emot siffror.
                return;
            }

            if (currentInput !== '') {
                calculate();
            }

            if (operator !== '√x' && operator !== 'x^2') {
                ongoingExpression += ` ${operator}`;
                currentOperator = operator;
            } else {
                currentOperator = operator;
                calculate();
            }

            currentInput = '';
            isNewNumber = true;
            setButtonState(true); // Stäng av operator, ta emot siffror.
            updateDisplay();
        });

        // Lägger till stöd för tangentbord
        document.addEventListener('keydown', function (event) {
            const key = event.key;
            if (key >= '0' && key <= '9') {
                document.querySelector(`.b${key}`).click();
            } else if (key === '+') {
                document.querySelector('.badd').click();
            } else if (key === '-') {
                document.querySelector('.bsub').click();
            } else if (key === '*') {
                document.querySelector('.bmul').click();
            } else if (key === '/') {
                document.querySelector('.bdiv').click();
            } else if (key.toLowerCase() === 'c') {
                document.querySelector('.bclear').click();
            }
        });

    });
};



// Rensa miniräknarens display och historik/vid start eller clear.
clear();


//starta miniräknaren.
startCalculator();
