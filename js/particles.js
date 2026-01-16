const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let w, h, particles = [];

function resize() {
  w = canvas.width = innerWidth;
  h = canvas.height = innerHeight;
}
window.addEventListener("resize", resize);
resize();

for (let i = 0; i < 120; i++) {
  particles.push({
    x: Math.random() * w,
    y: Math.random() * h,
    s: Math.random() * 2 + 1
  });
}

function draw() {
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle = "#4fdcff";
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.s, 0, Math.PI*2);
    ctx.fill();
    p.y += p.s * .3;
    if (p.y > h) p.y = 0;
  });
  requestAnimationFrame(draw);
}
draw();
