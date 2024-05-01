let focusBtn = document.getElementById("focus");
let buttons = document.querySelectorAll(".btn");
let shortBreak = document.getElementById("short-break");
let longBreak = document.getElementById("long-break");
let startBtn = document.getElementById("start");
let resetBtn = document.getElementById("reset");
let pause = document.getElementById("pause");
let customBtn = document.getElementById("custom-time");
let customTimeForm = document.getElementById("custom-time-form");
let time = document.getElementById("time");
let set;
let activeWindow = "focus";
let paused = true;
let minCount = 24;
let secCount = 59;
let customMins = 24;
let customSecs = 59;
time.textContent = `${minCount + 1}:00`;

const appendZero = (value) => {
  value = value < 10 ? `0${value}` : value;
  return value;
};

const click = new Audio("./audio/click.mp3");
const end = new Audio("./audio/catmeow.wav");
const interactSound = new Audio("./audio/btnClick.mp3");

function clickButton(btn) {
  btn.play();
  btn.currentTime = 0;
}

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
  secCount = 59;
  switch (activeWindow) {
    case "long":
      minCount = 14;
      break;
    case "short":
      minCount = 4;
      break;
    case "custom":
      minCount = customMins;
      secCount = customSecs;
      break;
    default:
      minCount = 24;
      break;
  }
  if (activeWindow === "short") {
    time.textContent = `${appendZero(
        minCount + 1)}:00`
  } else if (activeWindow === "custom") {
    const firstSec = (secCount + 1) % 60;
    const firstMin = minCount + (firstSec === 0 ? 1 : 0);
    time.textContent = `${appendZero(firstMin)}:${appendZero(firstSec)}`;
  } else {
    time.textContent = `${minCount + 1}:00`;
  }
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
        ;
      }
      ;
      if (minCount == 0 && secCount <= 5 && secCount != 0) {
        click.play();
      }
      if (minCount <= 0 && secCount <= 0) {
        end.play();
        pauseTimer();
        time.textContent = "00:00";
      }
    }, 1000);
  }
};

// FOCUS BUTTON
focusBtn.addEventListener("click", () => {
  clickButton(interactSound);
  activeWindow = "focus";
  resetTimer();
});

// SHORT BREAK BUTTON
shortBreak.addEventListener("click", () => {
  clickButton(interactSound);
  activeWindow = "short";
  resetTimer();
});

// LONG BREAK BUTTON
longBreak.addEventListener("click", () => {
  clickButton(interactSound);
  activeWindow = "long";
  resetTimer();
});

// PAUSE BUTTON
pause.addEventListener("click", () => {
  clickButton(interactSound);
  pauseTimer();
});

// START BUTTON
startBtn.addEventListener("click", () => {
  clickButton(interactSound);
  startTimer();
  resetBtn.classList.add("show");
  pause.classList.add("show");
  startBtn.classList.add("hide");
  startBtn.classList.remove("show");
});

// RESET BUTTON
resetBtn.addEventListener("click", () => {
  clickButton(interactSound);
  resetTimer();
});

// CUSTOM BUTTON
customBtn.addEventListener("click", () => {
  clickButton(interactSound);
  pauseTimer();
  const dialog = document.getElementById("custom-time-dialog");
  dialog.showModal();
})

// CUSTOM TIME FORM
customTimeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const minute1 = parseInt(
      customTimeForm.querySelector("input[name='minute-1']").value);
  const minute2 = parseInt(
      customTimeForm.querySelector("input[name='minute-2']").value);
  const second1 = parseInt(
      customTimeForm.querySelector("input[name='second-1']").value);
  const second2 = parseInt(
      customTimeForm.querySelector("input[name='second-2']").value);
  customMins = minute1 * 10 + minute2;
  customSecs = (second1 * 10 + second2 - 1) % 60;
  if (customSecs < 0) {
    customSecs += 60;
    if (customMins > 0) {
      customMins--;
    }
  }
  activeWindow = "custom";
  resetTimer();
  const dialog = document.getElementById("custom-time-dialog");
  dialog.close();
});
customTimeForm.addEventListener("reset", () => {
  const dialog = document.getElementById("custom-time-dialog");
  dialog.close();
})
customTimeForm.querySelectorAll("button[data-direction]").forEach((button) => {
  button.addEventListener("click", updateCustomTime);
});

/**
 * @function updateCustomTime
 * @description Update the custom values, intended to be called from buttons
 * @param {PointerEvent} event
 * @returns {void}
 */
function updateCustomTime(event) {
  const direction = event.currentTarget.dataset.direction;
  const value = event.currentTarget.dataset.value;

  let second1 = parseInt(
      customTimeForm.querySelector("input[name='second-1']").value);
  let second2 = parseInt(
      customTimeForm.querySelector("input[name='second-2']").value);
  let minute1 = parseInt(
      customTimeForm.querySelector("input[name='minute-1']").value);
  let minute2 = parseInt(
      customTimeForm.querySelector("input[name='minute-2']").value);
  switch (value) {
    case "minute-1":
      minute1 = minute1 + (direction === "up" ? 1 : -1);
      break;
    case "minute-2":
      minute2 = minute2 + (direction === "up" ? 1 : -1);
      break;
    case "second-1":
      second1 = second1 + (direction === "up" ? 1 : -1);
      break;
    case "second-2":
      second2 = second2 + (direction === "up" ? 1 : -1);
      break;
  }
  let seconds = second1 * 10 + second2;
  let minutes = minute1 * 10 + minute2;
  if (seconds > 59) {
    seconds -= 60;
    minutes++;
  }
  if (seconds < 0) {
    seconds += 60;
    minutes--;
  }
  if (minutes < 0) {
    minutes = 0;
  }
  if (minutes > 99) {
    minutes = 99;
  }
  customTimeForm.querySelector("input[name='second-1']").value = Math.floor(
      seconds / 10);
  customTimeForm.querySelector("input[name='second-2']").value = seconds % 10;
  customTimeForm.querySelector("input[name='minute-1']").value = Math.floor(
      minutes / 10);
  customTimeForm.querySelector("input[name='minute-2']").value = minutes % 10;
}


