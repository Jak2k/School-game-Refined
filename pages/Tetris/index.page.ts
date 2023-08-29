import "../../style.css";
import "./Tetris.css";
import { type ServerHTML, ServerMeta, Init } from "../../renderer/types";
function createGrid() {
  const grid = document.querySelector(".grid")!;
  for (let i = 0; i < 200; i++) {
    const div = document.createElement("div");
    div.innerHTML = i.toString();
    grid.appendChild(div);
  }
}

export const serverHTML: ServerHTML = () => `
    <a href="..">Back</a>
    <div class="grid">
    </div>
`;

export const serverMeta: ServerMeta = () => {
  return {
    title: "Tetris",
    description: "This is the description of the page",
  };
};

export const init: Init = () => {
  createGrid();
};
