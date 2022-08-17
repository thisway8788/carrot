"use strict";

const CARROT_SIZE = 80;
const CARROT_COUNT = 5;
const BUG_COUNT = 5;
const GAME_DURATION_SEC = 5;

const field = document.querySelector(".game__field");
// field의 전체적인 포지션을 알수가있다
const fieldRect = field.getBoundingClientRect();
const gameBtn = document.querySelector(".game__button");
const gameTimer = document.querySelector(".game__timer");
const gameScore = document.querySelector(".game__score");

const popUp = document.querySelector(".pop-up");
const popUpText = document.querySelector(".pop-up__message");
const popUpRefresh = document.querySelector(".pop-up__refresh");

let started = false;
let score = 0;
let timer = undefined;

field.addEventListener("click", onFieldClick);
gameBtn.addEventListener("click", () => {
  if (started) {
    stopGame();
  } else {
    startGame();
  }
  started = !started;
});

popUpRefresh.addEventListener("click", () => {
  startGame();
  hidePopUp();
});

const startGame = () => {
  initGame();
  showStopButton();
  showTimerAndScore();
  startGameTimer();
};

const stopGame = () => {
  stopGameTimer();
};

function finishGame(win) {
  started = false;
  hideGameButton();
  if (win) {
    playSound(winSound);
  } else {
    playSound(bugSound);
  }
  stopGameTimer();
  stopSound(bgSound);
  showPopUpWithText(win ? "YOU WON 🎉" : "YOU LOST 💩");
}

const showStopButton = () => {
  const icon = gameBtn.querySelector(".fa-play");
  icon.classList.add("fa-stop");
  icon.classList.remove("fa-play");
};

const hideGameButton = () => {
  gameBtn.style.visibility = "hidden";
};

const showTimerAndScore = () => {
  gameTimer.style.visibility = "visible";
  gameScore.style.visibility = "visible";
};

const startGameTimer = () => {
  let remainingTimeSec = GAME_DURATION_SEC;
  updateTimerText(remainingTimeSec);
  timer = setInterval(() => {
    if (remainingTimeSec <= 0) {
      clearInterval(timer);
      finishGame(CARROT_COUNT === score);
      return;
    }
    updateTimerText(--remainingTimeSec);
  }, 1000);
};

const stopGameTimer = () => {
  clearInterval(timer);
  hideGameButton();
  showPopUpWithText("REPLAY⁉️");
};

const updateTimerText = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  gameTimer.innerText = `${minutes}:${seconds}`;
};

const showPopUpWithText = (text) => {
  popUpText.innerText = text;
  popUp.classList.remove("pop-up--hide");
};

// LEt THE GAME START
function initGame() {
  field.innerHTML = "";
  gameScore.innerHTML = CARROT_COUNT;
  // making bug and Carrot on field
  addItem("carrot", CARROT_COUNT, "img/carrot.png");
  addItem("bug", BUG_COUNT, "img/bug.png");
}

function onFieldClick(event) {
  if (!started) {
    return;
  }
  const target = event.target;
  if (target.matches(".carrot")) {
    target.remove();
    score++;
    updateScoreBoard();
    if (score === CARROT_COUNT) {
      finishGame(true);
    }
  } else if (target.matches(".bug")) {
    stopGameTimer();
    finishGame(false);
  }
}

function finishGame(win) {
  started = false;
  hideGameButton();
  showPopUpWithText(win ? "You Won" : "You Lost");
}

const updateScoreBoard = () => {
  gameScore.innerText = score;
};

const addItem = (className, count, imgPath) => {
  const x1 = 0;
  const y1 = 0;
  const x2 = fieldRect.width - CARROT_SIZE;
  const y2 = fieldRect.height - CARROT_SIZE;

  for (let i = 0; i < count; i++) {
    const item = document.createElement("img");
    item.setAttribute("class", className);
    item.setAttribute("src", imgPath);
    item.style.position = "absolute";
    const x = randomNumber(x1, x2);
    const y = randomNumber(y1, y2);
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
    field.appendChild(item);
  }
};

const randomNumber = (min, max) => Math.random() * (max - min) + min;
