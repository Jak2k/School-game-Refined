import "../../style.css";
import "./Tetris.css";
import { type ServerHTML, ServerMeta, Init } from "../../renderer/types";

//define classList in the server site to avoid error

if (typeof document === "undefined") {
  // @ts-ignore
  global.document = {
    querySelector: () => {},
    querySelectorAll: () => [],
    createElement: () => {},
  };
}

let squares: HTMLDivElement[] = [];
const startBtn = document.querySelector("#start-button")!;
let nextRandom = 0;
let currentPosition = 0;
let currentTetrominoe = 0;
let currentColor = 0;
let filledsquares = [];
const theTetrominoes = [
  [
    currentPosition + 0,
    currentPosition + 10,
    currentPosition + 20,
    currentPosition + 21,
  ], // lTetromino
  [
    currentPosition + 0,
    currentPosition + 1,
    currentPosition + 11,
    currentPosition + 12,
  ], // zTetromino
  [
    currentPosition + 0,
    currentPosition + 1,
    currentPosition + 2,
    currentPosition + 11,
  ], // tTetromino
  [
    currentPosition + 0,
    currentPosition + 1,
    currentPosition + 10,
    currentPosition + 11,
  ], // oTetromino
  [
    currentPosition + 0,
    currentPosition + 10,
    currentPosition + 20,
    currentPosition + 30,
  ], // iTetromino
];

const colors = ["orange", "red", "purple", "green", "blue", "yellow", "cyan"];

function createGrid() {
  const grid = document.querySelector(".grid")!;
  for (let i = 0; i < 200; i++) {
    const div = document.createElement("div");
    div.innerHTML = i.toString();
    div.classList.add("grid-item");
    div.id = i.toString();
    div.style.backgroundColor = "black";
    div.style.borderBlockColor = "white";
    squares.push(div);
    grid.appendChild(div);
  }
}

export const serverHTML: ServerHTML = () => `
    <a href="..">Back</a>
    <div class="grid">
    </div>
    <button id="start-button">Start</button>
`;

export const serverMeta: ServerMeta = () => {
  return {
    title: "Tetris",
    description: "This is the description of the page",
  };
};

export const init: Init = () => {
  createGrid();
  startBtn.addEventListener("click", () => {
    newTetrominoe();
    displayShape();
    let timerId = setInterval(moveDown, 1000);
  });
  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowLeft":
        moveLeft();
        break;
      case "ArrowRight":
        moveRight();
        break;
      // case "ArrowDown":
      //  moveDown();
      //  break;
      default:
        break;
    }
  });
};

function newTetrominoe() {
  currentTetrominoe = Math.floor(Math.random() * theTetrominoes.length);
  currentColor = Math.floor(Math.random() * colors.length);
}

function moveLeft() {
  if (currentPosition % 10 === 0) {
    return;
  }
  currentPosition--;
  undraw();
  displayShape();
}

function moveRight() {
  if (currentPosition % 10 === 9) {
    return;
  }
  currentPosition++;
  undraw();
  displayShape();
}

function moveDown() {
  undraw();
  currentPosition += 10;
  displayShape();
}

function displayShape() {
  theTetrominoes[currentTetrominoe].forEach((index: any) => {
    index += currentPosition;
    squares[index].style.backgroundColor = colors[currentColor];
  });
}

function undraw() {
  theTetrominoes[currentTetrominoe].forEach((index: any) => {
    if (index >= 190) {
      newTetrominoe();
      return;
    }
  });
  squares.forEach((index: any) => {
    squares[index.id].style.backgroundColor = "black";
  });
}
