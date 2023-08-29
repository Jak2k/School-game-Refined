import "../style.css";
import { type ServerHTML, ServerMeta, Init } from "../renderer/types";

export const serverHTML: ServerHTML = () => `
<div id="games">
  <div class="game">
    <a href="/2048" class="name">2048</a>
  </div>
  <div class="game">
    <a href="/Tetris" class="name">Tetris</a>
  </div>
  <div class="game">
    <a href="/2048" class="name">Fill</a>
  </div>
  <div class="game">
    <a href="/2048" class="name">Fill</a>
  </div>
  <div class="game">
    <a href="/2048" class="name">Fill</a>
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
