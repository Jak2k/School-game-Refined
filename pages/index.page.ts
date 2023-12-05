import "../style.css";
import { type ServerHTML, ServerMeta, Init } from "../renderer/types";

export const serverHTML: ServerHTML = () => `
<div id="games">
  <div class="game">
  <button class="gamebutton" onclick="window.location.href = '/2048'">2048</button>
  </div>
  <div class="game">
  <button class="gamebutton" onclick="window.location.href = '/Tetris'">Tetris</button>
  </div>
  <div class="game">
  <button class="gamebutton" onclick="window.location.href = '/calculator'">Rechner</button>
  </div>

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
