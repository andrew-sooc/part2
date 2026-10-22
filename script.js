
let score = 0;
let lives = 1;
let time = 30;
let gameRunning = false;

let timer = null;
let enemyTimer = null;
let powerTimer = null;
let powerTimeout = null;

const scoreText = document.getElementById("score");
const livesText = document.getElementById("lives");
const timeText = document.getElementById("time");

const target = document.getElementById("target");
const enemy = document.getElementById("enemy");
const powerUp = document.getElementById("powerUp");

const gameArea = document.getElementById("gameArea");
const startButton = document.getElementById("startButton");
const message = document.getElementById("message");
const scoreList = document.getElementById("scoreList");
const resetScoresButton = document.getElementById("resetScores");

const STORAGE_KEY = "catchSquareHighScores";

// Load saved scores safely.
function loadScores() {
    try {
        const saved = JSON.parse(
            localStorage.getItem(STORAGE_KEY) || "[]"
        );

        if (!Array.isArray(saved)) return [];

        return saved
            .filter(points =>
                Number.isSafeInteger(points) && points >= 0
            )
            .sort((a, b) => b - a)
            .slice(0, 5);
    } catch (error) {
        console.error("Could not load scores:", error);
        return [];
    }
}

let highScores = loadScores();

// Display the top five scores.
function displayScores() {
    scoreList.replaceChildren();

    if (highScores.length === 0) {
        const li = document.createElement("li");
        li.textContent = "No scores yet!";
        scoreList.appendChild(li);
        return;
    }

    highScores.forEach(function(points) {
        const li = document.createElement("li");
        li.textContent = points + " points";
        scoreList.appendChild(li);
    });
}

// Save the finished game's score.
function saveScore() {
    highScores.push(score);

    highScores.sort((a, b) => b - a);
    highScores = highScores.slice(0, 5);

    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(highScores)
        );

        displayScores();
    } catch (error) {
        console.error("Could not save scores:", error);
        message.textContent =
            "Game over! Score: " + score +
            ". Browser storage is unavailable.";
    }
}

// Place an object at a random position.
function moveObject(object) {
    const maxX = Math.max(
        0, gameArea.clientWidth - object.offsetWidth
    );

    const maxY = Math.max(
        0, gameArea.clientHeight - object.offsetHeight
    );

    object.style.left = Math.random() * maxX + "px";
    object.style.top = Math.random() * maxY + "px";
}

// Start or restart the game.
function startGame() {
    clearInterval(timer);
    clearInterval(enemyTimer);
    clearInterval(powerTimer);
    clearTimeout(powerTimeout);

    score = 0;
    lives = 3;
    time = 30;
    gameRunning = true;

    scoreText.textContent = score;
    livesText.textContent = lives;
    timeText.textContent = time;

    target.style.display = "block";
    enemy.style.display = "block";
    powerUp.style.display = "none";

    startButton.textContent = "RESTART";
    message.textContent = "Catch green! Avoid red! Grab ⚡!";

    moveObject(target);
    moveObject(enemy);

    timer = setInterval(function() {
        time--;
        timeText.textContent = time;

        if (time <= 0) {
            endGame();
        }
    }, 1000);

    enemyTimer = setInterval(function() {
        moveObject(enemy);
    }, 1200);

    powerTimer = setInterval(function() {
        spawnPowerUp();
    }, 5000);
}

// Green target: earn one point.
target.addEventListener("click", function() {
    if (!gameRunning) return;

    score++;
    scoreText.textContent = score;
    moveObject(target);
});

// Red enemy: lose one life.
enemy.addEventListener("click", function() {
    if (!gameRunning) return;

    lives--;
    livesText.textContent = lives;

    moveObject(enemy);

    if (lives <= 0) {
        endGame();
    }
});

// Bonus power-up: earn five points.
powerUp.addEventListener("click", function() {
    if (!gameRunning) return;

    score += 5;
    scoreText.textContent = score;

    powerUp.style.display = "none";
    clearTimeout(powerTimeout);
});

// Spawn a temporary power-up.
function spawnPowerUp() {
    if (!gameRunning) return;

    clearTimeout(powerTimeout);

    moveObject(powerUp);
    powerUp.style.display = "block";

    powerTimeout = setTimeout(function() {
        powerUp.style.display = "none";
    }, 3000);
}

// End the game and save the score exactly once.
function endGame() {
    if (!gameRunning) return;

    gameRunning = false;

    clearInterval(timer);
    clearInterval(enemyTimer);
    clearInterval(powerTimer);
    clearTimeout(powerTimeout);

    target.style.display = "none";
    enemy.style.display = "none";
    powerUp.style.display = "none";

    saveScore();

    message.textContent =
        "Game over! Your final score is " + score + ".";

    startButton.textContent = "PLAY AGAIN";
}

// Clear the saved leaderboard after confirmation.
resetScoresButton.addEventListener("click", function() {
    const confirmed = confirm(
        "Are you sure you want to clear all saved high scores?"
    );

    if (!confirmed) return;

    try {
        localStorage.removeItem(STORAGE_KEY);
        highScores = [];
        displayScores();
        message.textContent = "Leaderboard cleared!";
    } catch (error) {
        message.textContent =
            "Could not clear scores in this browser.";
    }
});

startButton.addEventListener("click", startGame);

// Show saved scores when the page opens.
displayScores();
