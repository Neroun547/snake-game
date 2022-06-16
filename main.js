const logoScoreSpan = document.querySelector(".logo__score-span");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 800;

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const widthSquare = 16;
const heightSquare = 16;

const gameField = [];

for(let i = 0; i < 784; i++) {
    if(i % widthSquare === 0) {
        gameField.push(i);
    } 
}

let score = 0;

const horizontalTurn = 16;
const verticalTurn = 16;

const colorSnake = "green";

let goSnakeRight = false;
let goSnakeLeft = false;
let goSnakeTop = false;
let goSnakeDown = false;

const widthTarget = 16;
const heightTarget = 16;

const snake = [{ x: 64, y: 64 }, {x: 64, y: 64}];

function drawSquare(x, y, width, height) {
    ctx.fillStyle = colorSnake;
    ctx.fillRect(x, y, width, height);
}

function drawTarget(x, y, width, height) {
    ctx.fillStyle = "blue";
    ctx.fillRect(x, y, width, height);
}

function drawSnake() {
    
    drawSquare(snake[0].x, snake[0].y, widthSquare, heightSquare);

    let prevX = snake[1].x;
    let prevY = snake[1].y;

    if(snake.length > 2) {
        for(let i = 1; i < snake.length; i++) {
            if(snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
                return false;
            }      
            let prevX1 = snake[i].x;
            let prevY1 = snake[i].y;

            snake[i].x = prevX;
            snake[i].y = prevY;
    
            prevX = prevX1;
            prevY = prevY1;

            drawSquare(snake[i].x, snake[i].y, widthSquare, heightSquare);
        }
    }

    return true;
}

window.addEventListener("keydown", (e) => {

    if(e.code === "KeyA" && !goSnakeRight) {
        goSnakeTop = false;
        goSnakeDown = false;
        goSnakeRight = false;

        goSnakeLeft = true;
    } else if(e.code === "KeyD" && !goSnakeLeft) {
        goSnakeTop = false;
        goSnakeDown = false;
        goSnakeLeft = false;

        goSnakeRight = true;
    } else if(e.code === "KeyW" && !goSnakeDown) {
        goSnakeDown = false;
        goSnakeLeft = false;
        goSnakeRight = false;

        goSnakeTop = true;
    } else if(e.code === "KeyS" && !goSnakeTop) {
        goSnakeTop = false;
        goSnakeLeft = false;
        goSnakeRight = false;

        goSnakeDown = true;
    }
});

let randomX = gameField[Math.floor(Math.random() * gameField.length)];
let randomY = gameField[Math.floor(Math.random() * gameField.length)];
new Promise((resolve, reject) => {
    setInterval(() => {
        ctx.clearRect(0, 0, 800, 800);
        ctx.beginPath();
        const drawSnakeFc = drawSnake();
        
        if(!drawSnakeFc) {
            resolve();
        } 
        if(snake[0].x > 800 || snake[0].x < 0 || snake[0].y < 0 || snake[0].y > 800) {
            resolve();
            return;
        }
        if(snake[0].x === randomX && snake[0].y === randomY) {
            score+=1;

            logoScoreSpan.innerHTML = String(score);

            snake.push({ x: snake[snake.length -1].x, y: snake[snake.length -1].y });
        
            randomX = gameField[Math.floor(Math.random() * gameField.length)];
            randomY = gameField[Math.floor(Math.random() * gameField.length)];
        }
        if(goSnakeLeft) {
            snake[1].x = snake[0].x;
            snake[1].y = snake[0].y;
            snake[0].x-=horizontalTurn;
        } else if(goSnakeRight) {
            snake[1].x = snake[0].x;
            snake[1].y = snake[0].y;
            snake[0].x+=horizontalTurn;
        } else if(goSnakeTop) {
            snake[1].x = snake[0].x;
            snake[1].y = snake[0].y;
            snake[0].y-=verticalTurn;
        } else if(goSnakeDown) {
            snake[1].x = snake[0].x;
            snake[1].y = snake[0].y;
            snake[0].y+=verticalTurn;
        }
        drawTarget(randomX, randomY, widthTarget, heightTarget);
    }, 80);    
})
.then(() => {
    alert("You lose. Your score: " + score);
    window.location.reload();
});
