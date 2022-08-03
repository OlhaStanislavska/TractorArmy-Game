let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let boxSize = 70;
let rows = 7;
let cols = 12;
let score = 0;
let direction = "";
let connected = false;
let checkPrompt = true;
let roundCounter = 0;
let speed = 0;
let tractorBoom = false;
let boomDrawn = false;
let levelFlag = false;

let tractorImg = new Image();
let tankImg = new Image();
let bg = new Image();
let bgStart = new Image();
let arrowsImg = new Image();
let promptImg = new Image();
let bulletTopImg = new Image();
let bulletBottomImg = new Image();
let boomImg = new Image();
let blockImg = new Image();

let boomAudio = new Audio();
let connectAudio = new Audio();
let levelAudio = new Audio();
let moveAudio = new Audio();
let scoreAudio = new Audio();

bg.src = "img/bg.png";
bgStart.src = "img/bgStart.png";
tankImg.src = "img/tank2.png";
tractorImg.src = "img/tractor.png";
arrowsImg.src = "img/arrows.png";
promptImg.src = "img/prompt.png";
bulletTopImg.src = "img/bulletTop.png";
bulletBottomImg.src = "img/bulletBottom.png";
boomImg.src = "img/boom.png";
blockImg.src = "img/block.png";

boomAudio.src = "audio/boom.wav";
connectAudio.src = "audio/connect.wav";
levelAudio.src = "audio/level.wav";
moveAudio.src = "audio/move.wav";
scoreAudio.src = "audio/score.wav";

let tank = {
    x: 10,
    y: Math.floor(Math.random() * rows) * boxSize + 10
}

let tractor = {
    x: 780,
    y: 220
}

let arrows = {
    x: boxSize + 10,
    y: tank.y
}

let bulletTop = [
    {x: (5 * boxSize + 10), y: Math.floor(Math.random() * rows) * boxSize + 10},
    {x: (9 * boxSize + 10), y: Math.floor(Math.random() * rows) * boxSize + 10}
]

let bulletBottom = [
    {x: (2 * boxSize + 10), y: Math.floor(Math.random() * rows) * boxSize + 10}, // (rows - 1) * boxSize + 10},
    {x: (6 * boxSize + 10), y: Math.floor(Math.random() * rows) * boxSize + 10}
]

let blocks = [];

/* let blocks = [
    {x: 2 * boxSize + 10, y: 1 * boxSize + 10},
    {x: 3 * boxSize + 10, y: 4 * boxSize + 10},
    {x: 5 * boxSize + 10, y: 3 * boxSize + 10},
    {x: 8 * boxSize + 10, y: 5 * boxSize + 10},
    {x: 10 * boxSize + 10, y: 1 * boxSize + 10}
] */

//2-1  4-5  7-3  10-2
let blocksLevel1 = [
    {x: 2 * boxSize + 10, y: 1 * boxSize + 10},
    {x: 4 * boxSize + 10, y: 5 * boxSize + 10},
    {x: 7 * boxSize + 10, y: 3 * boxSize + 10},
    {x: 10 * boxSize + 10, y: 2 * boxSize + 10}
]

//2-1  3-4  5-2  5-3  7-0  8-5  10-1
let blocksLevel2 = [
    {x: 2 * boxSize + 10, y: 1 * boxSize + 10},
    {x: 3 * boxSize + 10, y: 4 * boxSize + 10},
    {x: 5 * boxSize + 10, y: 2 * boxSize + 10},
    {x: 5 * boxSize + 10, y: 3 * boxSize + 10},
    {x: 7 * boxSize + 10, y: 0 * boxSize + 10},
    {x: 8 * boxSize + 10, y: 5 * boxSize + 10},
    {x: 10 * boxSize + 10, y: 1 * boxSize + 10}
]

