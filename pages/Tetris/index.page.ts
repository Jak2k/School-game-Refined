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
let currentrotation = 0;
const theTetrominoes = [
  [
    [0, 10, 20, 21],
    [0, 1, 2, 10], //90° right
    [0, 1, 11, 21], //180° right
    [2, 10, 11, 12], //270° right
  ],
  // lTetromino
  [
    [0, 1, 11, 12],
    [1, 11, 10, 20],
    [0, 1, 11, 12],
    [1, 11, 10, 20],
  ], // zTetromino
  [
    [0, 1, 2, 11],
    [1, 10, 11, 21],
    [1, 10, 11, 12],
    [1, 11, 21, 12],
  ], // tTetromino
  [
    [0, 1, 10, 11],
    [0, 1, 10, 11],
    [0, 1, 10, 11],
    [0, 1, 10, 11],
  ], // oTetromino
  [
    [0, 10, 20, 30],
    [0, 1, 2, 3], //90° right
    [0, 10, 20, 30], //180° right
    [1, 2, 3, 4], //270° right
  ], // iTetromino
];

const colors = ["orange", "red", "purple", "green", "blue", "yellow", "cyan"];

function createGrid() {
  const grid = document.querySelector(".grid")!;
  for (let i = 0; i < 200; i++) {
    const div = document.createElement("div");
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
      case "ArrowUp":
        rotatetetrominoe();
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
  theTetrominoes[currentTetrominoe][currentrotation].forEach((index: any) => {
    filledsquares.push([index + currentPosition, colors[currentColor]]);
  });
  currentPosition = 0;
  newTetrominoe();
  displayShape();
}

function moveLeft() {
  let end = false;
  for (let i = 0; i < theTetrominoes[currentTetrominoe].length; i++) {
    const index =
      currentPosition + theTetrominoes[currentTetrominoe][currentrotation][i];
      
      if (currentPosition % 10 === 0) {
        return;
      }

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
  for (
    let i = 0;
    i < theTetrominoes[currentTetrominoe][currentrotation].length;
    i++
  ) {
    const index =
      currentPosition + theTetrominoes[currentTetrominoe][currentrotation][i];

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
  theTetrominoes[currentTetrominoe][currentrotation].forEach((index: any) => {
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

function rotatetetrominoe() {
  let temprotation = currentrotation;
  if (temprotation === 3) {
    temprotation = 0;
  } else {
    temprotation++;
  }
  let end = false;
  for(let i = 0; i < theTetrominoes[currentTetrominoe][temprotation].length; i++) {
    if (theTetrominoes[currentTetrominoe][temprotation][i] + currentPosition >= 190) {
      end = true;
    }
    filledsquares.forEach((filledsquare) => {
      if (filledsquare[0] === theTetrominoes[currentTetrominoe][temprotation][i] + currentPosition) {
        end = true;
      }
      if (theTetrominoes[currentTetrominoe][temprotation][i] + currentPosition < 0) {
        end = true;
      }
      if ((theTetrominoes[currentTetrominoe][currentrotation][i] + currentPosition) % 10 === 0 && (theTetrominoes[currentTetrominoe][temprotation][i] + currentPosition) % 10 === 9) {
        end = true;
      }
      if ((theTetrominoes[currentTetrominoe][currentrotation][i] + currentPosition) % 10 === 9 && (theTetrominoes[currentTetrominoe][temprotation][i] + currentPosition) % 10 === 0) {
        end = true;
      }
    });
  }

  if (end) {
    return;
  }
  if (currentrotation === 3) {
    currentrotation = 0;
  } else {
    currentrotation++;
  }
  undraw();
  displayShape();
}

function displayShape() {
  theTetrominoes[currentTetrominoe][currentrotation].forEach(
    (index: number) => {
      index += currentPosition;
      (squares[index] as HTMLDivElement).style.backgroundColor =
        colors[currentColor];
    }
  );
  for (let i = 0; i < filledsquares.length; i++) {
    squares[filledsquares[i][0]].style.backgroundColor = filledsquares[i][1];
  }
}

function undraw() {
  squares.forEach((index: HTMLDivElement) => {
    index.style.backgroundColor = "black";
  });
}
