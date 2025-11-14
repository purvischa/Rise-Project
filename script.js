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
