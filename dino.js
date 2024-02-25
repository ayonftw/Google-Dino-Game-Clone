// Board Configuration
const boardConfig = {
    width: 750,
    height: 250,
    color: 'lightgray',
    border: '1px solid black'
};

// Dino Configuration
const dinoConfig = {
    width: 88,
    height: 94,
    initialX: 50,
    velocityY: 0,
    gravity: 0.4,
    jumpVelocity: -10,
    imgSrc: "./img/dino.png",
    imgDeadSrc: "./img/dino-dead.png"
};

// Cactus Configuration
const cactusConfig = {
    types: [
        { width: 34, imgSrc: "./img/cactus1.png" },
        { width: 69, imgSrc: "./img/cactus2.png" },
        { width: 102, imgSrc: "./img/cactus3.png" }
    ],
    height: 70,
    initialX: 700,
    velocityX: -8 // Moving speed to the left
};

let board, context;
let dino = {};
let cacti = [];
let score = 0;
let gameOver = false;

window.onload = function() {
    initializeGame();
    document.addEventListener("keydown", handleKeyDown);
    requestAnimationFrame(gameLoop);
};

function initializeGame() {
    board = document.getElementById("board");
    Object.assign(board.style, {
        backgroundColor: boardConfig.color,
        borderBottom: boardConfig.border
    });
    board.width = boardConfig.width;
    board.height = boardConfig.height;

    context = board.getContext("2d");

    // Initialize Dino
    dino = {
        ...dinoConfig,
        x: dinoConfig.initialX,
        y: boardConfig.height - dinoConfig.height,
        img: loadImage(dinoConfig.imgSrc)
    };

    // Set cactus placement
    setInterval(placeCactus, 1000);
}

function gameLoop() {
    if (gameOver) return;

    clearBoard();
    updateDino();
    updateCacti();
    updateScore();

    requestAnimationFrame(gameLoop);
}

function clearBoard() {
    context.clearRect(0, 0, board.width, board.height);
}

function updateDino() {
    // Apply gravity
    dino.velocityY += dinoConfig.gravity;
    dino.y = Math.min(dino.y + dino.velocityY, boardConfig.height - dinoConfig.height);

    context.drawImage(dino.img, dino.x, dino.y, dinoConfig.width, dinoConfig.height);
}

function updateCacti() {
    cacti.forEach((cactus, index) => {
        cactus.x += cactusConfig.velocityX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactusConfig.height);

        if (detectCollision(dino, cactus)) {
            gameOver = true;
            dino.img = loadImage(dinoConfig.imgDeadSrc);
        }

        // Remove off-screen cactus
        if (cactus.x + cactus.width < 0) {
            cacti.splice(index, 1);
        }
    });
}

function updateScore() {
    context.fillStyle = "black";
    context.font = "20px Courier";
    context.fillText(++score, 10, 30);
}

function handleKeyDown(e) {
    if (gameOver) return;

    if ((e.code === "Space" || e.code === "ArrowUp") && dino.y === boardConfig.height - dinoConfig.height) {
        dino.velocityY = dinoConfig.jumpVelocity;
    }
}

function placeCactus() {
    if (gameOver) return;

    const type = cactusConfig.types[Math.floor(Math.random() * cactusConfig.types.length)];
    const cactus = {
        img: loadImage(type.imgSrc),
        x: cactusConfig.initialX,
        y: boardConfig.height - cactusConfig.height,
        width: type.width,
        height: cactusConfig.height
    };

    cacti.push(cactus);
}

function loadImage(src) {
    const img = new Image();
    img.src = src;
    return img;
}

function detectCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}
