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

const squares = Array.from(document.querySelectorAll(".grid div"));
const startBtn = document.querySelector("#start-button")!;
const width = 1;
let nextRandom = 0;
const theTetrominoes = [
  [1, width + 1, width * 2 + 1, 2], // lTetromino
  [0, width, width + 1, width * 2 + 1], // zTetromino
  [1, width, width + 1, width + 2], // tTetromino
  [0, 1, width, width + 1], // oTetromino
  [1, width + 1, width * 2 + 1, width * 3 + 1], // iTetromino
];
let currentPosition = 4;
let random = Math.floor(Math.random() * theTetrominoes.length);
let current = theTetrominoes[random];

function createGrid() {
  const grid = document.querySelector(".grid")!;
  for (let i = 0; i < 200; i++) {
    const div = document.createElement("div");
    div.innerHTML = i.toString();
    div.classList.add("grid-item");
    div.id = i.toString();
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

function displayShape() {
  const displaySquares = document.querySelectorAll(".mini-grid div");
  displaySquares.forEach((square) => {
    square.classList.remove("tetromino");
  });
  theTetrominoes[nextRandom].forEach((index) => {
    displaySquares[0 + index].classList.add("tetromino");
  });
}

function draw() {
  current.forEach((index) => {
    squares[currentPosition + index].classList.add("tetromino");
  });
}

function undraw() {
  current.forEach((index) => {
    squares[currentPosition + index].classList.remove("tetromino");
  });
}

function freeze() {
  if (
    current.some((index) =>
      squares[currentPosition + index + width].classList.contains("taken")
    )
  ) {
    current.forEach((index) =>
      squares[currentPosition + index].classList.add("taken")
    );
    random = nextRandom;
    nextRandom = Math.floor(Math.random() * theTetrominoes.length);
    current = theTetrominoes[random];
    currentPosition = 4;
    draw();
    displayShape();
  }
}

function moveDown() {
  undraw();
  currentPosition += width;
  draw();
  freeze();
}
export const init: Init = () => {
  createGrid();
  for (let i = squares.length - 1; i >= 0; i--) {
    console.log(i);
  }
  let timerId: number | null = null;
  startBtn.addEventListener("click", () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      draw();
      timerId = setInterval(() => {
        moveDown();
        currentPosition += 1;
      }, 1000);
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      displayShape();
    }
  });
};
