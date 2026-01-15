const canvas = document.createElement('canvas');
canvas.id = 'particles-canvas';
Object.assign(canvas.style, { position:'fixed', top:0, left:0, width:'100%', height:'100%', zIndex:'-1', pointerEvents:'none'});
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
let w,h;
function resize(){ w=canvas.width=window.innerWidth; h=canvas.height=window.innerHeight; }
resize(); window.addEventListener('resize',resize);

const mouse={x:null,y:null};
window.addEventListener('mousemove', e=>{ mouse.x=e.clientX; mouse.y=e.clientY; });

const COLORS=['#00ffff','#ff00ff','#7a7cff'];
const COUNT=90;
const particles=[];

class Particle{ constructor(){this.reset();} reset(){this.x=Math.random()*w; this.y=Math.random()*h;
this.vx=(Math.random()-0.5)*0.8; this.vy=(Math.random()-0.5)*0.8; this.size=Math.random()*2.5+1;
this.color=COLORS[Math.floor(Math.random()*COLORS.length)]; this.alpha=Math.random()*0.6+0.3;}
update(){this.x+=this.vx; this.y+=this.vy;
if(mouse.x){const dx=this.x-mouse.x,dy=this.y-mouse.y,dist=Math.sqrt(dx*dx+dy*dy); if(dist<120){this.x+=dx/dist; this.y+=dy/dist;} }
if(this.x<0||this.x>w||this.y<0||this.y>h)this.reset();}
draw(){ctx.beginPath(); ctx.arc(this.x,this.y,this.size,0,Math.PI*2); ctx.fillStyle=this.color; ctx.shadowBlur=15; ctx.shadowColor=this.color; ctx.globalAlpha=this.alpha; ctx.fill(); ctx.globalAlpha=1;} }

for(let i=0;i<COUNT;i++)particles.push(new Particle());

function animate(){ctx.clearRect(0,0,w,h);for(let i=0;i<particles.length;i++){const p=particles[i]; p.update(); p.draw(); for(let j=i+1;j<particles.length;j++){const p2=particles[j]; const dx=p.x-p2.x; const dy=p.y-p2.y; const dist=Math.sqrt(dx*dx+dy*dy); if(dist<130){ ctx.beginPath(); ctx.strokeStyle=`rgba(0,255,255,${1-dist/130})`; ctx.lineWidth=0.6; ctx.moveTo(p.x,p.y); ctx.lineTo(p2.x,p2.y); ctx.stroke(); } } } requestAnimationFrame(animate);}
animate();
