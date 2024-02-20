import "../style.css";
import { type ServerHTML, ServerMeta, Init } from "../renderer/types";

export const serverHTML: ServerHTML = () => `
<div id="games">
  <button class="game" onclick="window.location.href = '/2048'">2048</button>
  <button class="game" onclick="window.location.href = '/tetris'">Tetris</button>
  <button class="game" onclick="window.location.href = '/calculator'">Rechner</button>
  <button class="game" onclick="window.location.href = '/snake'">Snake</button>
  <button class="game" onclick="window.location.href = '/minesweeper'">Mine- sweeper</button>
  <button class="game" onclick="window.location.href = '/gameoflife'">Game of Life</button>
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
