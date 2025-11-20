// See all the different ways to make comments!
// This file contains the JavaScript code for the Rise Project. It handles mood selection and displays corresponding quotes.
// --- Mood Quotes ---
// Each mood has a list of possible quotes.
/* ==========================
   Mood + Calendar (light)
   ========================== */
const moodQuotes = {
  happy: ["Keep shining — your joy is contagious!","Happiness looks great on you 🌞","Cherish this light."],
  calm: ["Peace begins with a breath 🌿","You are exactly where you need to be.","Stillness is your superpower."],
  sad: ["It’s okay to feel sad — emotions make us human.","Take things one small step at a time.","You are allowed to rest and heal."],
  stressed: ["Breathe. Progress, not perfection.","You are stronger than your worries.","Small breaks help you reset."],
  excited: ["Let your energy inspire ✨","Great things are coming!","Ride the wave of excitement!"]
};
const buttons = document.querySelectorAll(".mood");
const quoteBox = document.getElementById("quoteBox");
buttons.forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const mood = btn.dataset.mood || btn.classList[1] || (btn.textContent||"").toLowerCase();
    const list = moodQuotes[mood] || moodQuotes.happy;
    quoteBox.textContent = list[Math.floor(Math.random()*list.length)];
    // soft background tint by mood
    const gradients = {
      happy:"linear-gradient(135deg,#fff6b7,#ffd6c2)",
      calm:"linear-gradient(135deg,#cfeeea,#dfeaff)",
      sad:"linear-gradient(135deg,#e0f7ff,#cfe8ff)",
      stressed:"linear-gradient(135deg,#ffd6e0,#f7e2ff)",
      excited:"linear-gradient(135deg,#fff3cc,#ffdede)"
    };
    document.body.style.background = gradients[mood] || "";
  });
});

/* Simple calendar (keeps original behavior) */
const daysContainer = document.getElementById("days");
const monthYear = document.getElementById("month-year");
let currentDate = new Date();
function renderCalendar(){
  const year = currentDate.getFullYear(), month = currentDate.getMonth();
  monthYear.innerText = currentDate.toLocaleDateString("en-US",{month:"long",year:"numeric"});
  const firstDay = new Date(year,month,1).getDay();
  const lastDate = new Date(year,month+1,0).getDate();
  daysContainer.innerHTML="";
  for(let i=0;i<firstDay;i++) daysContainer.innerHTML+="<div></div>";
  for(let d=1; d<=lastDate; d++){
    const div = document.createElement("div"); div.innerText = d;
    const key = `${month+1}-${d}-${year}`; const saved = localStorage.getItem(key);
    if(saved) div.innerText = `${d} ${saved}`;
    div.addEventListener("click", ()=>{ document.getElementById("mood-popup").style.display="block"; window.selectedDay = key; });
    daysContainer.appendChild(div);
  }
}
document.getElementById("prev").onclick = ()=>{ currentDate.setMonth(currentDate.getMonth()-1); renderCalendar(); }
document.getElementById("next").onclick = ()=>{ currentDate.setMonth(currentDate.getMonth()+1); renderCalendar(); }
renderCalendar();
document.querySelectorAll("#mood-popup .mood").forEach(btn=>{
  btn.addEventListener("click", ()=>{ const mood = btn.dataset.mood; localStorage.setItem(window.selectedDay, mood); document.getElementById("mood-popup").style.display="none"; renderCalendar(); quoteBox.textContent = (moodQuotes[mood]||[])[0] || "Saved"; });
});
document.getElementById("closePopup").addEventListener("click", ()=>document.getElementById("mood-popup").style.display="none");

/* ==========================
   Flip Wheel (chosen) + Confetti
   ========================== */
const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spinBtn");
const center = document.getElementById("center");
const result = document.getElementById("result");
let spinning = false;

function spawnConfetti(x, y){
  const colors = ["#FF4D4D","#FFD93D","#51D88B","#4D8BFF","#B66BFF","#FF7A3D","#FFD1DC"];
  for(let i=0;i<28;i++){
    const c = document.createElement("div");
    c.className = "confetti";
    c.style.left = (x + (Math.random()*160-80)) + "px";
    c.style.top = (y + (Math.random()*40-20)) + "px";
    c.style.background = colors[Math.floor(Math.random()*colors.length)];
    c.style.transform = `rotate(${Math.random()*360}deg)`;
    c.style.opacity = 0.95;
    c.style.width = (8 + Math.random()*8) + "px";
    c.style.height = (10 + Math.random()*12) + "px";
    document.body.appendChild(c);
    // remove after animation
    setTimeout(()=>c.remove(), 2000 + Math.random()*800);
  }
}

function getWheelCenter(){
  const rect = wheel.getBoundingClientRect();
  return { x: rect.left + rect.width/2, y: rect.top + rect.height/2 };
}

spinBtn.addEventListener("click", startSpin);
center.addEventListener("click", startSpin);

function startSpin(){
  if(spinning) return;
  spinning = true;
  // clear previous flips
  document.querySelectorAll(".slice").forEach(s => s.classList.remove("flip"));
  result.textContent = "";
  // pick random slice 0..5
  const slice = Math.floor(Math.random()*6);
  // degrees so slice aligns under pointer (pointer at top). We want slice * 60 + offset
  const degPerSlice = 360/6;
  // rotate so the chosen slice lands at top (0deg corresponds to top when using our CSS)
  const degrees = slice * degPerSlice;
  const extra = 360*6 + (Math.random()*degPerSlice); // add small random to vary stopping jitter
  const final = extra + degrees;
  wheel.style.transition = "transform 4.6s cubic-bezier(.17,.67,.29,1.32)";
  wheel.style.transform = `rotate(${final}deg)`;
  // when done, compute winning index and flip it + confetti
  setTimeout(()=>{
    const finalDeg = final % 360;
    const winningIndex = Math.floor((360 - finalDeg) / degPerSlice) % 6;
    const winningSlice = document.querySelector(`.s${winningIndex+1}`);
    if(winningSlice){
      // add flip class to that slice
      winningSlice.classList.add("flip");
      const aff = winningSlice.querySelector(".back").textContent;
      result.textContent = aff;
      // spawn confetti at wheel center
      const c = getWheelCenter();
      spawnConfetti(c.x, c.y - 80);
    }
    spinning = false;
  }, 4700);
}
