export function render(ctx: any) {
  ctx.exportsAll.init[0].exportValue();

  // @ts-ignore
  if (import.meta.env.MODE === "development") {
    document.getElementById("debug")!.innerHTML = "Success!";
  }
}
