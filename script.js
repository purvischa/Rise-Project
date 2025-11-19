// --- Mood Quotes ---
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

// DOM elements
const buttons = document.querySelectorAll(".mood");
const quoteDisplay = document.getElementById("quote");
const body = document.body;

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const mood = button.dataset.mood;
    showQuote(mood);
    changeBackground(mood);
  });
});

// Show random quote
function showQuote(mood) {
  const quotes = moodQuotes[mood];
  const randomIndex = Math.floor(Math.random() * quotes.length);
  quoteDisplay.innerText = quotes[randomIndex];
}

// Change background
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

// ------------ CALENDAR -------------
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

    // Empty days before the 1st
    for (let i = 0; i < firstDay; i++) {
        daysContainer.innerHTML += "<div></div>";
    }

    // Add days with mood
    for (let day = 1; day <= lastDate; day++) {
        const dayDiv = document.createElement("div");
        dayDiv.innerText = day;

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

    updatePersonalMessage();
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

// Mood selection popup
buttons.forEach(button => {
    button.addEventListener("click", () => {
        const mood = button.dataset.mood;

        localStorage.setItem(selectedDay, mood);

        showQuote(mood);
        changeBackground(mood);

        moodPopup.style.display = "none";
        renderCalendar();
        updatePersonalMessage();
    });
});

closeBtn.onclick = () => {
    moodPopup.style.display = "none";
};

// --------- MONTHLY ANALYTICS ---------

function getMonthlyMoodCounts(year, month) {
    const counts = { happy: 0, calm: 0, sad: 0, stressed: 0, excited: 0 };
    const lastDate = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= lastDate; day++) {
        const key = `${month + 1}-${day}-${year}`;
        const mood = localStorage.getItem(key);

        if (mood && counts[mood] !== undefined) {
            counts[mood]++;
        }
    }
    return counts;
}

function getPersonalizedMessage(counts) {
    const { happy, calm, sad, stressed, excited } = counts;

    if (happy >= 5 && sad >= 5) {
        return "You're experiencing both highs and lows — try finding small habits that help balance your mood 💛";
    }

    if (stressed >= 7) {
        return "It looks like stress has been building up. Remember to slow down and breathe 🌿";
    }

    if (happy >= 10) {
        return "Such a joyful month! Keep that positive energy flowing ✨";
    }

    if (sad >= 8) {
        return "It seems like this month was emotionally heavy. Be gentle with yourself 💙";
    }

    if (excited >= 6) {
        return "Lots of excitement lately — keep riding that inspiration! 🤩";
    }

    if (calm >= 8) {
        return "A calm, grounded month — you're finding balance 🌱";
    }

    return "Track more days this month to get personalized insights 🌈";
}

function updatePersonalMessage() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const counts = getMonthlyMoodCounts(year, month);
    const message = getPersonalizedMessage(counts);

    document.getElementById("personal-message").innerText = message;
}
