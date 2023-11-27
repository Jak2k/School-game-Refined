import "../../style.css";
import "./2048.css";
import { type ServerHTML, ServerMeta, Init } from "../../renderer/types";

if (typeof document === "undefined") {
  // @ts-ignore
  globalThis.document = {
    querySelector: () => {},
  };
}

export const serverHTML: ServerHTML = () => /*html*/ `
    <a href="..">Back</a>

  <span id="box"><div class="square" id="a"></div><div class="square" id="b"></div><div class="square" id="c"></div><div class="square" id="d"></div></span>
  <span id="box"><div class="square" id="e"></div><div class="square" id="f"></div><div class="square" id="g"></div><div class="square" id="h"></div></span>
  <span id="box"><div class="square" id="i"></div><div class="square" id="j"></div><div class="square" id="k"></div><div class="square" id="l"></div></span>
  <span id="box"><div class="square" id="m"></div><div class="square" id="n"></div><div class="square" id="o"></div><div class="square" id="p"></div></span>

  <button id="resetbutton">RESET</button>
  <div id="end" align="center"></div>
  <div id="text" align="center">Aktueller Score: <span id="score">0</span></div>
  <div id="text" align="center">Highscore: <span id="highscore">0</span></div>
  `;

export const serverMeta: ServerMeta = () => {
  return {
    title: "2048",
    description: "2048",
  };
};

