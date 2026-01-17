const boot=document.getElementById("bootScreen");
const rooms=document.getElementById("roomsScreen");
const chat=document.getElementById("chatScreen");
const out=document.getElementById("terminalOutput");

const lines=[
"> UMBRALA SYSTEM",
"> Secure routing enabled",
"> Anonymous mode active",
"> No logs policy",
"> Loading nodes...",
"> Ready."
];
let i=0;

function type(){
 if(i<lines.length){out.textContent+=lines[i++]+"\n";setTimeout(type,420)}
 else setTimeout(()=>switchScreen(boot,rooms),800);
}
type();

function switchScreen(from,to){
 from.classList.add("exit");
 setTimeout(()=>{
  from.classList.remove("active","exit");
  to.classList.add("active");
 },600);
}

/* ROOMS */
let nickname="User"+Math.floor(Math.random()*999);
let users=new Set([nickname]);
document.getElementById("userCounter").textContent="👥 "+users.size;

document.querySelectorAll(".room").forEach(b=>{
 b.onclick=()=>enterRoom(b.dataset.room);
});

function enterRoom(name){
 document.getElementById("roomTitle").textContent=name;
 document.getElementById("roomUsers").textContent="👥 "+users.size;
 switchScreen(rooms,chat);
}

/* CHAT */
const msgs=document.getElementById("messages");
document.getElementById("sendBtn").onclick=send;

function send(){
 const txt=document.getElementById("msgInput").value;
 if(!txt)return;
 const m=document.createElement("div");
 m.className="message";
 m.textContent=nickname+": "+txt;
 msgs.appendChild(m);
 document.getElementById("msgInput").value="";
}

/* IMAGE */
document.getElementById("imgInput").onchange=e=>{
 const f=e.target.files[0];
 if(!f)return;
 const r=new FileReader();
 r.onload=()=> {
  const img=document.createElement("img");
  img.src=r.result;img.style.maxWidth="120px";
  const d=document.createElement("div");
  d.className="message";d.appendChild(img);
  msgs.appendChild(d);
 };
 r.readAsDataURL(f);
};

/* BACK */
document.getElementById("backRooms").onclick=()=>switchScreen(chat,rooms);

/* ROOT */
document.getElementById("rootBtn").onclick=()=>{
 const u=prompt("root user");
 const p=prompt("password");
 if(u==="stalkerless"&&p==="1234"){
  document.getElementById("rootBar").classList.add("active");
  alert("ROOT ACTIVADO");
 }
};