//2-0  2-2  4-5  4-6  6-2  6-3  7-4  9-1  10-3  10-4
let blocksLevel3 = [
    {x: 2 * boxSize + 10, y: 0 * boxSize + 10},
    {x: 2 * boxSize + 10, y: 2 * boxSize + 10},
    {x: 4 * boxSize + 10, y: 5 * boxSize + 10},
    {x: 4 * boxSize + 10, y: 6 * boxSize + 10},
    {x: 6 * boxSize + 10, y: 2 * boxSize + 10},
    {x: 6 * boxSize + 10, y: 3 * boxSize + 10},
    {x: 7 * boxSize + 10, y: 4 * boxSize + 10},
    {x: 9 * boxSize + 10, y: 1 * boxSize + 10},
    {x: 10 * boxSize + 10, y: 3 * boxSize + 10},
    {x: 10 * boxSize + 10, y: 4 * boxSize + 10}
]

document.addEventListener("keydown", tractorDirection);

function tractorDirection(e) {
    checkPrompt = false;
    switch (e.keyCode) {
        case 37:
            /* if (tractorImg.src != "img/tractor.png") {
                tractorImg.src = "img/tractor.png";
            } */
            direction = "left";
            break;
        case 38:
            direction = "up";
            break;
        case 39:
            /* if (tractorImg.src != "img/tractorFlip.png") {
                tractorImg.src = "img/tractorFlip.png";
            } */
            direction = "right";
            break;
        case 40:
            direction = "down";
            break;
    }
}
document.addEventListener("keyup", function () {direction = ""});

function tractorMove() {
    if (direction == "left" && tractor.x > (boxSize + 10) && checkBlocks(tractor.x - boxSize, tractor.y)) {
        tractor.x -= boxSize;
        moveAudio.play();
    }
    if (direction == "right" && tractor.x < ((cols - 1)*boxSize + 10) && checkBlocks(tractor.x + boxSize, tractor.y)) {
        tractor.x += boxSize;
        moveAudio.play();
    }
    if (direction == "up" && tractor.y > 10 && checkBlocks(tractor.x, tractor.y - boxSize)) {
        tractor.y -= boxSize;
        moveAudio.play();
    }
    if (direction == "down" && tractor.y < ((rows - 1)*boxSize + 10) && checkBlocks(tractor.x, tractor.y + boxSize)) {
        tractor.y += boxSize;
        moveAudio.play();
    }
}

function checkConnect() {
    if (tractor.x == arrows.x && tractor.y == arrows.y) {
        connected = true;
        connectAudio.play();
        tractorImg.src = "img/tractorFlip.png";
    }
}

function tractorTankMove() {
    if (tractor.x >= ((cols - 1) * boxSize + 10)) {
        connected = false;
        score++;
        document.getElementById("score").textContent = score;
        scoreAudio.play();
        tank.x = 10;
        tank.y = Math.floor(Math.random() * rows)*boxSize + 10;
        tractorImg.src = "img/tractor.png";
        arrows.y = tank.y;
    }
    /* if (direction == "left" && tractor.x > (boxSize + 10)) {
        tank.x = tractor.x;
        tank.y = tractor.y;
        tractor.x -= boxSize;
    } */
    if (direction == "right" && tractor.x < ((cols - 1)*boxSize + 10) && checkBlocks(tractor.x + boxSize, tractor.y)) {
        tank.x = tractor.x;
        tank.y = tractor.y;
        tractor.x += boxSize;
        moveAudio.play();
    }
    if (direction == "up" && tractor.y > 10 && checkBlocks(tractor.x, tractor.y - boxSize)) {
        tank.x = tractor.x;
        tank.y = tractor.y;
        tractor.y -= boxSize;
        moveAudio.play();
    }
    if (direction == "down" && tractor.y < ((rows - 1)*boxSize + 10) && checkBlocks(tractor.x, tractor.y + boxSize)) {
        tank.x = tractor.x;
        tank.y = tractor.y;
        tractor.y += boxSize;
        moveAudio.play();
    }
}

function bulletMove() {
    for (let i = 0; i < bulletTop.length; i++) {
        if (bulletTop[i].y > ((rows - 1) * boxSize + 10)) {
            bulletTop[i].y = 10;
        }
        else bulletTop[i].y += boxSize;
    }
    for (let i = 0; i < bulletBottom.length; i++) {
        if (bulletBottom[i].y < 10) {
            bulletBottom[i].y = (rows - 1) * boxSize+ 10;
        }
        else bulletBottom[i].y -= boxSize;
    }
    return;
}

