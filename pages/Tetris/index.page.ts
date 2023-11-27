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
let highscorelabel = document.querySelector("#highscore")!;
const audiomanagebutton = document.querySelector("#musictogglebutton")!;
let timerId: any;
let lineclearsound;
let score = 0;
const music = document.querySelector("#music") as HTMLAudioElement;
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
    [1, 11, 21, 20],
    [0, 10, 11, 12], //90° right
    [0, 1, 10, 20], //180° right
    [0, 1, 2, 12], //270° right
  ], // inverted lTetromino
  [
    [0, 1, 11, 12],
    [1, 11, 10, 20],
    [0, 1, 11, 12],
    [1, 11, 10, 20],
  ], // zTetromino
  [
    [1, 2, 10, 11],
    [0, 10, 11, 21],
    [1, 2, 10, 11],
    [0, 10, 11, 21],
  ], //inverted zTetromino
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
    [0, 1, 2, 3], //270° right
  ], // iTetromino
];

let Tetrominoelines = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
  [30, 31, 32, 33, 34, 35, 36, 37, 38, 39],
  [40, 41, 42, 43, 44, 45, 46, 47, 48, 49],
  [50, 51, 52, 53, 54, 55, 56, 57, 58, 59],
  [60, 61, 62, 63, 64, 65, 66, 67, 68, 69],
  [70, 71, 72, 73, 74, 75, 76, 77, 78, 79],
  [80, 81, 82, 83, 84, 85, 86, 87, 88, 89],
  [90, 91, 92, 93, 94, 95, 96, 97, 98, 99],
  [100, 101, 102, 103, 104, 105, 106, 107, 108, 109],
  [110, 111, 112, 113, 114, 115, 116, 117, 118, 119],
  [120, 121, 122, 123, 124, 125, 126, 127, 128, 129],
  [130, 131, 132, 133, 134, 135, 136, 137, 138, 139],
  [140, 141, 142, 143, 144, 145, 146, 147, 148, 149],
  [150, 151, 152, 153, 154, 155, 156, 157, 158, 159],
  [160, 161, 162, 163, 164, 165, 166, 167, 168, 169],
  [170, 171, 172, 173, 174, 175, 176, 177, 178, 179],
  [180, 181, 182, 183, 184, 185, 186, 187, 188, 189],
  [190, 191, 192, 193, 194, 195, 196, 197, 198, 199],
];

const colors = ["orange", "red", "purple", "green", "blue", "yellow", "cyan"];

function createGrid() {
  let grid = "";
  for (let i = 0; i < 200; i++) {
    grid += `<div class="grid-item" style="background-color: black; border-color: white"
     id="${i.toString()}"></div>`;
  }

  return grid;
}

export const serverHTML: ServerHTML = () => `
    <a href="..">Back</a>
    
    <audio id="music" src="pages/Tetris/rsc/Tetris.mp3" loop></audio>
    <div id="content">
    <div class="grid">
    ${createGrid()}
    </div>
    <div id="subcontent">
    <button id="start-button">Start</button>
    <button id="musictogglebutton">Audio: On</button>
    <p id="score">Score: 0</p>
    <p id="highscore">Highscore: loading</p>
    </div>
    
    
    
    </div>
`;

function togglemusic() {
  if (music.paused) {
    music.play();
    music.volume = 0.3;
    music.currentTime = 0;
    return;
  }
  music.pause();
}

export const serverMeta: ServerMeta = () => {
  return {
    title: "Tetris",
    description: "This is the description of the page",
  };
};

