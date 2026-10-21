let score = 0;
let lives = 3;
let time = 30;

let gameRunning = false;

let timer;
let enemyTimer;
let powerTimer;

const scoreText = document.getElementById("score");
const livesText = document.getElementById("lives");
const timeText = document.getElementById("time");

const target = document.getElementById("target");
const enemy = document.getElementById("enemy");
const powerUp = document.getElementById("powerUp");

const gameArea = document.getElementById("gameArea");
const startButton = document.getElementById("startButton");
const message = document.getElementById("message");


/* START GAME */

startButton.addEventListener("click", startGame);


function startGame() {

    score = 0;
    lives = 3;
    time = 30;

    gameRunning = true;

    scoreText.textContent = score;
    livesText.textContent = lives;
    timeText.textContent = time;

    target.style.display = "block";
    enemy.style.display = "block";

    startButton.textContent = "RESTART";

    message.textContent = "Catch the green square!";

    moveTarget();
    moveEnemy();

    clearInterval(timer);
    clearInterval(enemyTimer);
    clearInterval(powerTimer);

    /* COUNTDOWN */

    timer = setInterval(function() {

        time--;

        timeText.textContent = time;

        if (time <= 0) {

            endGame();

        }

    }, 1000);


    /* MOVE ENEMY */

    enemyTimer = setInterval(function() {

        moveEnemy();

    }, 1200);


    /* SPAWN POWER-UP */

    powerTimer = setInterval(function() {

        spawnPowerUp();

    }, 5000);
}


/* TARGET CLICK */

target.addEventListener("click", function() {

    if (!gameRunning) {
        return;
    }

    score++;

    scoreText.textContent = score;

    moveTarget();

});


/* ENEMY CLICK */

enemy.addEventListener("click", function() {

    if (!gameRunning) {
        return;
    }

    lives--;

    livesText.textContent = lives;

    moveEnemy();

    if (lives <= 0) {

        endGame();

    }

});


/* POWER-UP CLICK */

powerUp.addEventListener("click", function() {

    if (!gameRunning) {
        return;
    }

    score += 5;

    scoreText.textContent = score;

    powerUp.style.display = "none";

});


/* MOVE TARGET */

function moveTarget() {

    const maxX =
        gameArea.clientWidth - target.offsetWidth;

    const maxY =
        gameArea.clientHeight - target.offsetHeight;

    const randomX =
        Math.random() * maxX;

    const randomY =
        Math.random() * maxY;

    target.style.left = randomX + "px";
    target.style.top = randomY + "px";
}


/* MOVE ENEMY */

function moveEnemy() {

    const maxX =
        gameArea.clientWidth - enemy.offsetWidth;

    const maxY =
        gameArea.clientHeight - enemy.offsetHeight;

    const randomX =
        Math.random() * maxX;

    const randomY =
        Math.random() * maxY;

    enemy.style.left = randomX + "px";
    enemy.style.top = randomY + "px";
}


/* SPAWN POWER-UP */

function spawnPowerUp() {

    if (!gameRunning) {
        return;
    }

    const maxX =
        gameArea.clientWidth - powerUp.offsetWidth;

    const maxY =
        gameArea.clientHeight - powerUp.offsetHeight;

    const randomX =
        Math.random() * maxX;

    const randomY =
        Math.random() * maxY;

    powerUp.style.left = randomX + "px";
    powerUp.style.top = randomY + "px";

    powerUp.style.display = "block";


    /* Disappear after 3 seconds */

    setTimeout(function() {

        powerUp.style.display = "none";

    }, 3000);
}


/* END GAME */

function endGame() {

    gameRunning = false;

    clearInterval(timer);
    clearInterval(enemyTimer);
    clearInterval(powerTimer);

    target.style.display = "none";
    enemy.style.display = "none";
    powerUp.style.display = "none";

    message.textContent =
        "Game Over! Final score: " + score;

    startButton.textContent = "PLAY AGAIN";
}
