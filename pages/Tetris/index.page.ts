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
// filledsquares = [[123, color]]
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
    if (running === true) {
      return;
    }
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

function deleteLine() {}

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
  filledsquares.forEach((forms) => {
    forms[0].forEach((index: number) => {
      if (index < 10) {
        tempfilledsquares[0].push(index);
      } else if (index < 20) {
        tempfilledsquares[1].push(index);
      } else if (index < 30) {
        tempfilledsquares[2].push(index);
      } else if (index < 40) {
        tempfilledsquares[3].push(index);
      } else if (index < 50) {
        tempfilledsquares[4].push(index);
      } else if (index < 60) {
        tempfilledsquares[5].push(index);
      } else if (index < 70) {
        tempfilledsquares[6].push(index);
      } else if (index < 80) {
        tempfilledsquares[7].push(index);
      } else if (index < 90) {
        tempfilledsquares[8].push(index);
      } else if (index < 100) {
        tempfilledsquares[9].push(index);
      } else if (index < 110) {
        tempfilledsquares[10].push(index);
      } else if (index < 120) {
        tempfilledsquares[11].push(index);
      } else if (index < 130) {
        tempfilledsquares[12].push(index);
      } else if (index < 140) {
        tempfilledsquares[13].push(index);
      } else if (index < 150) {
        tempfilledsquares[14].push(index);
      } else if (index < 160) {
        tempfilledsquares[15].push(index);
      } else if (index < 170) {
        tempfilledsquares[16].push(index);
      } else if (index < 180) {
        tempfilledsquares[17].push(index);
      } else if (index < 190) {
        tempfilledsquares[18].push(index);
      } else if (index < 200) {
        tempfilledsquares[19].push(index);
      }
    });
  });
  tempfilledsquares.sort();

  let end = false;

  for(let i = tempfilledsquares.length - 1; i >= 0; i--) {
    if (tempfilledsquares[i].length === 10) {
      
    }
  }


  for (let i = Tetrominoelines.length - 1; i >= 0; i--) {
    for(let n = Tetrominoelines[i].length - 1; n >= 0; n--) {
      if (!tempfilledsquares[i].includes(Tetrominoelines[i][n])) {
        
      }
    }
    
  }
}

function newTetrominoe() {
  currentTetrominoe = Math.floor(Math.random() * theTetrominoes.length);
  currentColor = Math.floor(Math.random() * colors.length);
}

function saveTetrominoe() {
  let temparray: number[] = [];
  theTetrominoes[currentTetrominoe][currentrotation].forEach((index: any) => {
    temparray.push(index + currentPosition);
  });
  filledsquares.push([temparray, colors[currentColor]]);
  temparray = [];
  currentrotation = 0;
  currentPosition = 0;
  newTetrominoe();
  displayShape();
  checkLines();
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
      filledsquare[0].forEach((filledindex: number) => {
        if (filledindex === index - 1) {
          end = true;
        }
      });
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
      filledsquare[0].forEach((filledindex: number) => {
        if (filledindex === index + 1) {
          end = true;
        }
      });
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
      filledsquare[0].forEach((filledindex: number) => {
        if (
          filledindex ===
          currentPosition +
            theTetrominoes[currentTetrominoe][currentrotation][i] +
            10
        ) {
          end = true;
        }
      });
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
    filledsquares.forEach((filledsquare) => {
      if (
        filledsquare[0] ===
        theTetrominoes[currentTetrominoe][temprotation][i] + currentPosition
      ) {
        end = true;
      }
      if (
        theTetrominoes[currentTetrominoe][temprotation][i] + currentPosition <
        0
      ) {
        end = true;
      }
      if (
        (theTetrominoes[currentTetrominoe][currentrotation][i] +
          currentPosition) %
          10 ===
          0 &&
        (theTetrominoes[currentTetrominoe][temprotation][i] + currentPosition) %
          10 ===
          9
      ) {
        end = true;
      }
      if (
        (theTetrominoes[currentTetrominoe][currentrotation][i] +
          currentPosition) %
          10 <=
          9 &&
        (theTetrominoes[currentTetrominoe][temprotation][i] + currentPosition) %
          10 ===
          0
      ) {
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
    filledsquares[i][0].forEach((index: number) => {
      squares[index].style.backgroundColor = filledsquares[i][1];
    });
  }
}

function undraw() {
  squares.forEach((index: HTMLDivElement) => {
    index.style.backgroundColor = "black";
  });
}