export const init: Init = () => {
  let music = new Audio(
    "pages/2048/rsc/Wer_wird_Millionar_Soundtracks_2_-_50-500_.mp3"
  );
  music.volume = 0.3;
  music.play();
  const resetButton = document.querySelector("#resetbutton");

  let positions = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  let newpiece: number = 0;
  let spawn: number = 0;
  let pos: string = "";
  let count: number = 0;
  let losecount: number = 0;
  let score: number = 0;

  document.getElementById("highscore")!.innerHTML = "0";
  if (localStorage.getItem("high") == null) {
    localStorage.setItem("high", "0");
  }
  document.getElementById("highscore")!.innerHTML = localStorage
    .getItem("high")!
    .toString();

  resetButton!.addEventListener("click", () => {
    for (let index = 0; index < 16; index++) {
      positions[index] = 0;
    }
    read();
    document.getElementById("end")!.innerHTML = "";
    localStorage.setItem("high", score.toString());
    document.getElementById("highscore")!.innerHTML = localStorage
      .getItem("high")!
      .toString();
    document.getElementById("score")!.innerHTML = "0";
  });

  function createnewpiece() {
    if (
      positions[0] == 0 ||
      positions[1] == 0 ||
      positions[2] == 0 ||
      positions[3] == 0 ||
      positions[4] == 0 ||
      positions[5] == 0 ||
      positions[6] == 0 ||
      positions[7] == 0 ||
      positions[8] == 0 ||
      positions[9] == 0 ||
      positions[10] == 0 ||
      positions[11] == 0 ||
      positions[12] == 0 ||
      positions[13] == 0 ||
      positions[14] == 0 ||
      positions[15] == 0
    ) {
      if (Math.random() > 0.9) {
        newpiece = 4;
      } else {
        newpiece = 2;
      }

      while (positions[spawn] != 0) {
        spawn = Math.floor(Math.random() * 16);

        if (spawn == 16) {
          spawn = spawn - 1;
        }
      }
      positions[spawn] = newpiece;
    }
    if (positions.length > 16) {
      positions.pop();
    }

    spawn = 16;

    read();
    points();
    lose();
  }

  function points() {
    score = 0;
    for (let index = 0; index < 16; index++) {
      score = score + positions[index];
    }
    document.getElementById("score")!.innerHTML = score.toString();
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      moveleft();
      //Combine

      for (let index = 0; index < 16; index = index + 4) {
        if (positions[index] == positions[index + 1]) {
          positions[index] = positions[index] * 2;
          positions[index + 1] = 0;
        }

        if (positions[index + 1] == positions[index + 2]) {
          positions[index + 1] = positions[index + 1] * 2;
          positions[index + 2] = 0;
        }

        if (positions[index + 2] == positions[index + 3]) {
          positions[index + 2] = positions[index + 2] * 2;
          positions[index + 3] = 0;
        }
      }
      moveleft();
      createnewpiece();
    } else if (e.key === "ArrowRight") {
      moveright();

      //Combine
      for (let index = 0; index < 16; index = index + 4) {
        if (positions[index + 3] == positions[index + 2]) {
          positions[index + 3] = positions[index + 3] * 2;
          positions[index + 2] = 0;
        }

        if (positions[index + 2] == positions[index + 1]) {
          positions[index + 2] = positions[index + 2] * 2;
          positions[index + 1] = 0;
        }

        if (positions[index + 1] == positions[index + 0]) {
          positions[index + 1] = positions[index + 1] * 2;
          positions[index + 0] = 0;
        }
      }
      moveright();
      createnewpiece();
    } else if (e.key === "ArrowUp") {
      moveup();

      //Combine
      for (let index = 0; index < 4; index++) {
        if (positions[index] == positions[index + 4]) {
          positions[index] = positions[index] * 2;
          positions[index + 4] = 0;
        }

        if (positions[index + 4] == positions[index + 8]) {
          positions[index + 4] = positions[index + 4] * 2;
          positions[index + 8] = 0;
        }

        if (positions[index + 8] == positions[index + 12]) {
          positions[index + 8] = positions[index + 8] * 2;
          positions[index + 12] = 0;
        }
      }

      moveup();
      createnewpiece();
    } else if (e.key === "ArrowDown") {
      movedown();

      //Combine
      for (let index = 0; index < 4; index++) {
        if (positions[index + 12] == positions[index + 8]) {
          positions[index + 12] = positions[index + 12] * 2;
          positions[index + 8] = 0;
        }

        if (positions[index + 8] == positions[index + 4]) {
          positions[index + 8] = positions[index + 8] * 2;
          positions[index + 4] = 0;
        }

        if (positions[index + 4] == positions[index]) {
          positions[index + 4] = positions[index + 4] * 2;
          positions[index] = 0;
        }
      }

      movedown();
      createnewpiece();
    }
  });

  function lose() {
    for (let index = 0; index < 16; index++) {
      if (index == 3 || index == 7 || index == 11) {
        if (
          positions[index] != positions[index - 1] &&
          positions[index] != positions[index - 4] &&
          positions[index] != positions[index + 4]
        ) {
          if (
            positions[0] != 0 &&
            positions[1] != 0 &&
            positions[2] != 0 &&
            positions[3] != 0 &&
            positions[4] != 0 &&
            positions[5] != 0 &&
            positions[6] != 0 &&
            positions[7] != 0 &&
            positions[8] != 0 &&
            positions[9] != 0 &&
            positions[10] != 0 &&
            positions[11] != 0 &&
            positions[12] != 0 &&
            positions[13] != 0 &&
            positions[14] != 0 &&
            positions[15] != 0
          ) {
            losecount++;
          }
        }
      } else if (index == 4 || index == 8 || index == 12) {
        if (
          positions[index] != positions[index - 4] &&
          positions[index] != positions[index + 1] &&
          positions[index] != positions[index + 4]
        ) {
          if (
            positions[0] != 0 &&
            positions[1] != 0 &&
            positions[2] != 0 &&
            positions[3] != 0 &&
            positions[4] != 0 &&
            positions[5] != 0 &&
            positions[6] != 0 &&
            positions[7] != 0 &&
            positions[8] != 0 &&
            positions[9] != 0 &&
            positions[10] != 0 &&
            positions[11] != 0 &&
            positions[12] != 0 &&
            positions[13] != 0 &&
            positions[14] != 0 &&
            positions[15] != 0
          ) {
            losecount++;
          }
        }
      } else {
        if (
          positions[index] != positions[index - 1] &&
          positions[index] != positions[index - 4] &&
          positions[index] != positions[index + 1] &&
          positions[index] != positions[index + 4]
        ) {
          if (
            positions[0] != 0 &&
            positions[1] != 0 &&
            positions[2] != 0 &&
            positions[3] != 0 &&
            positions[4] != 0 &&
            positions[5] != 0 &&
            positions[6] != 0 &&
            positions[7] != 0 &&
            positions[8] != 0 &&
            positions[9] != 0 &&
            positions[10] != 0 &&
            positions[11] != 0 &&
            positions[12] != 0 &&
            positions[13] != 0 &&
            positions[14] != 0 &&
            positions[15] != 0
          ) {
            losecount++;
          }
        }
      }
    }
    console.log(losecount);
    console.log(positions);
    if (losecount == 16) {
      document.getElementById("end")!.innerHTML = "GAME OVER";
      if (score > Number(localStorage.getItem("high"))) {
        localStorage.setItem("high", score.toString());
        document.getElementById("highscore")!.innerHTML = localStorage
          .getItem("high")!
          .toString();
      }
    }
    losecount = 0;
  }

  function posi() {
    switch (count) {
      case 0:
        pos = "a";
        break;
      case 1:
        pos = "b";
        break;
      case 2:
        pos = "c";
        break;
      case 3:
        pos = "d";
        break;
      case 4:
        pos = "e";
        break;
      case 5:
        pos = "f";
        break;
      case 6:
        pos = "g";
        break;
      case 7:
        pos = "h";
        break;
      case 8:
        pos = "i";
        break;
      case 9:
        pos = "j";
        break;
      case 10:
        pos = "k";
        break;
      case 11:
        pos = "l";
        break;
      case 12:
        pos = "m";
        break;
      case 13:
        pos = "n";
        break;
      case 14:
        pos = "o";
        break;
      case 15:
        pos = "p";
        break;
    }
  }

  function read() {
    document.getElementById("a")!.innerHTML = positions[0].toString();
    document.getElementById("b")!.innerHTML = positions[1].toString();
    document.getElementById("c")!.innerHTML = positions[2].toString();
    document.getElementById("d")!.innerHTML = positions[3].toString();
    document.getElementById("e")!.innerHTML = positions[4].toString();
    document.getElementById("f")!.innerHTML = positions[5].toString();
    document.getElementById("g")!.innerHTML = positions[6].toString();
    document.getElementById("h")!.innerHTML = positions[7].toString();
    document.getElementById("i")!.innerHTML = positions[8].toString();
    document.getElementById("j")!.innerHTML = positions[9].toString();
    document.getElementById("k")!.innerHTML = positions[10].toString();
    document.getElementById("l")!.innerHTML = positions[11].toString();
    document.getElementById("m")!.innerHTML = positions[12].toString();
    document.getElementById("n")!.innerHTML = positions[13].toString();
    document.getElementById("o")!.innerHTML = positions[14].toString();
    document.getElementById("p")!.innerHTML = positions[15].toString();

    if (positions[0] == 0) {
      document.getElementById("a")!.innerHTML = "";
      document.getElementById("a")!.style.backgroundColor = "darkgrey";
    }
    if (positions[1] == 0) {
      document.getElementById("b")!.innerHTML = "";
      document.getElementById("b")!.style.backgroundColor = "darkgrey";
    }
    if (positions[2] == 0) {
      document.getElementById("c")!.innerHTML = "";
      document.getElementById("c")!.style.backgroundColor = "darkgrey";
    }
    if (positions[3] == 0) {
      document.getElementById("d")!.innerHTML = "";
      document.getElementById("d")!.style.backgroundColor = "darkgrey";
    }
    if (positions[4] == 0) {
      document.getElementById("e")!.innerHTML = "";
      document.getElementById("e")!.style.backgroundColor = "darkgrey";
    }
    if (positions[5] == 0) {
      document.getElementById("f")!.innerHTML = "";
      document.getElementById("f")!.style.backgroundColor = "darkgrey";
    }
    if (positions[6] == 0) {
      document.getElementById("g")!.innerHTML = "";
      document.getElementById("g")!.style.backgroundColor = "darkgrey";
    }
    if (positions[7] == 0) {
      document.getElementById("h")!.innerHTML = "";
      document.getElementById("h")!.style.backgroundColor = "darkgrey";
    }
    if (positions[8] == 0) {
      document.getElementById("i")!.innerHTML = "";
      document.getElementById("i")!.style.backgroundColor = "darkgrey";
    }
    if (positions[9] == 0) {
      document.getElementById("j")!.innerHTML = "";
      document.getElementById("j")!.style.backgroundColor = "darkgrey";
    }
    if (positions[10] == 0) {
      document.getElementById("k")!.innerHTML = "";
      document.getElementById("k")!.style.backgroundColor = "darkgrey";
    }
    if (positions[11] == 0) {
      document.getElementById("l")!.innerHTML = "";
      document.getElementById("l")!.style.backgroundColor = "darkgrey";
    }
    if (positions[12] == 0) {
      document.getElementById("m")!.innerHTML = "";
      document.getElementById("m")!.style.backgroundColor = "darkgrey";
    }
    if (positions[13] == 0) {
      document.getElementById("n")!.innerHTML = "";
      document.getElementById("n")!.style.backgroundColor = "darkgrey";
    }
    if (positions[14] == 0) {
      document.getElementById("o")!.innerHTML = "";
      document.getElementById("o")!.style.backgroundColor = "darkgrey";
    }
    if (positions[15] == 0) {
      document.getElementById("p")!.innerHTML = "";
      document.getElementById("p")!.style.backgroundColor = "darkgrey";
    }

    //Color
    while (count < 16) {
      posi();
      if (positions[count] == 2) {
        document.getElementById(pos)!.style.backgroundColor = "blue";
      }
      pos = "";
      count++;
    }
    count = 0;

    while (count < 16) {
      posi();
      if (positions[count] == 4) {
        document.getElementById(pos)!.style.backgroundColor = "lightblue";
      }
      pos = "";
      count++;
    }
    count = 0;

    while (count < 16) {
      posi();
      if (positions[count] == 8) {
        document.getElementById(pos)!.style.backgroundColor = "red";
      }
      pos = "";
      count++;
    }
    count = 0;

    while (count < 16) {
      posi();
      if (positions[count] == 16) {
        document.getElementById(pos)!.style.backgroundColor = "orange";
      }
      pos = "";
      count++;
    }
    count = 0;

    while (count < 16) {
      posi();
      if (positions[count] == 32) {
        document.getElementById(pos)!.style.backgroundColor = "purple";
      }
      pos = "";
      count++;
    }
    count = 0;

    while (count < 16) {
      posi();
      if (positions[count] == 64) {
        document.getElementById(pos)!.style.backgroundColor = "pink";
      }
      pos = "";
      count++;
    }
    count = 0;

    while (count < 16) {
      posi();
      if (positions[count] == 128) {
        document.getElementById(pos)!.style.backgroundColor = "brown";
      }
      pos = "";
      count++;
    }
    count = 0;

    while (count < 16) {
      posi();
      if (positions[count] == 256) {
        document.getElementById(pos)!.style.backgroundColor = "magenta";
      }
      pos = "";
      count++;
    }
    count = 0;

    while (count < 16) {
      posi();
      if (positions[count] == 512) {
        document.getElementById(pos)!.style.backgroundColor = "darkblue";
      }
      pos = "";
      count++;
    }
    count = 0;

    while (count < 16) {
      posi();
      if (positions[count] == 1024) {
        document.getElementById(pos)!.style.backgroundColor = "yellow";
      }
      pos = "";
      count++;
    }
    count = 0;

    while (count < 16) {
      posi();
      if (positions[count] == 2048) {
        document.getElementById(pos)!.style.backgroundColor = "green";
      }
      pos = "";
      count++;
    }
    count = 0;

    while (count < 16) {
      posi();
      if (positions[count] == 4096) {
        document.getElementById(pos)!.style.backgroundColor = "darkgreen";
      }
      pos = "";
      count++;
    }
    count = 0;

    while (count < 16) {
      posi();
      if (positions[count] == 8192) {
        document.getElementById(pos)!.style.backgroundColor = "lime";
      }
      pos = "";
      count++;
    }
    count = 0;

    while (count < 16) {
      posi();
      if (positions[count] == 16384) {
        document.getElementById(pos)!.style.backgroundColor = "aquamarine";
      }
      pos = "";
      count++;
    }
    count = 0;

    while (count < 16) {
      posi();
      if (positions[count] == 32768) {
        document.getElementById(pos)!.style.backgroundColor = "lightcoral";
      }
      pos = "";
      count++;
    }
    count = 0;

    while (count < 16) {
      posi();
      if (positions[count] == 65536) {
        document.getElementById(pos)!.style.backgroundColor = "blueviolet";
      }
      pos = "";
      count++;
    }
    count = 0;

    while (count < 16) {
      posi();
      if (positions[count] == 131072) {
        document.getElementById(pos)!.style.backgroundColor = "black";
        document.getElementById(pos)!.innerHTML = "Hast du eigendlich Hobbys?";
      }
      pos = "";
      count++;
    }
    count = 0;
  }

  function moveleft() {
    for (let index = 0; index < 16; index = index + 4) {
      if (positions[index + 3] == 0) {
        positions[index + 3] = positions[index + 2];
        positions[index + 2] = 0;
      }

      if (positions[index + 2] == 0) {
        positions[index + 2] = positions[index + 1];
        positions[index + 1] = 0;
      }

      if (positions[index + 1] == 0) {
        positions[index + 1] = positions[index + 0];
        positions[index + 0] = 0;
      }

      if (positions[index + 2] == 0) {
        positions[index + 2] = positions[index + 1];
        positions[index + 1] = 0;
      }

      if (positions[index + 1] == 0) {
        positions[index + 1] = positions[index + 0];
        positions[index + 0] = 0;
      }

      if (positions[index + 3] == 0) {
        positions[index + 3] = positions[index + 2];
        positions[index + 2] = 0;
      }

      if (positions[index + 3] == 0) {
        positions[index + 3] = positions[index + 2];
        positions[index + 2] = 0;
      }

      if (positions[index + 3] == 0) {
        positions[index + 3] = positions[index + 2];
        positions[index + 2] = 0;
      }

      if (positions[index + 2] == 0) {
        positions[index + 2] = positions[index + 1];
        positions[index + 1] = 0;
      }

      if (positions[index + 1] == 0) {
        positions[index + 1] = positions[index + 0];
        positions[index + 0] = 0;
      }

      if (positions[index + 2] == 0) {
        positions[index + 2] = positions[index + 1];
        positions[index + 1] = 0;
      }

      if (positions[index + 1] == 0) {
        positions[index + 1] = positions[index + 0];
        positions[index + 0] = 0;
      }

      if (positions[index + 3] == 0) {
        positions[index + 3] = positions[index + 2];
        positions[index + 2] = 0;
      }

      if (positions[index + 3] == 0) {
        positions[index + 3] = positions[index + 2];
        positions[index + 2] = 0;
      }
    }
  }

  function moveright() {
    for (let index = 0; index < 16; index = index + 4) {
      if (positions[index] == 0) {
        positions[index] = positions[index + 1];
        positions[index + 1] = 0;
      }

      if (positions[index + 1] == 0) {
        positions[index + 1] = positions[index + 2];
        positions[index + 2] = 0;
      }

      if (positions[index + 2] == 0) {
        positions[index + 2] = positions[index + 3];
        positions[index + 3] = 0;
      }

      if (positions[index + 3] == 0) {
        positions[index + 3] = positions[index + 2];
        positions[index + 2] = 0;
      }

      if (positions[index + 2] == 0) {
        positions[index + 2] = positions[index + 3];
        positions[index + 3] = 0;
      }

      if (positions[index] == 0) {
        positions[index] = positions[index + 1];
        positions[index + 1] = 0;
      }

      if (positions[index] == 0) {
        positions[index] = positions[index + 1];
        positions[index + 1] = 0;
      }

      if (positions[index] == 0) {
        positions[index] = positions[index + 1];
        positions[index + 1] = 0;
      }

      if (positions[index + 1] == 0) {
        positions[index + 1] = positions[index + 2];
        positions[index + 2] = 0;
      }

      if (positions[index + 2] == 0) {
        positions[index + 2] = positions[index + 3];
        positions[index + 3] = 0;
      }

      if (positions[index + 3] == 0) {
        positions[index + 3] = positions[index + 2];
        positions[index + 2] = 0;
      }

      if (positions[index + 2] == 0) {
        positions[index + 2] = positions[index + 3];
        positions[index + 3] = 0;
      }

      if (positions[index + 0] == 0) {
        positions[index + 0] = positions[index + 1];
        positions[index + 1] = 0;
      }

      if (positions[index + 0] == 0) {
        positions[index + 0] = positions[index + 1];
        positions[index + 1] = 0;
      }
    }
  }

  function moveup() {
    for (let index = 0; index < 4; index++) {
      if (positions[index] == 0) {
        positions[index] = positions[index + 4];
        positions[index + 4] = 0;
      }

      if (positions[index + 4] == 0) {
        positions[index + 4] = positions[index + 8];
        positions[index + 8] = 0;
      }

      if (positions[index + 8] == 0) {
        positions[index + 8] = positions[index + 12];
        positions[index + 12] = 0;
      }

      if (positions[index + 4] == 0) {
        positions[index + 4] = positions[index + 8];
        positions[index + 8] = 0;
      }

      if (positions[index + 8] == 0) {
        positions[index + 8] = positions[index + 12];
        positions[index + 12] = 0;
      }

      if (positions[index] == 0) {
        positions[index] = positions[index + 4];
        positions[index + 4] = 0;
      }

      if (positions[index] == 0) {
        positions[index] = positions[index + 4];
        positions[index + 4] = 0;
      }

      if (positions[index] == 0) {
        positions[index] = positions[index + 4];
        positions[index + 4] = 0;
      }

      if (positions[index + 4] == 0) {
        positions[index + 4] = positions[index + 8];
        positions[index + 8] = 0;
      }

      if (positions[index + 8] == 0) {
        positions[index + 8] = positions[index + 12];
        positions[index + 12] = 0;
      }

      if (positions[index + 4] == 0) {
        positions[index + 4] = positions[index + 8];
        positions[index + 8] = 0;
      }

      if (positions[index + 8] == 0) {
        positions[index + 8] = positions[index + 12];
        positions[index + 12] = 0;
      }

      if (positions[index] == 0) {
        positions[index] = positions[index + 4];
        positions[index + 4] = 0;
      }

      if (positions[index] == 0) {
        positions[index] = positions[index + 4];
        positions[index + 4] = 0;
      }
    }
  }

  function movedown() {
    for (let index = 0; index < 4; index++) {
      if (positions[index + 12] == 0) {
        positions[index + 12] = positions[index + 8];
        positions[index + 8] = 0;
      }

      if (positions[index + 8] == 0) {
        positions[index + 8] = positions[index + 4];
        positions[index + 4] = 0;
      }

      if (positions[index + 4] == 0) {
        positions[index + 4] = positions[index];
        positions[index] = 0;
      }

      if (positions[index + 8] == 0) {
        positions[index + 8] = positions[index + 4];
        positions[index + 4] = 0;
      }

      if (positions[index + 4] == 0) {
        positions[index + 4] = positions[index];
        positions[index] = 0;
      }

      if (positions[index + 12] == 0) {
        positions[index + 12] = positions[index + 8];
        positions[index + 8] = 0;
      }

      if (positions[index + 12] == 0) {
        positions[index + 12] = positions[index + 8];
        positions[index + 8] = 0;
      }

      if (positions[index + 12] == 0) {
        positions[index + 12] = positions[index + 8];
        positions[index + 8] = 0;
      }

      if (positions[index + 8] == 0) {
        positions[index + 8] = positions[index + 4];
        positions[index + 4] = 0;
      }

      if (positions[index + 4] == 0) {
        positions[index + 4] = positions[index];
        positions[index] = 0;
      }

      if (positions[index + 8] == 0) {
        positions[index + 8] = positions[index + 4];
        positions[index + 4] = 0;
      }

      if (positions[index + 4] == 0) {
        positions[index + 4] = positions[index];
        positions[index] = 0;
      }

      if (positions[index + 12] == 0) {
        positions[index + 12] = positions[index + 8];
        positions[index + 8] = 0;
      }

      if (positions[index + 12] == 0) {
        positions[index + 12] = positions[index + 8];
        positions[index + 8] = 0;
      }
    }
  }
};
