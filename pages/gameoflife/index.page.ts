import "../../style.css";
import "./gameoflife.css";
import { type ServerHTML, ServerMeta, Init } from "../../renderer/types";
if (typeof document === "undefined") {
  // @ts-ignore
  globalThis.document = {
    querySelector: () => {},
  };
}
let gridheight:number = 30;
let gridwidth:number = 30;
let dataheight:string = "30";
let datawidth:string = "30";
//Create Grid
function createGrid() {
  let grid = "";
  for (let i = 0; i < gridheight*gridwidth; i++) {
    grid += `<div class="grid-item" style="background-color: black; border-color: black"
     id="${i.toString()}"><button id="cell${i.toString()}" class="cells"> </button></div>`;
  }
  return grid;
}
export const serverHTML: ServerHTML = () =>`
    <a href="..">Back</a><br>
    <div class="grid" id="grid"></div><br>
    <button id ="start" class="inputbutton">Start</button>
    <button id ="stop" class="inputbutton">Stop</button><br>
    <button id ="createpattern" class="inputbutton">Random Pattern</button><br>
    <input id ="percentage" value="%">
    <input id ="speed" value="Speed"><br><br>
    <button id ="reset" class="inputbutton">Reset</button><br>
    <button id="creategrid" class="inputbutton">Create Grid</button><br>
    <input id ="gh" value="Height">
    <input id ="gw" value="Width">
  `;
export const serverMeta: ServerMeta = () => {
  return {
    title: "Conways Game of Life",
    description: "Conways Game of Life",
  };
};
export const init: Init = () => {
  let board:Array<number> = [];
  let backboard:Array<number> = [];
  let game:number;
  const startbutton = document.querySelector("#start");
  const stopbutton = document.querySelector("#stop");
  const resetbutton = document.querySelector("#reset");
  const patternbutton = document.querySelector('#createpattern');
  const gridbutton = document.querySelector('#creategrid');
  //Start
  startbutton!.addEventListener("click", () => {
    let neighbour:number = 0;
    game = setInterval(function(){
      //Neighbour Identifier
      for(let index = 0; index < gridheight*gridwidth; index++) {
        if(board[index+1] == 1){neighbour++}
        if(board[index-1] == 1){neighbour++}
        if(board[index+gridwidth] == 1){neighbour++}
        if(board[index-gridwidth] == 1){neighbour++}
        if(board[index+gridwidth+1] == 1){neighbour++}
        if(board[index-gridwidth-1] == 1){neighbour++}
        if(board[index+gridwidth-1] == 1){neighbour++}
        if(board[index-gridwidth+1] == 1){neighbour++}
        if(neighbour == 3) {
          backboard[index] = 1;
        }else if(neighbour == 2 && board[index] == 1) {
          backboard[index] = 1;
        }else{
          backboard[index] = 0;
        }
        neighbour= 0;
      }
      //Load New
      for(let index = 0; index < gridheight*gridwidth; index++){
        board[index] = backboard[index];
        if (board[index] == 1) {
          document.getElementById("cell" + index)!.style.backgroundColor = "white";
        }else{
          document.getElementById("cell" + index)!.style.backgroundColor = "black";
        }
        backboard[index] = -1;
      }
    },Number((<HTMLInputElement>document.getElementById("speed")).value))
  })
  //Stop
  stopbutton!.addEventListener("click", () => {
    clearInterval(game);
  })
  //Reset
  resetbutton!.addEventListener("click", () => {
    for(let index = 0; index < gridheight*gridwidth; index++){
      board[index] = 0;
      backboard[index] = 0;
      document.getElementById("cell" + index)!.style.backgroundColor = "black";
    }
  })
  //Create Random Pattern
  patternbutton!.addEventListener("click", () => {
    let percentage:number = Number((<HTMLInputElement>document.getElementById("percentage")).value);
    for(let index = 0; index < gridheight*gridwidth; index++){
      if(Math.random() <= percentage) {
        backboard[index] = 0;
        board[index] = 1;
        document.getElementById("cell" + index)!.style.backgroundColor = "white";
      }else{
        board[index] = 0;
        document.getElementById("cell" + index)!.style.backgroundColor = "black";
      }
    }
  })
  //Create Grid
  gridbutton!.addEventListener("click", () => {
    //Delete Old Grid
    for(let index = 0; index < gridheight*gridwidth; index++){
      board[index] = 0;
      backboard[index] = 0;
    }
    //Create New Grid
    gridheight = Number((<HTMLInputElement>document.getElementById("gh")).value);
    gridwidth = Number((<HTMLInputElement>document.getElementById("gw")).value);
    dataheight = (<HTMLInputElement>document.getElementById("gh")).value;
    datawidth = (<HTMLInputElement>document.getElementById("gw")).value;
    document.documentElement.style.setProperty(`--gridheight`, dataheight);
    document.documentElement.style.setProperty(`--gridwidth`, datawidth);
    document.getElementById("grid")!.innerHTML = createGrid();
    //Clickable Cells
    for(let index = 0; index < gridheight*gridwidth; index++){
      const cell = document.querySelector("#cell" + index)!;
      cell.addEventListener("click", () => {
        if (board[index] == 1) {
          document.getElementById("cell" + index)!.style.backgroundColor = "black";
          board[index] = 0;
        }else{
          document.getElementById("cell" + index)!.style.backgroundColor = "white";
          board[index] = 1;
        }
      })
    }
  })
  //Load Starter Grid
  document.documentElement.style.setProperty(`--gridheight`, dataheight);
  document.documentElement.style.setProperty(`--gridwidth`, datawidth);
  //Clickable Cells
  document.getElementById("grid")!.innerHTML = createGrid();
  for(let index = 0; index < gridheight*gridwidth; index++){
    const cell = document.querySelector("#cell" + index)!;
    cell.addEventListener("click", () => {
      if (board[index] == 1) {
        document.getElementById("cell" + index)!.style.backgroundColor = "black";
        board[index] = 0;
      }else{
        document.getElementById("cell" + index)!.style.backgroundColor = "white";
        board[index] = 1;
      }
    })
  }
};