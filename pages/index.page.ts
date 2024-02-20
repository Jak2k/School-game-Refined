import "../style.css";
import { type ServerHTML, ServerMeta, Init } from "../renderer/types";

export const serverHTML: ServerHTML = () => `
<div id="games">
  <button class="game" onclick="windows.location.href = '/2048'">2048</button>
  <button class="game" onclick="window.location.href = '/Tetris'">Tetris</button>
  <button class="game" onclick="window.location.href = '/calculator'">Rechner</button>
  <button class="game" onclick="window.location.href = '/snake'">Snake</button>
</div>
<div id="debug"></div>
`;

export const serverMeta: ServerMeta = () => {
  return {
    title: "Hello Vite World",
    description: "This is the description of the page",
  };
};

export const init: Init = () => {};
