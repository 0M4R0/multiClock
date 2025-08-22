document.addEventListener("DOMContentLoaded", () => {
    // Constants
    const cascade = document.getElementById("cascade");
    const analog = document.getElementById("analog");
    const digital = document.getElementById("digital");
    const toggleMs = document.getElementById("toggleMs");
    const formatPicker = document.getElementById("formatPicker");
    const pauseBtn = document.getElementById("pauseBtn");
    const cascadeBtn = document.getElementById("cascadeBtn");
    const analogBtn = document.getElementById("analogBtn");
    const digitalBtn = document.getElementById("digitalBtn");
    const semiColonsMS = document.getElementById("semiColonsMS");

    // Variables
    let isPaused = false;

    function pad(n) { return n.toString().padStart(2, "0"); }

    // Create digit bubbles
    function createDigitBubbles(containerId, maxValue) {
        const container = document.getElementById(containerId);
        const column = container.querySelector('.digit-column');
        column.innerHTML = '';

        for (let i = 0; i <= maxValue; i++) {
            const bubble = document.createElement('div');
            bubble.className = 'digit-bubble';
            bubble.textContent = i;
            column.appendChild(bubble);
        }
    }

    // Initialize digit columns
    function initializeDigitColumns() {
        // Hours: first digit (0-2 for 24h, 0-1 for 12h)
        createDigitBubbles('firstHour', formatPicker.value === '12h' ? 1 : 2);
        // Hours: second digit (0-9)
        createDigitBubbles('secondHour', 9);
        // Minutes and seconds: first digit (0-5)
        createDigitBubbles('firstMin', 5);
        createDigitBubbles('firstSec', 5);
        // Minutes and seconds: second digit (0-9)
        createDigitBubbles('secondMin', 9);
        createDigitBubbles('secondSec', 9);
        // Miliseconds (0-9)
        createDigitBubbles('firstMs', 9);
        createDigitBubbles('secondMs', 9);
    }

    // Update digit position
    function updateDigitPosition(containerId, value) {
        const container = document.getElementById(containerId);
        const column = container.querySelector('.digit-column');
        const bubbles = column.querySelectorAll('.digit-bubble');

        // Remove active class from all bubbles
        bubbles.forEach(bubble => bubble.classList.remove('active'));

        // Add active class to the current bubble
        if (bubbles[value]) {
            bubbles[value].classList.add('active');
        }

        // Calculate the offset to center the active bubble
        const bubbleHeight = 70; // 50px height + 20px margin
        const containerHeight = 120;
        const offset = (containerHeight / 2) - (bubbleHeight / 2) - (value * bubbleHeight);

        column.style.transform = `translateY(${offset}px)`;
    }

    // Functions
    function updateClock() {
        if (isPaused) return;

        const now = new Date();
        let hour = now.getHours();
        if (formatPicker.value === "12h") hour = hour % 12 || 12;
        const minute = now.getMinutes();
        const second = now.getSeconds();
        const ms = Math.floor(now.getMilliseconds() / 10);

        // Cascade Clock - Update bubble positions
        const hourStr = pad(hour);
        const minuteStr = pad(minute);
        const secondStr = pad(second);
        const msStr = pad(ms);

        updateDigitPosition('firstHour', parseInt(hourStr[0]));
        updateDigitPosition('secondHour', parseInt(hourStr[1]));
        updateDigitPosition('firstMin', parseInt(minuteStr[0]));
        updateDigitPosition('secondMin', parseInt(minuteStr[1]));
        updateDigitPosition('firstSec', parseInt(secondStr[0]));
        updateDigitPosition('secondSec', parseInt(secondStr[1]));

        // Show/Hide miliseconds
        document.getElementById("msContainer").style.display = toggleMs.checked ? "flex" : "none";
        document.getElementById("semiColonsMS").style.display = toggleMs.checked ? "flex" : "none";

        if (toggleMs.checked) {
            updateDigitPosition('firstMs', parseInt(msStr[0]));
            updateDigitPosition('secondMs', parseInt(msStr[1]));
        }

        // Analog Clock
        const hDeg = (hour % 12) * 30 + minute * 0.5;
        const mDeg = minute * 6;
        const sDeg = second * 6;
        document.getElementById("hHand").style.transform = `translate(-50%, -100%) rotate(${hDeg}deg)`;
        document.getElementById("mHand").style.transform = `translate(-50%, -100%) rotate(${mDeg}deg)`;
        document.getElementById("sHand").style.transform = `translate(-50%, -100%) rotate(${sDeg}deg)`;

        // Digital Clock
        document.getElementById("digitalText").innerText = `${pad(hour)}:${pad(minute)}:${pad(second)}` + (toggleMs.checked ? `:${pad(ms)}` : "");
    }

    function changeCard(card) {
        cascade.style.display = "none";
        analog.style.display = "none";
        digital.style.display = "none";
        card.style.display = "block";
    }

    function pauseTime() {
        isPaused = !isPaused;
        pauseBtn.ariaPressed = isPaused;
        pauseBtn.innerText = isPaused ? "Resume" : "Pause";
    }

    // Events
    cascadeBtn.addEventListener("click", () => changeCard(cascade));
    analogBtn.addEventListener("click", () => changeCard(analog));
    digitalBtn.addEventListener("click", () => changeCard(digital));

    pauseBtn.addEventListener("click", pauseTime);
    toggleMs.addEventListener("change", updateClock);
    formatPicker.addEventListener("change", () => {
        initializeDigitColumns();
        updateClock();
    });

    // Initialize
    initializeDigitColumns();
    updateClock();
    setInterval(updateClock, 100);
});