let maxNumber = 0;
let randomNumber = 0;
let selectedLevel = false;
let attempts = 0;
let previousNumbers = [];

const levelButtons = [
  document.getElementById("easyLevel"),
  document.getElementById("normalLevel"),
  document.getElementById("hardLevel"),
  document.getElementById("veryHardLevel"),
];

const colorClasses = {
    "near": "near-number",
    "far": "far-number",
    "very far": "very-far-number",
    "correct": "correct-number",
};

const $helpDialog = document.getElementById("help");
const $closeHelp = document.getElementById("closeHelp");
const $openHelp = document.getElementById("openHelp");

const $winDialog = document.getElementById("win");
const $closeWin = document.getElementById("closeWin");
const $winAttempts = document.getElementById("winAttempts");
const $winSecretNumber = document.getElementById("winSecretNumber");
const $winAllNumbers = document.getElementById("winAllNumbers");

const $userNumber = document.getElementById("userNumber");
const $submitNumber = document.getElementById("submitNumber");

const $prevNums = document.getElementById("prevNums");

const $attempts = document.getElementById("attempts");

const $restart = document.getElementById("restart");

levelButtons.forEach((button) => {
  button.addEventListener("click", () => {
    maxNumber = button.dataset.maxNum;
    clearActiveLevel();
    button.dataset.active = "true";
    hideOtherLevels(button);
    getRandomNumber();
    selectedLevel = true;
    $userNumber.disabled = false;
    $submitNumber.ariaDisabled = false;
    $restart.ariaDisabled = false;
    $userNumber.focus();
  });
});

$openHelp.addEventListener("click", () => {
  $helpDialog.showModal();
});

$closeHelp.addEventListener("click", () => {
  $helpDialog.close();
});

$submitNumber.addEventListener("click", () => {
    checkNumber();
});

$userNumber.addEventListener("keydown", (event) => {
    if (event.key === 'Enter'){
        checkNumber();
    }
});

$restart.addEventListener("click", () => {
    restartGame();
});

$closeWin.addEventListener("click", () => {
    $winDialog.close();
    restartGame();
});

function clearActiveLevel() {
  levelButtons.forEach((button) => {
    button.dataset.active = "false";
  });
}

function hideOtherLevels(currentLevel) {
  levelButtons.forEach((button) => {
    if (button !== currentLevel) {
      button.style.display = "none";
    }
  });

  currentLevel.parentElement.style.justifyContent = "center";
}

function getRandomNumber() {
  randomNumber = Math.floor(Math.random() * maxNumber) + 1;
}

function checkNumber() {
    if (!selectedLevel) return;

    const userNumber = parseInt($userNumber.value);

    if (isNaN(userNumber) || userNumber > maxNumber){
        $userNumber.value = '';
        $userNumber.focus();
        return;
    };

    const numberColor = colorClasses[calculateNumberDifference(userNumber)];

    const currentNumber = {
        number: userNumber,
        color: numberColor,
    };

    const duplicatedNumber = previousNumbers.some(({number}) => number === userNumber);

    if (duplicatedNumber){
        $userNumber.value = '';
        $userNumber.focus();
        return;
    };

    previousNumbers.push(currentNumber);

    attempts++;
    $attempts.innerHTML = attempts;

    $userNumber.value = '';
    $userNumber.focus();

    printPreviousNumbers();

    if (userNumber === randomNumber) {
        $winDialog.showModal();
        $winAttempts.innerHTML = attempts;
        $winSecretNumber.innerHTML = randomNumber;
        previousNumbers.reverse().forEach(({number, color}) => {
            $winAllNumbers.innerHTML += `<li class="${color}">${number}</li>`;
          });
    }
}

function printPreviousNumbers() {
  $prevNums.innerHTML = "";
  const lastNumbers = previousNumbers.slice(-7).reverse();
  lastNumbers.forEach(({number, color}) => {
    $prevNums.innerHTML += `<li class="${color}">${number}</li>`;
  });
}

function calculateNumberDifference(number) {
    const difference = Math.abs(number - randomNumber);
    if (difference === 0) {
        return 'correct';
    } else if (difference <= 5) {
        return 'near';
    } else if (difference <= 10) {
        return 'far';
    } else{
        return 'very far';
    }
}

function restartGame() {
    if (!selectedLevel) return;

    const currentLevel = levelButtons.find((button) => button.dataset.active === "true");
    maxNumber = 0;
    randomNumber = 0;
    selectedLevel = false;
    attempts = 0;
    previousNumbers = [];

    $userNumber.value = '';
    $userNumber.disabled = true;
    $submitNumber.ariaDisabled = true;
    $restart.ariaDisabled = true;
    $attempts.innerHTML = attempts;

    $prevNums.innerHTML = "";

    currentLevel.parentElement.style.justifyContent = "space-between";
    currentLevel.dataset.active = "false";

    levelButtons.forEach((button) => {
        button.style.display = "block";
    });
}