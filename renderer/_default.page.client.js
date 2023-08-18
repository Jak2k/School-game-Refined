export function render(ctx) {
  ctx.exportsAll.init[0].exportValue()

  if(import.meta.env.MODE === 'development') {
    document.getElementById("debug").innerHTML = "Success!"
  }
}