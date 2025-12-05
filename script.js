const daysContainer = document.getElementById("days");
const monthYear = document.getElementById("month-year");
const moodPopup = document.getElementById("mood-popup");
const journalPopup = document.getElementById("journal-popup");
const journalText = document.getElementById("journal-text");

let selectedDay = null;
let current = new Date();

// Render Calendar
function renderCalendar() {
    daysContainer.innerHTML = "";
    const year = current.getFullYear();
    const month = current.getMonth();

    monthYear.innerText = current.toLocaleString("default", { month: "long" }) + " " + year;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        daysContainer.innerHTML += `<div></div>`;
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const btn = document.createElement("div");
        const key = `${year}-${month}-${i}`;

        const savedMood = localStorage.getItem(key);
        const savedJournal = localStorage.getItem(key + "-journal");

        btn.innerHTML = savedMood ? moodEmoji(savedMood) : i;

        btn.onclick = () => {
            selectedDay = key;
            journalText.value = savedJournal || "";
            moodPopup.style.display = "block";
        };

        daysContainer.appendChild(btn);
    }
}

function moodEmoji(mood) {
    return {
        happy: "😊",
        calm: "😌",
        sad: "😢",
        stressed: "😣",
        excited: "🤩"
    }[mood];
}

// Mood click
document.querySelectorAll(".mood").forEach(button => {
    button.onclick = () => {
        localStorage.setItem(selectedDay, button.dataset.mood);
        moodPopup.style.display = "none";
        journalPopup.style.display = "block";
    };
});

// Save journal entry
document.getElementById("save-entry").onclick = () => {
    localStorage.setItem(selectedDay + "-journal", journalText.value);
    journalPopup.style.display = "none";
    renderCalendar();
};

// Close popups
document.getElementById("close-journal").onclick = () => {
    journalPopup.style.display = "none";
};

document.getElementById("close").onclick = () => {
    moodPopup.style.display = "none";
};

// Month navigation
document.getElementById("prev").onclick = () => {
    current.setMonth(current.getMonth() - 1);
    renderCalendar();
};

document.getElementById("next").onclick = () => {
    current.setMonth(current.getMonth() + 1);
    renderCalendar();
};

renderCalendar();
