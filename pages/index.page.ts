import "../style.css";
import { type ServerHTML, ServerMeta, Init } from "../renderer/types";

export const serverHTML: ServerHTML = () => `
  <div class="game">
    <span class="gamename">Hello Vite World</span>
    <button id="main">Cycle through colors</button>
  </div>
  <div id="debug"></div>
`;

export const serverMeta: ServerMeta = () => {
  return {
    title: "Hello Vite World",
    description: "This is the description of the page",
  };
};

export const init: Init = () => {
  const main = document.getElementById("main")!;
  main.style.color = "red";
  main.style.borderColor = "red";
  main.addEventListener("click", () => {
    // cycle through colors
    const colors = ["red", "green", "blue", "yellow"];
    const currentColor = main.style.color;
    const nextColor =
      colors[(colors.indexOf(currentColor) + 1) % colors.length];
    main.style.color = nextColor;
    main.style.borderColor = nextColor;
  });
};
