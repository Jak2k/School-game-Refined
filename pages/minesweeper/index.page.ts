import "../../style.css";
import "./minesweeper.css";
import { type ServerHTML, ServerMeta, Init } from "../../renderer/types";
if (typeof document === "undefined") {
  // @ts-ignore
  globalThis.document = {
    querySelector: () => {},
  };
}

function createGrid() {
    let grid = "";
    for (let i = 0; i < 900; i++) {
      grid += `<div class="grid-item" style="background-color: black; border-color: black"
       id="${i.toString()}"><button id="cell${i.toString()}" class="cells"> </button></div>`;
    }
    return grid;
  }

export const serverHTML: ServerHTML = () =>`
    <a href="..">Back</a><br>
    <div class="grid" id="grid">${createGrid()}</div><br>
    <button class="inputbutton" id="setflags">Set Flags</button><br>
    <button class="inputbutton" id="opencells">Open Cells</button><br>
    <button class="inputbutton" id="createmines">Create Mines / Reset</button><br><br>
    <span id="minecounter"></span>
  `;
export const serverMeta: ServerMeta = () => {
  return {
    title: "Minesweeper",
    description: "Minesweeper",
  };
};
export const init: Init = () => {
    //Define
    const setflags = document.querySelector("#setflags");
    const opencell = document.querySelector("#opencells");
    const mines = document.querySelector("#createmines");
    let selected:string = "";
    let board:Array<number> = [];
    let cellsremain:number = 0;
    let neighbors:number = 0;
    //Create Mines
    function createmines() {
      cellsremain = 0;
      for(let index= 0;index < 900; index++){
        document.getElementById("cell"+index)!.style.backgroundColor = "black";
        document.getElementById("cell"+index)!.innerHTML = "";
        if(Math.random() > 0.85){
          board[index] = 1;
        }else{
          board[index] = 0;
        }
      }
      //Startcell
      let startcells:Array<number> = [];
      for(let index = 0; index < 900; index++){
        opencells(index);
        if(neighbors == 0 && board[index] == 0){
          startcells.push(index);
        }
        neighbors = 0;
      }
      document.getElementById("cell"+startcells[Math.floor(Math.random()*startcells.length)])!.style.backgroundColor = "lightgray";
      //Count Cells
      for(let index = 0; index < 900; index++){
        if(board[index] == 0){
          cellsremain++;
        }
      }
      cellsremain--;
      document.getElementById("minecounter")!.innerHTML = cellsremain.toString() + " Cells Remain!";
    }
    createmines();

    //Define Click Functions
    setflags!.addEventListener("click", () =>{
        selected = "setflags";
        document.getElementById("setflags")!.style.backgroundColor = "hsl(240, 30%, 50%)";
        document.getElementById("opencells")!.style.backgroundColor = "hsl(240, 40%, 19%)";
    })
    opencell!.addEventListener("click", () => {
        selected = "opencell";
        document.getElementById("opencells")!.style.backgroundColor = "hsl(240, 30%, 50%)";
        document.getElementById("setflags")!.style.backgroundColor = "hsl(240, 40%, 19%)";
    })
    mines!.addEventListener("click", () => {
        createmines();
    })
    //Cell Click
    for(let index = 0; index < 900; index++) {
      const cellclick = document.querySelector("#cell" + index.toString());
      cellclick!.addEventListener("click", () => {
        //Flag Cells
        if(selected == "setflags") {
          if(document.getElementById("cell"+index)!.style.backgroundColor == "black"){
            document.getElementById("cell"+index)!.style.backgroundColor = "orange";
          }else if(document.getElementById("cell"+index)!.style.backgroundColor == "orange") {
            document.getElementById("cell"+index)!.style.backgroundColor = "black";
          }
        //Open Cells
        }else if(selected == "opencell"){
          opencells(index);
          //Its a Mine
          if(board[index] == 1){
            document.getElementById("cell"+index)!.style.backgroundColor = "red";
            for(let i = 0; i < 900; i++){
              opencells(i);
              if(board[i] == 1){
                document.getElementById("cell"+i)!.style.backgroundColor = "red";
              }else if(neighbors == 0){
                document.getElementById("cell"+i)!.style.backgroundColor = "lightgray";
              }else{
                document.getElementById("cell"+i)!.style.backgroundColor = "lightgray";
                document.getElementById("cell"+i)!.innerHTML = neighbors.toString();
              }
              neighbors = 0;
            }
            alert("You Lose!")
          //Its not a Mine
          }else{
            if(document.getElementById("cell"+index)!.style.backgroundColor == "black" ||
            document.getElementById("cell"+index)!.style.backgroundColor == "orange"){
              cellsremain--;
              document.getElementById("minecounter")!.innerHTML = cellsremain.toString() + " Cells Remain!";
            }
            if(neighbors == 0){
              document.getElementById("cell"+index)!.style.backgroundColor = "lightgray";
            }else{
              document.getElementById("cell"+index)!.style.backgroundColor = "lightgray";
              document.getElementById("cell"+index)!.innerHTML = neighbors.toString();
            }
            if(cellsremain == 0){
              alert("You Win!")
            }
          }
          neighbors = 0;
        }
      })
    }
    
    function opencells(index:number){
      //Ecken
      if(index == 0 ){
        if(board[index+1] == 1){neighbors++;}
        if(board[index+30] == 1){neighbors++;}
        if(board[index+31] == 1){neighbors++;}
      }else if(index == 29){
        if(board[index-1] == 1){neighbors++;}
        if(board[index+30] == 1){neighbors++;}
        if(board[index+29] == 1){neighbors++;}
      }else if(index == 870){
        if(board[index-30] == 1){neighbors++;}
        if(board[index+1] == 1){neighbors++;}
        if(board[index-29] == 1){neighbors++;}
      }else if(index == 899){
        if(board[index-30] == 1){neighbors++;}
        if(board[index-1] == 1){neighbors++;}
        if(board[index-31] == 1){neighbors++;}
      //Kanten
      }else if(index > 0 && index < 29){
        if(board[index+1] == 1){neighbors++;}
        if(board[index-1] == 1){neighbors++;}
        if(board[index+30] == 1){neighbors++;}
        if(board[index+29] == 1){neighbors++;}
        if(board[index+31] == 1){neighbors++;}
      }else if(index > 870 && index < 899){
        if(board[index+1] == 1){neighbors++;}
        if(board[index-1] == 1){neighbors++;}
        if(board[index-30] == 1){neighbors++;}
        if(board[index-29] == 1){neighbors++;}
        if(board[index-31] == 1){neighbors++;}
      }else if(index % 30 == 0){
        if(board[index+1] == 1){neighbors++;}
        if(board[index-30] == 1){neighbors++;}
        if(board[index+30] == 1){neighbors++;}
        if(board[index-29] == 1){neighbors++;}
        if(board[index+31] == 1){neighbors++;}
      }else if((index+1) % 30 == 0){
        if(board[index-1] == 1){neighbors++;}
        if(board[index-30] == 1){neighbors++;}
        if(board[index+30] == 1){neighbors++;}
        if(board[index-31] == 1){neighbors++;}
        if(board[index+29] == 1){neighbors++;}
      //Mitten
      }else{
        if(board[index-1] == 1){neighbors++;}
        if(board[index+1] == 1){neighbors++;}
        if(board[index-30] == 1){neighbors++;}
        if(board[index+30] == 1){neighbors++;}
        if(board[index+31] == 1){neighbors++;}
        if(board[index-31] == 1){neighbors++;}
        if(board[index+29] == 1){neighbors++;}
        if(board[index-29] == 1){neighbors++;}
      }
    }
};