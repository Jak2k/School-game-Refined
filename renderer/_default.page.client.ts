export function render(ctx: any) {
  ctx.exportsAll.init[0].exportValue();

  // @ts-ignore
  if (import.meta.env.MODE === "development") {
    const debug = document.getElementById("debug");
    if (debug) debug.innerHTML = "Success!";
  }
}
