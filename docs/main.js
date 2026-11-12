const scene = document.querySelector(".scene");
const xReadout = document.querySelector("#readout-x");
const yReadout = document.querySelector("#readout-y");
const year = document.querySelector("#year");

if (year) year.textContent = String(new Date().getFullYear());

if (scene) {
  let angleX = 0;
  let angleY = 0;

  const paint = () => {
    scene.style.setProperty("--rx", `${angleX.toFixed(1)}deg`);
    scene.style.setProperty("--ry", `${angleY.toFixed(1)}deg`);
    xReadout.textContent = String(Math.abs(Math.round(angleX))).padStart(2, "0");
    yReadout.textContent = String(Math.abs(Math.round(angleY))).padStart(2, "0");
  };

  scene.addEventListener("pointermove", (event) => {
    const rect = scene.getBoundingClientRect();
    angleX = Math.max(-18, Math.min(18, (0.5 - (event.clientY - rect.top) / rect.height) * 36));
    angleY = Math.max(-22, Math.min(22, ((event.clientX - rect.left) / rect.width - 0.5) * 44));
    paint();
  });

  scene.addEventListener("pointerleave", () => {
    angleX = 0;
    angleY = 0;
    paint();
  });

  scene.addEventListener("keydown", (event) => {
    const step = 4;
    if (event.key === "ArrowUp") angleX = Math.min(18, angleX + step);
    else if (event.key === "ArrowDown") angleX = Math.max(-18, angleX - step);
    else if (event.key === "ArrowLeft") angleY = Math.max(-22, angleY - step);
    else if (event.key === "ArrowRight") angleY = Math.min(22, angleY + step);
    else return;
    event.preventDefault();
    paint();
  });

  paint();
}
