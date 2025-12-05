// --- Mood Quotes ---
const moodQuotes = {
  happy: ["Keep shining!", "Happiness looks great on you 🌞", "Cherish this moment!"],
  calm: ["Peace begins with a breath 🌿", "You're grounded.", "Stillness is your power."],
  sad: ["It's okay to feel sad 💙", "One small step.", "You are allowed to rest."],
  stressed: ["Breathe. You've got this.", "Progress, not perfection.", "You are stronger than stress."],
  excited: ["Ride the excitement!", "Great things ahead!", "Energy is flowing ✨"]
};

// DOM
const buttons = document.querySelectorAll(".mood");
const quoteDisplay = document.getElementById("quote");
const body = document.body;

function showQuote(mood) {
  const quotes = moodQuotes[mood];
  quoteDisplay.innerText = quotes[Math.floor(Math.random() * quotes.length)];
}

function changeBackground(mood) {
  const gradients = {
    happy: "linear-gradient(135deg, #fff6b7, #f6416c)",
    calm: "linear-gradient(135deg, #a8edea, #fed6e3)",
    sad: "linear-gradient(135deg, #89f7fe, #66a6ff)",
    stressed: "linear-gradient(135deg, #fbc2eb, #a6c1ee)",
    excited: "linear-gradient(135deg, #fddb92, #d1fdff)"
  };
  body.style.background = gradients[mood];
}

// Calendar -----------------------
const daysContainer = document.getElementById("days");
const monthYear = document.getElementById("month-year");
const moodPopup = document.getElementById("mood-popup");
const closeBtn = document.getElementById("close");
const downloadPDF = document.getElementById("downloadPDF");

let currentDate = new Date();
let selectedDay = null;
let monthlyChart = null;

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  monthYear.innerText = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
  });

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  daysContainer.innerHTML = "";

  for (let i = 0; i < firstDay; i++) {
    daysContainer.innerHTML += "<div></div>";
  }

  for (let day = 1; day <= lastDate; day++) {
    const div = document.createElement("div");
    const key = `${month + 1}-${day}-${year}`;
    const mood = localStorage.getItem(key);

    div.innerText = mood ? `${day} ${mood}` : day;

    div.addEventListener("click", () => {
      selectedDay = key;
      moodPopup.style.display = "block";
    });

    daysContainer.appendChild(div);
  }

  updatePersonalMessage();
  updateMonthlyChart();
  updateYearlySummary();
}

renderCalendar();

document.getElementById("prev").onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
};
document.getElementById("next").onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
};

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const mood = button.dataset.mood;

    localStorage.setItem(selectedDay, mood);

    showQuote(mood);
    changeBackground(mood);

    moodPopup.style.display = "none";
    renderCalendar();
  });
});

closeBtn.onclick = () => moodPopup.style.display = "none";

// ----------- MONTHLY ANALYTICS ---------------
function getMonthlyMoodCounts(year, month) {
  const list = { happy: 0, calm: 0, sad: 0, stressed: 0, excited: 0 };
  const lastDate = new Date(year, month + 1, 0).getDate();

  for (let d = 1; d <= lastDate; d++) {
    const key = `${month + 1}-${d}-${year}`;
    const mood = localStorage.getItem(key);
    if (list[mood] !== undefined) list[mood]++;
  }
  return list;
}

function getPersonalizedMessage(c) {
  if (c.happy >= 5 && c.sad >= 5) return "High highs + low lows — work on balance 💛";
  if (c.stressed >= 7) return "Lots of stress this month. Breathe 🌿";
  if (c.happy >= 10) return "Such a joyful month ✨";
  if (c.sad >= 8) return "Emotionally heavy month 💙";
  if (c.excited >= 6) return "So much excitement 🤩";
  if (c.calm >= 8) return "A very peaceful month 🌱";
  return "Track more days to get deeper insights 🌈";
}

function updatePersonalMessage() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const counts = getMonthlyMoodCounts(year, month);
  document.getElementById("personal-message").innerText =
    getPersonalizedMessage(counts);
}