export const init: Init = () => {
  if (localStorage.getItem("highscore") === null) {
    highscorelabel.innerHTML = `Highscore: 0`;
  } else {
    highscorelabel.innerHTML = `Highscore: ${localStorage.getItem(
      "highscore"
    )}`;
  }

  audiomanagebutton.addEventListener("click", () => {
    if (music.paused) {
      music.play();
      audiomanagebutton.innerHTML = "Audio: On";
    } else {
      music.pause();
      audiomanagebutton.innerHTML = "Audio: Off";
    }
  });

  startBtn.addEventListener("click", () => {
    for (let i = 0; i < 200; i++) {
      const square = document.getElementById(i.toString());
      if (square instanceof HTMLDivElement) {
        squares.push(square);
      }
    }

    lineclearsound = new Audio("pages/Tetris/rsc/tetris-line-clear-sound.mp3");
    lineclearsound.volume = 0.3;
    music.volume = 0.3;
    if (running === false || music.paused) {
      music.play();
    }

    if (running === true) {
      return;
    }
    newTetrominoe();

    displayShape();
    timerId = setInterval(moveDown, 1000);
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

function savehighscore() {
  let highscore = localStorage.getItem("highscore");
  if (highscore) {
    if (score > parseInt(highscore)) {
      localStorage.setItem("highscore", score.toString());
    }
  } else {
    localStorage.setItem("highscore", score.toString());
  }
}

function addscore(points: number) {
  score += points;
  document.getElementById("score")!.innerHTML = `Score: ${score}`;
}

function endgame() {
  clearInterval(timerId);
  timerId = null;
  savehighscore();
  score = 0;
  document.getElementById("score")!.innerHTML = `Score: ${score}`;
  filledsquares = [];
  undraw();
  running = false;
  music.pause();
  music.currentTime = 0;
  alert("Game Over");
}

function deleteLine(line: number) {
  for (let i = filledsquares.length - 1; i >= 0; i--) {
    if (
      filledsquares[i][0] < (line + 1) * 10 &&
      filledsquares[i][0] >= line * 10
    ) {
      filledsquares.splice(i, 1);
    }
  }
  addscore(200);
  movedownremainingblocks(line);
  undraw();
  displayShape();
}

function movedownremainingblocks(line: number) {
  for (let i = line; i >= 0; i--) {
    for (let j = filledsquares.length - 1; j >= 0; j--) {
      if (Tetrominoelines[i].includes(filledsquares[j][0])) {
        filledsquares[j][0] += 10;
      }
    }
  }
}

function checkLines() {
  let tempfilledsquares: number[][] = [
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
  ];
  filledsquares.forEach((block: any) => {
    if (block[0] < 10) {
      tempfilledsquares[0].push(block[0]);
    } else {
      tempfilledsquares[Math.floor(block[0] / 10)].push(block[0]);
    }
  });
  for (let i = 0; i < tempfilledsquares.length; i++) {
    tempfilledsquares[i].sort();
  }
  for (let i = Tetrominoelines.length - 1; i >= 0; i--) {
    if (tempfilledsquares[i].length == Tetrominoelines[i].length) {
      deleteLine(i);
      return;
    }
  }
}

function newTetrominoe() {
  currentTetrominoe = Math.floor(Math.random() * theTetrominoes.length);
  currentColor = Math.floor(Math.random() * colors.length);
}

function saveTetrominoe() {
  if (currentPosition < 10) {
    endgame();
    return;
  }
  theTetrominoes[currentTetrominoe][currentrotation].forEach((index: any) => {
    filledsquares.push([index + currentPosition, colors[currentColor]]);
  });
  currentrotation = 0;
  currentPosition = 0;
  newTetrominoe();
  displayShape();
  for (let i = 4; i > 0; i--) {
    checkLines();
  }
  addscore(10);
}

function moveLeft() {
  let end = false;
  for (let i = 0; i < theTetrominoes[currentTetrominoe].length; i++) {
    const index =
      currentPosition + theTetrominoes[currentTetrominoe][currentrotation][i];

    if (index % 10 === 0) {
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
    filledsquares.forEach((filledsquare: any) => {
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
  for (let i = 0; i < 4; i++) {
    checkLines();
  }

  let end = false;
  for (
    let i = 0;
    i < theTetrominoes[currentTetrominoe][currentrotation].length;
    i++
  ) {
    let index =
      currentPosition + theTetrominoes[currentTetrominoe][currentrotation][i];
    if (index >= 190) {
      end = true;
    }
    filledsquares.forEach((filledsquare) => {
      if (
        filledsquare[0] ===
        currentPosition +
          theTetrominoes[currentTetrominoe][currentrotation][i] +
          10
      ) {
        end = true;
      }
    });
  }
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
  for (
    let i = 0;
    i < theTetrominoes[currentTetrominoe][temprotation].length;
    i++
  ) {
    if (
      theTetrominoes[currentTetrominoe][temprotation][i] + currentPosition >=
      190
    ) {
      end = true;
    }
  }

  theTetrominoes[currentTetrominoe][currentrotation].forEach(
    (currentblock: number) => {
      theTetrominoes[currentTetrominoe][temprotation].forEach(
        (newblock: number) => {
          if (
            (currentblock + currentPosition) % 10 === 9 &&
            (newblock + currentPosition) % 10 === 0
          ) {
            end = true;
          }
          if (currentblock + currentPosition >= 190) {
            end = true;
          }
          if (
            (currentblock + currentPosition) % 10 === 0 &&
            (newblock + currentPosition) % 10 === 9
          ) {
            end = true;
          }

          filledsquares.forEach((filledsquare) => {
            if (filledsquare[0] === newblock + currentPosition) {
              end = true;
            }
          });
        }
      );
    }
  );

  if (
    theTetrominoes[currentTetrominoe] === theTetrominoes[4] &&
    currentPosition % 10 >= 7
  ) {
    if (currentrotation === 0 || currentrotation === 2) {
      end = true;
    }
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
