const c=document.getElementById("particles"),x=c.getContext("2d");
function r(){c.width=innerWidth;c.height=innerHeight}
r();addEventListener("resize",r);
let p=[...Array(80)].map(()=>({
 x:Math.random()*c.width,
 y:Math.random()*c.height,
 vx:(Math.random()-.5)*.3,
 vy:(Math.random()-.5)*.3,
 r:Math.random()*2+1
}));
(function a(){
 x.clearRect(0,0,c.width,c.height);
 p.forEach(e=>{
  e.x+=e.vx;e.y+=e.vy;
  if(e.x<0||e.x>c.width)e.vx*=-1;
  if(e.y<0||e.y>c.height)e.vy*=-1;
  x.beginPath();x.arc(e.x,e.y,e.r,0,Math.PI*2);
  x.fillStyle="rgba(60,255,143,.6)";x.fill();
 });
 requestAnimationFrame(a);
})();
