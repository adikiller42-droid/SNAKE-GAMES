const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const bgMusic = new Audio("assets/sounds/bgm.mp3");
bgMusic.loop = true;      // Mengulang terus
bgMusic.volume = 0.5;     // Volume 50%

const stoneImg = new Image();
stoneImg.src = "assets/images/stone.png";

const appleImg = new Image();
appleImg.src = "assets/images/apple.png";

const bodyImg = new Image();
bodyImg.src = "assets/images/snake_body.jpg";

const headImg = new Image();
headImg.src = "assets/images/snake_head.png";

const bgImg = new Image();
bgImg.src = "assets/images/background.jpg";

const grid = 20;
let snake;
let food;
let dx;
let dy;
let score;
let game;
let currentLevel;
function updateLevelButtons() {

    let unlocked = getUnlockedLevel();

    for (let i = 1; i <= 5; i++) {

        let btn = document.getElementById("level" + i);
        let lock = btn.querySelector(".lock");

        if (i <= unlocked) {

            // LEVEL TERBUKA
            btn.disabled = false;
            lock.innerText = "";

        } else {

            // LEVEL TERKUNCI
            btn.disabled = true;
            lock.innerText = "🔒";
        }
    }
}

function unlockLevel(level) {
    localStorage.setItem("unlockedLevel", level);
}

function getUnlockedLevel() {
    return Number(localStorage.getItem("unlockedLevel")) || 1;
}

function startGame(level) {
    if (level > getUnlockedLevel()) {
    alert("🔒 Selesaikan level sebelumnya terlebih dahulu!");
    return;
}
    currentLevel = levels[level - 1];

    bgMusic.currentTime = 0;
    bgMusic.play();

    document.getElementById("menu").style.display = "none";
    document.getElementById("gameArea").style.display = "block";
    snake = [{ x: 10, y: 10 }];
    food = randomFood();

    dx = 1;
    dy = 0;

    score = 0;

    if (game) clearInterval(game);
    game = setInterval(update, currentLevel.speed);
}

function randomFood() {
    return {
        x: Math.floor(Math.random() * 30),
        y: Math.floor(Math.random() * 30)
    };
}

function update() {

    const head = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
    };
    // Tabrak dinding
if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= canvas.width / grid ||
    head.y >= canvas.height / grid
) {
    gameOver();
    return;
}

// Tabrak badan sendiri
// Tabrak rintangan
for (const obstacle of currentLevel.obstacles) {

    if (
        head.x === obstacle.x &&
        head.y === obstacle.y
    ) {

        gameOver();
        return;

    }

}
for (let i = 0; i < snake.length; i++) {

    if (
        head.x === snake[i].x &&
        head.y === snake[i].y
    ) {

        gameOver();
        return;

    }

}

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {

    score++;
    food = randomFood();

    // Cek apakah target level tercapai
    if (score >= currentLevel.target) {
        nextLevel();
        return;
    }

} else {

    snake.pop();

}

draw();

}


function draw() {

    ctx.drawImage(bgImg,0,0,canvas.width,canvas.height);

    // Apel
    ctx.drawImage(
    appleImg,
    food.x * grid,
    food.y * grid,
    grid,
    grid
);
    // Rintangan
ctx.fillStyle = "gray";

currentLevel.obstacles.forEach(obstacle => {

    ctx.fillRect(
        obstacle.x * grid,
        obstacle.y * grid,
        grid - 2,
        grid - 2
    );
});

    // Ular
    ctx.fillStyle = "lime";
    snake.forEach((part,index)=>{

    if(index===0){

        ctx.drawImage(
            headImg,
            part.x*grid,
            part.y*grid,
            grid,
            grid
        );

    }else{

        ctx.fillStyle="#33ff33";

        ctx.drawImage(
    bodyImg,
    part.x * grid,
    part.y * grid,
    grid,
    grid
);
    }

});

    // Score
    ctx.fillStyle = "white";
ctx.font = "20px Arial";

document.getElementById("levelText").innerText =
"LEVEL : " + currentLevel.level;

document.getElementById("scoreText").innerText =
"SKOR : " + score;

document.getElementById("targetText").innerText =
"TARGET : " + currentLevel.target;
}

document.addEventListener("keydown", function(e) {

    if (e.key === "ArrowUp" && dy !== 1) {
        dx = 0;
        dy = -1;
    }

    if (e.key === "ArrowDown" && dy !== -1) {
        dx = 0;
        dy = 1;
    }

    if (e.key === "ArrowLeft" && dx !== 1) {
        dx = -1;
        dy = 0;
    }

    if (e.key === "ArrowRight" && dx !== -1) {
        dx = 1;
        dy = 0;
    }

});
function gameOver() {

    bgMusic.pause();

    let high = localStorage.getItem("highscore");

if(high == null || score > high){

localStorage.setItem("highscore",score);

}

    clearInterval(game);

    document.getElementById("gameArea").style.display = "none";
    document.getElementById("menu").style.display = "none";
    document.getElementById("gameOver").style.display = "block";

    document.getElementById("gameOverScore").innerText = score;

}



function nextLevelContinue(){

    document.getElementById("levelComplete").style.display = "none";

    startGame(currentLevel.level + 1);

}

function backToMenu(){

    bgMusic.pause();
    bgMusic.currentTime = 0;

    document.getElementById("gameOver").style.display = "none";
    document.getElementById("levelComplete").style.display = "none";
    document.getElementById("gameArea").style.display = "none";

    document.getElementById("menu").style.display = "block";
    
function nextLevel() {

    clearInterval(game);

    // Buka level berikutnya
    if (currentLevel.level < 5) {

        unlockLevel(currentLevel.level + 1);

        // Perbarui tampilan tombol
        updateLevelButtons();
    }

    if (currentLevel.level === 5) {

        alert("🎉 Selamat! Semua level selesai!");

        backToMenu();

        return;
    }

    document.getElementById("gameArea").style.display = "none";

    document.getElementById("levelComplete").style.display = "block";

    document.getElementById("finalScore").innerText = score;
}
}
function restartGame(){

    document.getElementById("gameOver").style.display = "none";

    startGame(currentLevel.level);

}
function showHelp(){

alert(
`CARA BERMAIN

⬆ Atas
⬇ Bawah
⬅ Kiri
➡ Kanan

Makan apel untuk mendapatkan skor.

Hindari dinding,
rintangan,
dan badan sendiri.`
);

}

function showHighScore(){

let high = localStorage.getItem("highscore");

if(high == null){

high = 0;

}

alert("🏆 HIGH SCORE\n\n"+high);

}
function up(){
    if(dy !== 1){
        dx = 0;
        dy = -1;
    }
}

function down(){
    if(dy !== -1){
        dx = 0;
        dy = 1;
    }
}

function left(){
    if(dx !== 1){
        dx = -1;
        dy = 0;
    }
}

function right(){
    if(dx !== -1){
        dx = 1;
        dy = 0;
    }
}
window.onload = function(){

    updateLevelButtons();

}