import "../../style.css";
import "./snake.css";
import { type ServerHTML, ServerMeta, Init } from "../../renderer/types";

let currentSnake: number[] = [];
let fieldsize: number = 15;
let direction: number = 1;
let timerId: number | undefined;
let apple: number;
let running: boolean = false;
let appleblock: number;

function createGrid() {
  let grid = "";
  for (let i = 0; i < Math.pow(fieldsize, 2); i++) {
    grid += `<div class="grid-item" style="background-color: black; border-color: white"
       id="${i.toString()}"></div>`;
  }

  return grid;
}

export const serverHTML: ServerHTML = () => `
<a href="/">Back</a>
  <div class="grid">
    ${createGrid()}
  </div>
  <button id="start">Start</button>
  <dialog id="dialog">Game Over! 
  <button onclick="document.querySelector('#dialog').close()">Close</button>
  </diaglog>
  `;

export const serverMeta: ServerMeta = () => {
  return {
    title: "Snake",
    description: "This is the description of the page",
  };
};

export const init: Init = () => {
  const startbtn = document.querySelector("#start");
  startbtn?.addEventListener("click", () => {
    if (running) {
      return;
    }
    running = true;
    createsnake();
    spawnapple();
    timerId = setInterval(movesnake, 200);
    document.addEventListener("keydown", (e) => {
      e.preventDefault();
      switch (e.key) {
        case "ArrowUp":
          if (checkrotation(-fieldsize) == false) {
            break;
          }
          direction = -fieldsize;
          break;
        case "ArrowDown":
          if (checkrotation(fieldsize) == false) {
            break;
          }
          direction = fieldsize;
          break;
        case "ArrowLeft":
          if (checkrotation(-1) == false) {
            break;
          }
          direction = -1;
          break;
        case "ArrowRight":
          if (checkrotation(1) == false) {
            break;
          }
          direction = 1;
          break;
      }
    });
  });
};

function checkrotation(snakedirection: number) {
  let rotateable: boolean = true;
  if (currentSnake.includes(currentSnake[0] + snakedirection)) {
    rotateable = false;
  }
  return rotateable;
}

function createsnake() {
  currentSnake.push(190, 189, 188);
  display();
}

function display() {
  currentSnake.forEach((index) => {
    document.getElementById(index.toString())!.style.backgroundColor =
      "#427c26";
  });
}

function undraw() {
  currentSnake.forEach((index) => {
    document.getElementById(index.toString())!.style.backgroundColor = "black";
  });
}

function movesnake() {
  undraw();
  appleblock = currentSnake[currentSnake.length - 1];
  currentSnake.pop();
  let head = currentSnake[0] + direction;
  currentSnake.unshift(head);
  checkcollision();
  eatapple();
  display();
}

function clearfield() {
  for (let i = 0; i < Math.pow(fieldsize, 2); i++) {
    document.getElementById(i.toString())!.style.backgroundColor = "black";
  }
}

function endgame() {
  const dialog = document.querySelector("#dialog") as HTMLDialogElement;
  dialog.showModal();
  clearInterval(timerId);
  clearfield();
  currentSnake = [];
  running = false;
  direction = 1;
}

function checkcollision() {
  if (
    (currentSnake[0] % fieldsize == fieldsize - 1 && direction == -1) ||
    (currentSnake[0] % fieldsize == 0 && direction == 1) ||
    (currentSnake[0] < 0 && direction == -fieldsize) ||
    (currentSnake[0] > Math.pow(fieldsize, 2) && direction == fieldsize)
  ) {
    endgame();
  }
  if (currentSnake.slice(1).includes(currentSnake[0])) {
    endgame();
  }
}

function eatapple() {
  if (currentSnake[0] == apple) {
    currentSnake.push(appleblock);
    spawnapple();
  }
}

function spawnapple() {
  apple = Math.floor(Math.random() * Math.pow(fieldsize, 2));
  while (currentSnake.includes(apple)) {
    apple = Math.floor(Math.random() * Math.pow(fieldsize, 2));
  }
  document.getElementById(apple.toString())!.style.backgroundColor = "red";
}