function checkBoom() {
    for (let i = 0; i < bulletTop.length; i++) {
        if (bulletTop[i].x == tractor.x && bulletTop[i].y == tractor.y) {
            boomAudio.play();
            tractorBoom = true;
            return;
        }
        if (bulletTop[i].x == tank.x && bulletTop[i].y == tank.y) {
            connected = false;
            boomAudio.play();
            tank.x = 10;
            tank.y = Math.floor(Math.random() * rows)*boxSize + 10;
            arrows.y = tank.y;
            //tractor.x = 780;
            //tractor.y = 220;
            tractorImg.src = "img/tractor.png";
        }
    }
    for (let i = 0; i < bulletBottom.length; i++) {
        if (bulletBottom[i].x == tractor.x && bulletBottom[i].y == tractor.y) {
            boomAudio.play();
            tractorBoom = true;
            return;
        }
        if (bulletBottom[i].x == tank.x && bulletBottom[i].y == tank.y) {
            connected = false;
            boomAudio.play();
            tank.x = 10;
            tank.y = Math.floor(Math.random() * rows)*boxSize + 10;
            arrows.y = tank.y;
            //tractor.x = 780;
            //tractor.y = 220;
            tractorImg.src = "img/tractor.png";
        }
    }
}

function clearFlags() {
    direction = "";
    connected = false;
    checkPrompt = true;
    roundCounter = 0;
    tractorBoom = false;
    boomDrawn = false;
    score = 0;
    tractor.x = 780;
    tractor.y = 220;
    tractorImg.src = "img/tractor.png";
    tank.x = 10;
    tank.y = Math.floor(Math.random() * rows) * boxSize + 10;
    arrows.y = tank.y;
}



function drawBlocks() {
    for (let i = 0; i < blocks.length; i++) {
        ctx.drawImage(blockImg, blocks[i].x, blocks[i].y);
    }
}

function checkBlocks(x, y) {
    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].x == x && blocks[i].y == y) {
            return false;
        }
    }
    return true;
}

function drawStart() {
    ctx.drawImage(bgStart, 0, 0);
}

function draw() {
    if (levelFlag == true) {
        ctx.drawImage(bg, 0, 0);
        ctx.drawImage(tankImg, tank.x, tank.y);
        ctx.drawImage(tractorImg, tractor.x, tractor.y);
        drawBlocks();
        ctx.drawImage(bulletTopImg, bulletTop[0].x, bulletTop[0].y);
        ctx.drawImage(bulletTopImg, bulletTop[1].x, bulletTop[1].y);
        ctx.drawImage(bulletBottomImg, bulletBottom[0].x, bulletBottom[0].y);
        ctx.drawImage(bulletBottomImg, bulletBottom[1].x, bulletBottom[1].y);
        if (boomDrawn == true) {
            alert("Ви успішно дерусифікували " + score + " танчики(ів)");
            clearFlags();
            return;
            }
        checkBoom();
        if (tractorBoom == true) {
            ctx.drawImage(boomImg, tractor.x, tractor.y);
            boomDrawn = true;
        }
        if (connected == false) {
            ctx.drawImage(arrowsImg, arrows.x, arrows.y);
            checkConnect();
            tractorMove();
        }
        else {
            tractorTankMove();
        }
        if (roundCounter % speed == 0) {
            bulletMove();
        }
        roundCounter++;
        //setTimeout(requestAnimationFrame(draw), 200);
    }
}

window.onload = drawStart;

document.getElementById('button').addEventListener("click", function() {
    levelAudio.play();
    const level = document.getElementById('level');
    if (level.value == "level 1") {
        blocks = blocksLevel1;
        speed = 8;
        clearFlags();
        levelFlag = true;
    }
    else if (level.value == "level 2") {
        blocks = blocksLevel2;
        speed = 7;
        clearFlags();
        levelFlag = true;
    }
    else if (level.value == "level 3") {
        blocks = blocksLevel3;
        speed = 6;
        clearFlags();
        levelFlag = true;
    }
});

setInterval(draw, 100);

//setInterval(bulletMove(bulletTop, bulletBottom), 150);





