// See all the different ways to make comments!
// This file contains the JavaScript code for the Rise Project. It handles mood selection and displays corresponding quotes.
// --- Mood Quotes ---
// Each mood has a list of possible quotes.
const moodQuotes = {
  happy: [
    "Keep shining, your joy is contagious!",
    "Happiness looks great on you 🌞",
    "Cherish this moment of lightness!"
  ],
  calm: [
    "Peace begins with a deep breath 🌿",
    "You are exactly where you need to be.",
    "Stillness is your superpower."
  ],
  sad: [
    "It’s okay to feel sad — emotions make us human 💙",
    "Take things one small step at a time.",
    "You are allowed to rest and heal."
  ],
  stressed: [
    "Breathe in. Breathe out. You’ve got this 🌬️",
    "Remember — progress, not perfection.",
    "You are stronger than your worries."
  ],
  excited: [
    "Let your energy flow and inspire others ✨",
    "Great things are coming your way!",
    "Ride that wave of excitement!"
  ]
};

// --- DOM Elements ---
const buttons = document.querySelectorAll(".mood");
const quoteDisplay = document.getElementById("quote");
const body = document.body;

// --- Event Listeners for Buttons ---
buttons.forEach(button => {
  button.addEventListener("click", () => {
    const mood = button.classList[1]; // e.g. "happy", "calm", etc.
    showQuote(mood);
    changeBackground(mood);
  });
});

// --- Show Random Quote ---
function showQuote(mood) {
  const quotes = moodQuotes[mood];
  const randomIndex = Math.floor(Math.random() * quotes.length);
  quoteDisplay.innerText = quotes[randomIndex];
}

// --- Change Background Gradient ---
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
// --- Calender function   ---//


const daysContainer = document.getElementById("days");
const monthYear = document.getElementById("month-year");
const moodPopup = document.getElementById("mood-popup");
const closeBtn = document.getElementById("close");

let currentDate = new Date();
let selectedDay = null;

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

    // Empty slots before 1st day
    for (let i = 0; i < firstDay; i++) {
        daysContainer.innerHTML += "<div></div>";
    }

    // Add days
    for (let day = 1; day <= lastDate; day++) {
        const dayDiv = document.createElement("div");
        dayDiv.innerText = day;

        // Show saved mood emoji on calendar
        const key = `${month + 1}-${day}-${year}`;
        const savedMood = localStorage.getItem(key);
        if (savedMood) {
            dayDiv.innerText = `${day} ${savedMood}`;
        }

        dayDiv.addEventListener("click", () => {
            selectedDay = key;
            moodPopup.style.display = "block";
        });

        daysContainer.appendChild(dayDiv);
    }
}

renderCalendar();

// Navigation
document.getElementById("prev").onclick = () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
};

document.getElementById("next").onclick = () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
};

// Mood Selection
buttons.forEach(button => {
    button.addEventListener("click", () => {
        const mood = button.dataset.mood;

        // Save mood to calendar
        localStorage.setItem(selectedDay, mood);

        // Show mood quote + background gradient
        showQuote(mood);
        changeBackground(mood);

        moodPopup.style.display = "none";
        renderCalendar();
    });
});

// Close Popup
closeBtn.onclick = () => {
    moodPopup.style.display = "none";
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

