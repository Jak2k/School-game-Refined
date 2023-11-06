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

  <button id="startbutton">start</button>
  `;

export const serverMeta: ServerMeta = () => {
  return {
    title: "2048",
    description: "2048",
  };
};

export const init: Init = () => {

  const startButton = document.querySelector("#startbutton")

  let positions = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  let count:number = 0;

  let newpiece:number = 0;
  let spawn:number = 0;

  startButton!.addEventListener("click", () => {
    createnewpiece()
  })

  function createnewpiece() {
     if(Math.random() > 0.9) {
      newpiece = 4;
     }else{
      newpiece = 2;
     }
  
     while(positions[spawn] != 0) {
      spawn = Math.floor(Math.random() * 16);

      if (spawn == 16) {
        spawn = spawn-1;
      }

     }

     positions[spawn] = newpiece;

     read();

  }
  
                        
  window.addEventListener("keydown", (e) => {

    if(e.key === "ArrowLeft") {
      moveleft();
      //Combine

      for (let index = 0; index < 16; index = index+4) {

        if(positions[index] == positions[index+1]) {
          positions[index] = positions[index]*2;
          positions[index+1] = 0;
        }

        if(positions[index+1] == positions[index+2]) {
          positions[index+1] = positions[index+1]*2;
          positions[index+2] = 0;
        }

        if(positions[index+2] == positions[index+3]) {
          positions[index+2] = positions[index+2]*2;
          positions[index+3] = 0;
        }
      }
      moveleft();
      
      read();

    }else if(e.key === "ArrowRight") {

    }else if(e.key === "ArrowUp") {

    }else if(e.key === "ArrowDown") {

    }



  });



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
  }


  function moveleft() {
    for (let index = 0; index < 16 && count < 2; index = index+4) {
        
      if(positions[index+3] == 0) {
        positions[index+3] = positions[index+2];
        positions[index+2] = 0;
      }
  
      if(positions[index+2] == 0) {
        positions[index+2] = positions[index+1];
        positions[index+1] = 0;
      }
  
      if(positions[index+1] == 0) {
        positions[index+1] = positions[index+0];
        positions[index+0] = 0;
      }
  
      if(positions[index+2] == 0) {
        positions[index+2] = positions[index+1];
        positions[index+1] = 0;
      }
  
      if(positions[index+1] == 0) {
        positions[index+1] = positions[index+0];
        positions[index+0] = 0;
      }
  
      if(positions[index+3] == 0) {
        positions[index+3] = positions[index+2];
        positions[index+2] = 0;
      }
  
      if(positions[index+3] == 0) {
        positions[index+3] = positions[index+2];
        positions[index+2] = 0;
      }
      count = count+1;
      window.alert("hi");
    }
  count = 0;
  }
};
