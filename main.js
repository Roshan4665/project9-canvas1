let canvas =/** @type {HTMLCanvasElement} */(document.getElementById("canvas"));
let ctx = canvas.getContext("2d");
let started = false;
let randomize=false;
let slider = document.getElementById("mySlider");
let size = document.getElementById("size");
let speed = document.getElementById("speed");
canvas.height = canvas.clientHeight;
canvas.width = canvas.clientWidth;
let width = canvas.width;
let height = canvas.height;
ctx.beginPath()
ctx.font = "32px Arial";
ctx.fillStyle = "pink";
ctx.fill();
ctx.textBaseline = 'middle';
ctx.textAlign = 'center';

ctx.strokeText("TAP TO START", width / 2, height / 2);
ctx.closePath();
function rand()
{
    if(randomize==true)
    return (Math.random()-0.5)*100;
    else
    return 0;
}

function play() {
    let score = 0, bricksBroken = 0;

    let radius = height / 30;
    let y = 3 * height / 5, x = width / 2, dy = 2 + (parseInt(speed.value)) * 18 / 100, dx = 2 + parseInt(speed.value) * 20 / 100;
    let lives = 3;
    let paddleWidth = width * parseInt(size.value) / 100, paddleHeight = 20, paddleX = width / 2;
    let leftPressed = false, rightPressed = false;
    let brickHeight = height / 30, brickWidth = width / 6, brickPaddingSide = width / 12, brickPaddingBottom = height / 20, topOffset = height / 10, leftOffset = width / 6;
    let bricks = [];
    if (height > width)
        slider.style.display = "inline";

    for(let i=0;i<4;i++)
    {
        bricks[i]=[];
        for(let j=0;j<3;j++)
        {
            bricks[i][j]={x:0, y:0, paint:true};
        }
    }
    function drawBricks() {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 3; j++) {
                let xpos = leftOffset + j * (brickWidth + brickPaddingSide)+rand();
                let ypos = topOffset + i * (brickHeight + brickPaddingBottom)+rand();
                bricks[i][j].x = xpos, bricks[i][j].y = ypos;
                if (bricks[i][j].paint == true) {
                    ctx.beginPath();
                    ctx.rect(xpos, ypos, brickWidth, brickHeight);
                    ctx.fillStyle = "#21F0D5";
                    ctx.fill();
                    ctx.closePath();
                }
                // console.log(i+"+"+j);
            }
        }
    }
    let gameOver = false;
    function collisionDetection() {
        gameOver = true;
        bricksBroken = 0;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 3; j++) {
                let cb = bricks[i][j];
                if (cb.paint == true) {
                    gameOver = false;
                    if (x + radius > cb.x && x - radius < cb.x + brickWidth) {
                        if (y + radius > cb.y && y - radius < cb.y + brickHeight) {
                            cb.paint = false;

                            if (x > cb.x && x < cb.x + brickWidth)
                                dy = (-1.1*dy)%15;
                            else
                                dx = -1.2*dx;

                        }
                    }
                }
                else {
                    bricksBroken++;
                }

            }
        }
    }





    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = "#33FFF7";
        ctx.fill();
        ctx.closePath();
    }
    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = "#F07865";
        ctx.fill();
        ctx.closePath();
    }
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        drawBricks();
        paddleWidth = width * parseInt(size.value) / 100;
        if (gameOver) {
            ctx.beginPath()
            ctx.font = "28px Arial";
            ctx.fillStyle = "pink";
            ctx.fill();
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            started = false;
            ctx.strokeText("You Won...❤️ " + score, width / 2, height / 2);
            ctx.strokeText("TAP TO RESTART", width / 2, height / 2 + 40);
            ctx.closePath();
            return;
        }


        if (y + dy - radius <= 0) {
            dy = -dy;
        }
        else if (y + radius >= height) {
            lives--;
            x = width / 2, y = 2 * height / 3;
            paddleX=width/2;
            dy=3, dx=3;
            if (lives <= 0) {
                ctx.beginPath()
                ctx.font = "30px Arial";
                ctx.fillStyle = "pink";
                ctx.fill();
                ctx.textBaseline = 'middle';
                ctx.textAlign = 'center';
                started = false;
                ctx.strokeText("Game Over @ " + score, width / 2, height / 2);
                ctx.strokeText("TAP TO RESTART", width / 2, height / 2 + 40);
                ctx.closePath();
                return;

            }
        }
        else if (y + radius >= height - paddleHeight && x + radius >= paddleX && x - radius <= paddleX + paddleWidth)
            dy = -dy;


        if (x + dx - radius <= 0 || x + dx >= width - radius) {
            dx = -dx;
        }

        x += dx;
        y += dy;
        //paddle
        if (rightPressed) {
            paddleX += 5+Math.abs(dy*0.5);
            // slider.value=100*(paddleX+(paddleWidth/2))/width+paddleWidth/2;
            if (paddleX + paddleWidth > width)
                paddleX = width - paddleWidth;
        }
        else if (leftPressed) {
            paddleX -= 5+Math.abs(dy*0.5);
            // slider.value=100*(paddleX+(paddleWidth/2))/width-paddleWidth/2;
            if (paddleX < 0)
                paddleX = 0;
        }
        else if (height > width) {

            paddleX = slider.value * width / 100 - paddleWidth / 2;
        }
        drawPaddle();
        collisionDetection();
        ctx.beginPath()
        ctx.font = "28px Arial";
        ctx.fillStyle = "pink";
        ctx.fill();
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        started = false;
        // console.log(bricksBroken);
        score = parseInt(bricksBroken * 100 * parseInt(speed.value) / parseInt(size.value));
        ctx.strokeText("SCORE " + score, width / 2, 34);

        ctx.closePath();
        requestAnimationFrame(draw);

    }
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    function keyDownHandler(e) {
        if (e.key == "Right" || e.key == "ArrowRight") rightPressed = true;
        else if (e.key == "Left" || e.key == "ArrowLeft") leftPressed = true;
    }
    function keyUpHandler(e) {
        if (e.key == "Right" || e.key == "ArrowRight") rightPressed = false;
        else if (e.key == "Left" || e.key == "ArrowLeft") leftPressed = false;
    }
    draw();
}
canvas.onclick = function () {
    if (!started) {
        started = true;
        play();
    }
};



