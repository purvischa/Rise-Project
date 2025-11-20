/* --------------------
   Kawaii Mood Tracker
   -------------------- */

// ----------------- Mood Quotes -----------------
const moodQuotes = {
  happy: ["Keep shining, your joy is cute! ✨", "Happiness looks great on you 😊", "Soft smiles are powerful."],
  calm: ["Breathe in, soft out 🌿", "You're exactly where you need to be.", "Peace looks lovely on you."],
  sad: ["It's okay to feel — be gentle 💙", "One small step at a time.", "You are allowed to rest."],
  stressed: ["Take a tiny pause 🌬️", "You're doing the best you can.", "Tiny breaks help a lot."],
  excited: ["Yay — ride that wave! 🤩", "Sparkles and energy incoming!", "So much joyful energy!"]
};

// ---------------- DOM ----------------
const quoteDisplay = document.getElementById("quote");
const daysContainer = document.getElementById("days");
const monthYear = document.getElementById("month-year");
const moodPopup = document.getElementById("mood-popup");
const closeBtn = document.getElementById("close");
const removeBtn = document.getElementById("remove-entry");
const downloadPDF = document.getElementById("downloadPDF");
const clearMonthBtn = document.getElementById("clear-month");

const moodButtonsSelector = () => document.querySelectorAll(".moodbtn");

let currentDate = new Date();
let selectedDayKey = null;
let monthlyChart = null;

// ---------------- Utilities ----------------
function keyFor(year, month, day){
  return `${month + 1}-${day}-${year}`;
}

function showQuote(mood){
  const arr = moodQuotes[mood] || ["Thanks for checking in 💛"];
  quoteDisplay.innerText = arr[Math.floor(Math.random() * arr.length)];
}

function setBGFor(mood){
  const map = {
    happy: "linear-gradient(135deg, #fff6e8, #ffd6e8)",
    calm: "linear-gradient(135deg, #e9fff8, #d9f7ff)",
    sad: "linear-gradient(135deg, #eef7ff, #dbe9ff)",
    stressed: "linear-gradient(135deg, #fff6f0, #ffeef0)",
    excited: "linear-gradient(135deg, #fffbea, #fff6d6)"
  };
  document.body.style.background = map[mood] || "";
}

// ---------------- Calendar render ----------------
function renderCalendar(){
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  monthYear.innerText = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  daysContainer.innerHTML = "";

  for(let i = 0; i < firstDay; i++){
    const empty = document.createElement("div");
    empty.classList.add("empty");
    daysContainer.appendChild(empty);
  }

  for(let d = 1; d <= lastDate; d++){
    const div = document.createElement("div");
    const key = keyFor(year, month, d);
    const mood = localStorage.getItem(key);

    div.innerText = d;
    if(mood){
      const chip = document.createElement("div");
      chip.className = "mood-chip";
      chip.innerText = emojiFor(mood);
      div.appendChild(chip);
      div.style.border = "1px dashed rgba(0,0,0,0.02)";
    }

    div.addEventListener("click", () => {
      selectedDayKey = key;
      openPopupFor(key);
    });

    daysContainer.appendChild(div);
  }

  updatePersonalMessage();
  updateMonthlyChart();
  updateYearlySummary();
}

// ---------------- Emoji helper ----------------
function emojiFor(mood){
  return {
    happy: "😊",
    calm: "😌",
    sad: "😢",
    stressed: "😣",
    excited: "🤩"
  }[mood] || "";
}

// ---------------- Popup ----------------
function openPopupFor(key){
  moodPopup.style.display = "block";
  moodPopup.setAttribute("aria-hidden", "false");
  // show current mood selection highlight (optional)
}

function closePopup(){
  moodPopup.style.display = "none";
  moodPopup.setAttribute("aria-hidden", "true");
}

// wire mood buttons (delegated)
function wireMoodButtons(){
  moodButtonsSelector().forEach(btn => {
    btn.onclick = () => {
      const mood = btn.dataset.mood;
      if(!selectedDayKey) return;
      localStorage.setItem(selectedDayKey, mood);
      showQuote(mood);
      setBGFor(mood);
      closePopup();
      renderCalendar();
    };
  });
}

// remove entry
removeBtn.onclick = () => {
  if(!selectedDayKey) return closePopup();
  localStorage.removeItem(selectedDayKey);
  showQuote("calm");
  closePopup();
  renderCalendar();
};

closeBtn.onclick = closePopup;

