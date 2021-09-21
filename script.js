const RANDOM_QUOTE_API_URL = "http://api.quotable.io/random";
const quoteDisplayElement = document.getElementById("quoteDisplay");
const quoteInputElement = document.getElementById("quoteInput");
const timerElement = document.getElementById("timer");
const speedValueElement = document.getElementById("speedValue");
const accuracyValueElement = document.getElementById("accuracyValue");
const clickSound = new Audio("click.mp3");

let timerStarted = false;
let count = 0;
let errorCount = 0;

const keyList = [
  8, 13,  32,  37,  38,  39,  40,  46,  48,  49, 50,
 51, 52,  53,  54,  55,  56,  57,  59,  61,  65, 66,
 67, 68,  69,  70,  71,  72,  73,  74,  75,  76, 77,
 78, 79,  80,  81,  82,  83,  84,  85,  86,  87, 88,
 89, 90, 173, 188, 190, 191, 192, 219, 220, 221, 222
];

document.addEventListener("keydown", function (e) {
  console.log("clicked and playing sound");
  console.log(e.keyCode);
  if(keyList.includes(e.keyCode)){
    quoteInputElement.focus();
    // clickSound.currentTime = 0;
    // clickSound.play();
  }
});

quoteInputElement.addEventListener("input", () => {
  const arrayQuote = quoteDisplayElement.querySelectorAll("span");
  const arrayValue = quoteInputElement.value.split("");
  let finishedTyping = true;
  count += 1;
  if (count === 1) {
    startTimer();
  }
  arrayQuote.forEach((characterSpan, index) => {
    const character = arrayValue[index];
    if (character == null) {
      characterSpan.classList.remove("correct");
      characterSpan.classList.remove("incorrect");
      finishedTyping = false;
    } else if (character === characterSpan.innerText) {
      characterSpan.classList.add("correct");
      characterSpan.classList.remove("incorrect");
    } else {
      characterSpan.classList.remove("correct");
      characterSpan.classList.add("incorrect");
      errorCount++;
      finishedTyping = false;
    }
  });

  renderTypingSpeed(arrayValue.length);

  renderAccuracy(arrayValue.length);

  if (finishedTyping) {
    renderNewQuote();
  }
});

function getRandomQuote() {
  return fetch(RANDOM_QUOTE_API_URL)
    .then((response) => response.json())
    .then((data) => data.content);
}

async function renderNewQuote() {
  count = 0;
  errorCount = 0;
  stopTimer();
  const quote = await getRandomQuote();
  quoteDisplayElement.innerHTML = "";
  quote.split("").forEach((character) => {
    const characterSpan = document.createElement("span");
    characterSpan.innerText = character;
    quoteDisplayElement.appendChild(characterSpan);
  });
  quoteInputElement.value = null;
}

function renderTypingSpeed(NoOfChars) {
  if(timeTaken === 0){
    timeTaken = 1;
  }
  speed = NoOfChars / 5 / (timeTaken / 60);
  speed = speed.toFixed(1);
  while (speedValueElement.firstChild) {
    speedValueElement.removeChild(speedValueElement.firstChild);
  }
  resultSpan = document.createElement("span");
  resultSpan.innerText = speed;
  speedValueElement.appendChild(resultSpan);
}

function renderAccuracy(NoOfChars) {
  let accuracy = ((NoOfChars - errorCount) / NoOfChars) * 100;
  accuracy = accuracy.toFixed(1);
  if (accuracy < 0) {
    accuracy = 0;
  }
  while (accuracyValueElement.firstChild) {
    accuracyValueElement.removeChild(accuracyValueElement.firstChild);
  }
  resultSpan = document.createElement("span");
  resultSpan.innerText = accuracy;
  accuracyValueElement.appendChild(resultSpan);
}

// Setting the timer
let startTime;
let timerInterval;
let timeTaken = 0;
function startTimer() {
  timerElement.innerText = 0;
  startTime = new Date();
  timerInterval = setInterval(() => {
    timeTaken = getTimerTime();
    timerElement.innerText = timeTaken;
  }, 1000);
}

function getTimerTime() {
  return Math.floor((new Date() - startTime) / 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerElement.innerText = 0;
}

renderNewQuote();
