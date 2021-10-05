let canvas =/** @type {HTMLCanvasElement} */(document.getElementById("canvas"));
let ctx = canvas.getContext("2d");
canvas.height = canvas.clientHeight;
canvas.width = canvas.clientWidth;
let width = canvas.width;
let height = canvas.height;
let x = height / 2, y = width / 2, dx = 2, dy = 2;
let radius = height / 30;
let paddleWidth = width/5, paddleHeight = 20, paddleX = width / 2;
let leftPressed=false, rightPressed=false;
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
    ctx.fillStyle = "#F02151";
    ctx.fill();
    ctx.closePath();
}
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    if (y + dy - radius <= 0 || y + dy >= height - radius) {
        dy = -dy;
    }
    if (x + dx - radius <= 0 || x + dx >= width - radius) {
        dx = -dx;
    }
    x += dx;
    y += dy;
    //paddle
    if(rightPressed){
        paddleX+=2;
        if(paddleX+paddleWidth>width)
        paddleX=width-paddleWidth;
    }
    if(leftPressed)
    {
        paddleX-=2;
        if(paddleX<0)
        paddleX=0;
    }
    drawPaddle();
}
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
function keyDownHandler(e){
    if(e.key=="Right"||e.key=="ArrowRight") rightPressed=true;
    else if(e.key=="Left"||e.key=="ArrowLeft") leftPressed=true;
}
function keyUpHandler(e){
    if(e.key=="Right"||e.key=="ArrowRight") rightPressed=false;
    else if(e.key=="Left"||e.key=="ArrowLeft") leftPressed=false;
}
setInterval(draw, 10);


