// ---------------- Monthly counts ----------------
function getMonthlyMoodCounts(year, month){
  const counts = { happy:0, calm:0, sad:0, stressed:0, excited:0 };
  const last = new Date(year, month + 1, 0).getDate();
  for(let d=1; d<=last; d++){
    const mood = localStorage.getItem(keyFor(year, month, d));
    if(mood && counts[mood] !== undefined) counts[mood]++;
  }
  return counts;
}

// ---------------- Personalized message ----------------
function getPersonalizedMessage(counts){
  const { happy, calm, sad, stressed, excited } = counts;
  if(happy >= 6 && sad >= 6) return "High highs + low lows — try a small routine to balance your days ✨";
  if(stressed >= 7) return "Stress seems common — remember small breaks and deep breaths 🌿";
  if(sad >= 8) return "This month looks heavy — be gentle with yourself and reach out if you can 💙";
  if(happy >= 10) return "So many bright days — keep glowing! 🌟";
  if(excited >= 6) return "You're buzzing with energy — ride that sparkle! 🤩";
  if(calm >= 8) return "A calm and steady month — lovely grounding energy 🌱";
  return "Keep tracking — the more days you log, the clearer your insights become ✨";
}

function updatePersonalMessage(){
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const counts = getMonthlyMoodCounts(year, month);
  document.getElementById("personal-message").innerText = getPersonalizedMessage(counts);
}

// ---------------- Monthly chart ----------------
function updateMonthlyChart(){
  const ctx = document.getElementById("monthlyChart");
  const y = currentDate.getFullYear();
  const m = currentDate.getMonth();
  const counts = getMonthlyMoodCounts(y,m);

  if(monthlyChart) monthlyChart.destroy();

  monthlyChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Happy","Calm","Sad","Stressed","Excited"],
      datasets: [{
        label: "Days",
        data: [counts.happy, counts.calm, counts.sad, counts.stressed, counts.excited],
        borderRadius: 8,
        barThickness: 24,
      }]
    },
    options: {
      plugins:{legend:{display:false}},
      scales:{
        y:{beginAtZero:true, ticks:{precision:0}}
      }
    }
  });
}

// ---------------- Yearly totals ----------------
function updateYearlySummary(){
  const year = currentDate.getFullYear();
  const totals = { happy:0, calm:0, sad:0, stressed:0, excited:0 };
  for(let mm=0; mm<12; mm++){
    const c = getMonthlyMoodCounts(year, mm);
    Object.keys(totals).forEach(k => totals[k] += c[k]);
  }
  const el = document.getElementById("year-summary");
  el.innerText = `Yearly — 😊 ${totals.happy}  😌 ${totals.calm}  😢 ${totals.sad}  😣 ${totals.stressed}  🤩 ${totals.excited}`;
}

// ---------------- Clear month ----------------
clearMonthBtn.onclick = () => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const last = new Date(year, month + 1, 0).getDate();
  if(!confirm("Clear all mood entries for this month? This cannot be undone.")) return;
  for(let d=1; d<=last; d++){
    localStorage.removeItem(keyFor(year, month, d));
  }
  renderCalendar();
};

// ---------------- PDF download ----------------
downloadPDF.onclick = () => {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({unit:"pt", format:"a4"});
  const y = currentDate.getFullYear();
  const mName = currentDate.toLocaleDateString("en-US",{month:"long"});
  const counts = getMonthlyMoodCounts(y, currentDate.getMonth());

  pdf.setFontSize(18);
  pdf.text(`Mood Report — ${mName} ${y}`, 40, 60);
  pdf.setFontSize(12);
  pdf.text(`😊 Happy: ${counts.happy}`, 40, 100);
  pdf.text(`😌 Calm: ${counts.calm}`, 40, 120);
  pdf.text(`😢 Sad: ${counts.sad}`, 40, 140);
  pdf.text(`😣 Stressed: ${counts.stressed}`, 40, 160);
  pdf.text(`🤩 Excited: ${counts.excited}`, 40, 180);

  pdf.text("Insight:", 40, 210);
  pdf.text(getPersonalizedMessage(counts), 40, 230, {maxWidth:500});

  pdf.save(`MoodReport-${mName}-${y}.pdf`);
};

// ---------------- Navigation ----------------
document.getElementById("prev").onclick = () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(); };
document.getElementById("next").onclick = () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(); };

// ---------------- Init ----------------
function init(){
  renderCalendar();
  wireMoodButtons();
}
window.addEventListener("load", init);
