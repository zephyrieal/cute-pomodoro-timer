let focusBtn = document.getElementById("focus");
let buttons = document.querySelectorAll(".btn");
let shortBreak = document.getElementById("short-break");
let longBreak = document.getElementById("long-break");
let startBtn = document.getElementById("start");
let resetBtn = document.getElementById("reset");
let pause = document.getElementById("pause");
let time = document.getElementById("time");
let set;
let activeWindow = "focus";
let secCount = 59;
let paused = true;
let minCount = 24;
time.textContent = `${minCount + 1}:00`;

const appendZero = (value) => {
  value = value < 10 ? `0${value}` : value;
  return value;
};

const click = new Audio("./click.mp3");
const end = new Audio("./catmeow.wav");

function pauseTimer() {
  paused = true;
  clearInterval(set);
  pause.classList.add("hide");
  pause.classList.remove("show");
  startBtn.classList.remove("hide");
  startBtn.classList.add("show");
};

function resetTimer() {
  pauseTimer();
  switch (activeWindow) {
    case "long":
      minCount = 14;
      break;
    case "short":
      minCount = 4;
      break;
    default:
      minCount = 24;
      break;
  }
  secCount = 59;
  if (activeWindow === "short") time.textContent = `${appendZero(minCount + 1)}:00`
  else time.textContent = `${minCount + 1}:00`;
};

function startTimer() {
  if (paused) {
    paused = false;
    time.textContent = `${appendZero(minCount)}:${appendZero(secCount)}`;
    set = setInterval(() => {
      secCount--;
      time.textContent = `${appendZero(minCount)}:${appendZero(secCount)}`;
      if (secCount == 0) {
        if (minCount != 0) {
          minCount--;
          secCount = 60;
        } else {
          clearInterval(set);
        }
      }
      if (minCount == 0 && secCount <= 5 && secCount != 0) click.play();
      if (minCount == 0 && secCount == 0) end.play();
    }, 1000);
  }
};

// FOCUS BUTTON
focusBtn.addEventListener("click", () => {
  activeWindow = "focus";
  resetTimer();
});

// SHORT BREAK BUTTON
shortBreak.addEventListener("click", () => {
  activeWindow = "short";
  resetTimer();
});

// LONG BREAK BUTTON
longBreak.addEventListener("click", () => {
  activeWindow = "long";
  resetTimer();
})

// PAUSE BUTTON
pause.addEventListener("click", pauseTimer);

// START BUTTON
startBtn.addEventListener("click", () => {
  startTimer();
  resetBtn.classList.add("show");
  pause.classList.add("show");
  startBtn.classList.add("hide");
  startBtn.classList.remove("show");

});

// RESET BUTTON
resetBtn.addEventListener("click", resetTimer);



