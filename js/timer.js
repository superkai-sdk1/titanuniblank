let timerInterval;
let timerTimeRemaining = 0;
let timerRunning = false;

function startTimer(duration) {
    stopTimer(); // Остановить текущий таймер, если он запущен
    timerTimeRemaining = duration;
    timerRunning = true;
    updateTimerDisplay();
    timerInterval = setInterval(updateTimer, 1000);
}

function pauseTimer() {
    if (timerRunning) {
        clearInterval(timerInterval);
        timerRunning = false;
    }
}

function resumeTimer() {
    if (!timerRunning && timerTimeRemaining > 0) {
        timerRunning = true;
        timerInterval = setInterval(updateTimer, 1000);
    }
}

function stopTimer() {
    clearInterval(timerInterval);
    timerTimeRemaining = 0;
    timerRunning = false;
    updateTimerDisplay();
}

function updateTimer() {
    if (timerTimeRemaining > 0) {
        timerTimeRemaining--;
        updateTimerDisplay();
    } else {
        stopTimer();
    }
}

function updateTimerDisplay() {
    const mins = Math.floor(timerTimeRemaining / 60);
    const secs = timerTimeRemaining % 60;
    document.getElementById('timer-display').textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

document.addEventListener('DOMContentLoaded', function() {
    updateTimerDisplay();
});