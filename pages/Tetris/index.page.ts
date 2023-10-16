import "../../style.css";
import "./Tetris.css";
import { type ServerHTML, ServerMeta, Init } from "../../renderer/types";

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
let currentPosition = 0;
let currentTetrominoe = 0;
let currentColor = 0;
let filledsquares: any[][] = [];
let running = false;
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
    let timerId = setInterval(moveDown, 200);
    running = true;
  });

  document.addEventListener("keydown", (e) => {
    if (running === false) {
      return;
    }
    switch (e.key) {
      case "ArrowLeft":
        moveLeft();
        break;
      case "ArrowRight":
        moveRight();
        break;
      case "ArrowDown":
        moveDown();
        break;
      default:
        break;
    }
  });
};

function newTetrominoe() {
  currentTetrominoe = Math.floor(Math.random() * theTetrominoes.length);
  currentColor = Math.floor(Math.random() * colors.length);
}

function saveTetrominoe() {
  theTetrominoes[currentTetrominoe].forEach((index: any) => {
    filledsquares.push([index + currentPosition, colors[currentColor]]);
  });
  currentPosition = 0;
  newTetrominoe();
  displayShape();
}

function moveLeft() {
  if (currentPosition % 10 === 0) {
    return;
  }
  let end = false;
  for (let i = 0; i < theTetrominoes[currentTetrominoe].length; i++) {
    const index = currentPosition + theTetrominoes[currentTetrominoe][i];

    filledsquares.forEach((filledsquare) => {
      if (filledsquare[0] === index - 1) {
        end = true;
      }
    });
  }
  if (end) {
    return;
  }
  currentPosition--;
  undraw();
  displayShape();
}

function moveRight() {
  let end = false;
  for (let i = 0; i < theTetrominoes[currentTetrominoe].length; i++) {
    const index = currentPosition + theTetrominoes[currentTetrominoe][i];

    if ((index + 1) % 10 === 0) {
      end = true;
    }
    filledsquares.forEach((filledsquare) => {
      if (filledsquare[0] === index + 1) {
        end = true;
      }
    });
  }
  if (end) {
    return;
  }

  currentPosition++;
  undraw();
  displayShape();
}

function moveDown() {
  let end = false;
  theTetrominoes[currentTetrominoe].forEach((index: any) => {
    if (index + currentPosition >= 190) {
      end = true;
    }
    filledsquares.forEach((filledsquare) => {
      if (filledsquare[0] === index + currentPosition + 10) {
        end = true;
      }
    });
  });
  if (end) {
    saveTetrominoe();
    return;
  }
  undraw();
  currentPosition += 10;
  displayShape();
}

function displayShape() {
  theTetrominoes[currentTetrominoe].forEach((index: any) => {
    index += currentPosition;
    squares[index].style.backgroundColor = colors[currentColor];
  });
  for (let i = 0; i < filledsquares.length; i++) {
    squares[filledsquares[i][0]].style.backgroundColor = filledsquares[i][1];
  }
}

function undraw() {
  squares.forEach((index: any) => {
    squares[index.id].style.backgroundColor = "black";
  });
}
