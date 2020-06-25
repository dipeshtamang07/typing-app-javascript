const RANDOM_QUOTE_API_URL = "http://api.quotable.io/random";
const quoteDisplayElement = document.getElementById("quoteDisplay");
const quoteInputElement = document.getElementById("quoteInput");
const timerElement = document.getElementById("timer");
const resultElement = document.getElementById("result");
const clickSound = new Audio("click.mp3");

let timerStarted = false;
let count = 0;

document.addEventListener("keydown", function (e) {
  console.log("clicked and playing sound");
  clickSound.currentTime = 0;
  clickSound.play();
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
      finishedTyping = false;
    }
  });
  if (finishedTyping) {
    renderNewQuote();
    count = 0;
    stopTimer();
    renderTypingSpeed(arrayQuote.length);
  }
});

function getRandomQuote() {
  return fetch(RANDOM_QUOTE_API_URL)
    .then((response) => response.json())
    .then((data) => data.content);
}

async function renderNewQuote() {
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
  speed = Math.floor(NoOfChars / 5 / (timeTaken / 60));
  console.log(speed);
  while (resultElement.firstChild) {
    resultElement.removeChild(resultElement.firstChild);
  }
  resultSpan = document.createElement("span");
  resultSpan.innerText = "Your typing speed was " + speed + "wpm";
  resultElement.appendChild(resultSpan);
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
