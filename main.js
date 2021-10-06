let canvas =/** @type {HTMLCanvasElement} */(document.getElementById("canvas"));
let ctx = canvas.getContext("2d");
let started = false;
let slider = document.getElementById("mySlider");
let size = document.getElementById("size");
let speed = document.getElementById("speed");
canvas.height = canvas.clientHeight;
canvas.width = canvas.clientWidth;
let width = canvas.width;
let height = canvas.height;
let columns = 6;
function play() {
    if (started == true)
        document.getElementById("visible").style.display = "none";
    let score = 0, bricksBroken = 0;

    let radius = height / 30;
    let y = 3 * height / 5, x = width / 2, dy = 2 + (parseInt(speed.value)) * 18 / 100, dx = 2 + parseInt(speed.value) * 20 / 100;
    let lives = 3;
    let paddleWidth = width * parseInt(size.value) / 100, paddleHeight = 20, paddleX = Math.min(width / 2, width - paddleWidth);

    let leftPressed = false, rightPressed = false;
    let brickHeight = height / 30, brickWidth = width / 12, brickPaddingSide = width / 15, brickPaddingBottom = height / 18, topOffset = height / 9, leftOffset = width / 10;
    let bricks = [];
    if (height > width) {
        columns = 3;
        brickWidth = width * 3 / 13;
        brickPaddingSide = width / 13;
        leftOffset = width / 13;
    }
    if (height > width)
        slider.style.display = "inline";

    for (let i = 0; i < 4; i++) {
        bricks[i] = [];
        for (let j = 0; j < columns; j++) {
            bricks[i][j] = { x: 0, y: 0, paint: true };
        }
    }
    function drawBricks() {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < columns; j++) {
                let xpos = leftOffset + j * (brickWidth + brickPaddingSide);
                let ypos = topOffset + i * (brickHeight + brickPaddingBottom);
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
            for (let j = 0; j < columns; j++) {
                let cb = bricks[i][j];
                if (cb.paint == true) {
                    gameOver = false;
                    if (x + radius > cb.x && x - radius < cb.x + brickWidth) {
                        if (y + radius > cb.y && y - radius < cb.y + brickHeight) {
                            cb.paint = false;

                            if (x >= cb.x && x <= cb.x + brickWidth)
                                dy = -1.1 * dy;
                            else
                                dx = -1.2 * dx;

                        }
                    }
                }
                else {
                    bricksBroken++;
                }

            }
        }
    }



    let ballCol = "#33FFF7";

    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = ballCol;
        ctx.fill();
        ctx.closePath();
    }
    function drawPaddle() {
        ctx.beginPath();
        var grd = ctx.createLinearGradient(paddleX, 0, paddleX + paddleWidth / 2, 0);
        grd.addColorStop(0, "#eb3434");
        grd.addColorStop(1, "#1ee3c2");
        ctx.fillStyle = grd;
        ctx.fillRect(paddleX, height - paddleHeight, paddleWidth / 2, paddleHeight);
        var grd = ctx.createLinearGradient(paddleX + paddleWidth / 2, 0, paddleX + paddleWidth, 0);
        grd.addColorStop(0, "#1ee3c2");
        grd.addColorStop(1, "#eb3434");
        ctx.fillStyle = grd;
        ctx.fillRect(paddleX + paddleWidth / 2 - 1, height - paddleHeight, paddleWidth / 2 + 1, paddleHeight);
        ctx.closePath();
    }
    let prevX = paddleX;
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (started == false) {
            ctx.beginPath()
            ctx.font = "32px Arial";
            ctx.strokeStyle = "pink";
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            ctx.strokeText("TAP TO START", width / 2, height / 2);
            ctx.closePath();
        }
        
        drawBall();
        drawBricks();
        paddleWidth = width * parseInt(size.value) / 100;
        if (gameOver) {
            // ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath()
            ctx.font = "28px Arial";
            ctx.strokeStyle = "pink";
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            started = false;
            ctx.strokeText("You Won...❤️ " + score, width / 2, height / 2);
            ctx.strokeText("TAP TO RESTART", width / 2, height / 2 + 40);
            ctx.closePath();
            document.getElementById("visible").style.display = "inline";
            return;
        }


        if (y + dy - radius <= 0) {
            dy = -dy;
        }
        else if (y + radius >= height && (x < paddleX || x > paddleX + paddleWidth)) {
            lives--;
            x = width / 2, y = 2 * height / 3;
            dy = Math.abs(dy);
            dx = 3;
            paddleX = Math.min(x, width - paddleWidth);
            if (lives <= 0) {
                ctx.beginPath()
                ctx.font = "30px Arial";
                ctx.strokeStyle = "pink";
                ctx.textBaseline = 'middle';
                ctx.textAlign = 'center';
                started = false;
                ctx.strokeText("Game Over @ " + score, width / 2, height / 2);
                ctx.strokeText("TAP TO RESTART", width / 2, height / 2 + 40);
                ctx.closePath();
                document.getElementById("visible").style.display = "inline";
                return;

            }
        }
        else if (y + radius >= height - paddleHeight && x + radius >= paddleX && x - radius <= paddleX + paddleWidth) {
            dy = -dy;
            ballCol = "#33FFF7";
            if (x < paddleX + 0.05 * paddleWidth || x > paddleX + 0.95 * paddleWidth) {
                dx = -1.1 * dx;
                ballCol = "#eb3434";
            }
        }
        prevX = paddleX;


        if (x + dx - radius <= 0 || x + dx >= width - radius) {
            dx = -dx;
        }
        x += dx;
        y += dy;
        //paddle
        if (rightPressed) {
            paddleX += 5 + Math.abs(dy * 0.5);
            // slider.value=100*(paddleX+(paddleWidth/2))/width+paddleWidth/2;
            if (paddleX + paddleWidth > width)
                paddleX = width - paddleWidth;
        }
        else if (leftPressed) {
            paddleX -= 5 + Math.abs(dy * 0.5);
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
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        score = parseInt(bricksBroken * 100 * parseInt(speed.value) / parseInt(size.value));
        ctx.strokeText("SCORE " + score, width / 2, 32);

        ctx.closePath();
        if(started==true)
        {
            ctx.beginPath()
            ctx.font = "32px Arial";
            ctx.strokeStyle = "pink";
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            ctx.strokeText("LIVES "+lives, width / 2, height / 2);
            ctx.closePath();
        }
        if (started == true)
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
play();
canvas.onclick = function () {
    if (started == false) {
        started = true;
        play();
    }
};