// ----------- MONTHLY BAR CHART ---------------
function updateMonthlyChart() {
  const ctx = document.getElementById("monthlyChart");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const c = getMonthlyMoodCounts(year, month);

  if (monthlyChart) monthlyChart.destroy();

  monthlyChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Happy", "Calm", "Sad", "Stressed", "Excited"],
      datasets: [{
        data: [c.happy, c.calm, c.sad, c.stressed, c.excited]
      }]
    }
  });
}

// ----------- YEARLY SUMMARY ------------------
function updateYearlySummary() {
  const year = currentDate.getFullYear();
  const summary = { happy: 0, calm: 0, sad: 0, stressed: 0, excited: 0 };

  for (let m = 0; m < 12; m++) {
    const c = getMonthlyMoodCounts(year, m);
    Object.keys(summary).forEach(k => summary[k] += c[k]);
  }

  document.getElementById("year-summary").innerText =
    `Yearly totals → Happy: ${summary.happy}, Calm: ${summary.calm},
Sad: ${summary.sad}, Stressed: ${summary.stressed}, Excited: ${summary.excited}`;
}

// ----------- PDF DOWNLOAD --------------------
downloadPDF.onclick = async () => {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  const year = currentDate.getFullYear();
  const monthName = currentDate.toLocaleString("en-US", { month: "long" });
  const counts = getMonthlyMoodCounts(year, currentDate.getMonth());

  pdf.setFontSize(18);
  pdf.text(`Mood Report – ${monthName} ${year}`, 10, 20);

  pdf.setFontSize(12);
  pdf.text(`Happy: ${counts.happy}`, 10, 40);
  pdf.text(`Calm: ${counts.calm}`, 10, 50);
  pdf.text(`Sad: ${counts.sad}`, 10, 60);
  pdf.text(`Stressed: ${counts.stressed}`, 10, 70);
  pdf.text(`Excited: ${counts.excited}`, 10, 80);

  pdf.text("Personalized Insight:", 10, 100);
  pdf.text(getPersonalizedMessage(counts), 10, 110);

  pdf.save(`MoodReport-${monthName}-${year}.pdf`);
};

/* -------------------------------------------
    BOUNCING BUBBLES BACKGROUND
---------------------------------------------*/

const canvas = document.getElementById("bubbleCanvas");
const ctx = canvas.getContext("2d");

// Make sure canvas matches screen size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Calm color palette
const bubbleColors = ["#b6f2d1", "#a8e8ff", "#d1ccff", "#f7f3ff"];
const bubbles = [];
const bubbleCount = 25;

class Bubble {
    constructor() {
        this.radius = Math.random() * 35 + 20;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        // random movement
        this.vx = (Math.random() * 1 - 0.5) * 1.2;
        this.vy = (Math.random() * 1 - 0.5) * 1.2;

        this.color = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color + "44"; // transparent fill
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 25;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // bounce off walls
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.vx *= -1;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.vy *= -1;
        }

        // simple collision with other bubbles
        for (let other of bubbles) {
            if (other !== this) {
                const dx = this.x - other.x;
                const dy = this.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const minDist = this.radius + other.radius;

                if (distance < minDist) {
                    const angle = Math.atan2(dy, dx);
                    const overlap = (minDist - distance) / 2;

                    this.x += Math.cos(angle) * overlap;
                    this.y += Math.sin(angle) * overlap;
                    other.x -= Math.cos(angle) * overlap;
                    other.y -= Math.sin(angle) * overlap;

                    this.vx *= -1;
                    this.vy *= -1;
                }
            }
        }

        this.draw();
    }
}

// create bubbles
for (let i = 0; i < bubbleCount; i++) {
    bubbles.push(new Bubble());
}

// animate bubbles
function animateBubbles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let b of bubbles) {
        b.update();
    }

    requestAnimationFrame(animateBubbles);
}

animateBubbles();

// keep canvas full screen on resize
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

