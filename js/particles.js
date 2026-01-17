const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

let W, H;
function resize(){
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

const particles = [];
const COUNT = window.innerWidth < 600 ? 60 : 90;

for(let i=0;i<COUNT;i++){
  particles.push({
    x: Math.random()*W,
    y: Math.random()*H,
    vx:(Math.random()-.5)*0.25,
    vy:(Math.random()-.5)*0.25,
    r:Math.random()*2+0.5,
    a:Math.random()*0.8+0.2
  });
}

function draw(){
  ctx.clearRect(0,0,W,H);

  particles.forEach(p=>{
    p.x+=p.vx;
    p.y+=p.vy;

    if(p.x<0||p.x>W) p.vx*=-1;
    if(p.y<0||p.y>H) p.vy*=-1;

    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(60,255,143,${p.a})`;
    ctx.fill();
  });

  requestAnimationFrame(draw);
}

draw();
