import "../../style.css";
import "./2048.css";
import { type ServerHTML, ServerMeta, Init } from "../../renderer/types";

export const serverHTML: ServerHTML = () => `
    <a href="..">Back</a>
  
  <span id="box"><div id="square"></div><div id="square"></div><div id="square"></div><div id="square"></div></span>
  <span id="box"><div id="square"></div><div id="square"></div><div id="square"></div><div id="square"></div></span>
  <span id="box"><div id="square"></div><div id="square"></div><div id="square"></div><div id="square"></div></span>
  <span id="box"><div id="square"></div><div id="square"></div><div id="square"></div><div id="square"></div></span>

  `;

export const serverMeta: ServerMeta = () => {
  return {
    title: "2048",
    description: "2048",
  };
};

export const init: Init = () => {
  
  
  
};
