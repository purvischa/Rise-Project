let currentDate = new Date();
let moodData = JSON.parse(localStorage.getItem("moodData")) || {};

const monthYear = document.getElementById("monthYear");
const calendarGrid = document.getElementById("calendarGrid");
const popup = document.getElementById("moodPopup");
const popupDate = document.getElementById("popupDate");
const chartCanvas = document.getElementById("moodChart");

let selectedDay = null;
let chart = null;

function renderCalendar() {
    calendarGrid.innerHTML = "";

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthYear.innerText = currentDate.toLocaleString("default", {
        month: "long",
        year: "numeric",
    });

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        calendarGrid.appendChild(document.createElement("div"));
    }

    for (let day = 1; day <= lastDate; day++) {
        const div = document.createElement("div");

        div.innerText = day;
        div.onclick = () => openMoodPopup(day);

        let key = `${year}-${month}-${day}`;
        if (moodData[key]) div.classList.add("selected");

        calendarGrid.appendChild(div);
    }

    updateChart();
}

document.getElementById("prevMonth").onclick = () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
};

document.getElementById("nextMonth").onclick = () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
};

function openMoodPopup(day) {
    selectedDay = day;
    popupDate.innerText = `${selectedDay}`;
    popup.classList.remove("hidden");
}

document.querySelectorAll(".m").forEach(btn => {
    btn.onclick = () => {
        saveMood(btn.dataset.mood);
    };
});

function saveMood(mood) {
    const key = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${selectedDay}`;
    moodData[key] = mood;

    localStorage.setItem("moodData", JSON.stringify(moodData));
    popup.classList.add("hidden");
    renderCalendar();
}

function updateChart() {
    const moodCounts = {};
    Object.values(moodData).forEach(m => {
        moodCounts[m] = (moodCounts[m] || 0) + 1;
    });

    const labels = Object.keys(moodCounts);
    const values = Object.values(moodCounts);

    if (chart) chart.destroy();

    chart = new Chart(chartCanvas, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                data: values
            }]
        },
        options: {
            plugins: {
                legend: { position: "bottom" }
            }
        }
    });
}
renderCalendar();
document.getElementById("closePopup").onclick = () => {
    popup.classList.add("hidden");
};