import "../../style.css";
import "./2048.css";
import { type ServerHTML, ServerMeta, Init } from "../../renderer/types";

export const serverHTML: ServerHTML = () => /*html*/ `
    <a href="..">Back</a>
  
  <span id="box"><div id="square" class="1"></div><div id="square" class="2"></div><div id="square" class="3"></div><div id="square" class="4"></div></span>
  <span id="box"><div id="square" class="5"></div><div id="square" class="6"></div><div id="square" class="7"></div><div id="square" class="8"></div></span>
  <span id="box"><div id="square" class="9"></div><div id="square" class="10"></div><div id="square" class="11"></div><div id="square" class="12"></div></span>
  <span id="box"><div id="square" class="13"></div><div id="square" class="14"></div><div id="square" class="15"></div><div id="square" class="16"></div></span>
  `;

export const serverMeta: ServerMeta = () => {
  return {
    title: "2048",
    description: "2048",
  };
};

export const init: Init = () => {

  let firstpice:number = Math.random();

  window.addEventListener("keydown", (e) => {

    if(e.key === "ArrowLeft") {

    }else if(e.key === "ArrowRight") {

    }else if(e.key === "ArrowUp") {

    }else if(e.key === "ArrowDown") {

    }


  });
};
