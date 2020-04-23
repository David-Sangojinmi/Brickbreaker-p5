// Brickbreaker game                                                    //
// Author: David Sangojinmi                                             //
// To-dos:                                                              //
// (1) Make so the ball bounces the correct way depending on which side //
// of the brick it collides with                                        //
// (2) The direction and speed of the balls rebound should change based //
// on where it collides with the paddle                                 //
// (3) Maybe change dimensions of the brick (smaller) and the game      //
// screen (wider & shorter)                                             //
// (4) Implement levels and each level will have a different configur-  //
// ation of bricks                                                      //

let gameBegin = true;
let gameActive = false;
let gameFinish = false;
let ballActive = false;

let paddle = {
    xpos: 300,
    ypos: 550,
    speed: 5,
    width: 90,
    height: 20,
};

/* let padpos = {
    left: paddle.xpos - paddle.width / 2,
    right: paddle.xpos + paddle.width / 2,
    top: paddle.ypos - paddle.height / 2,
    bottom: paddle.ypos + paddle.height / 2,
}; */

let bground;
let bbFont;
let scores;
let highScores;
let plyrInput;
let pinput;
let plyrName;
let nameEnter;
//let bbFont3;

let bricks = [1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1];

let game = {
    level: 1,
    score: 0,
    lives: 5,
};

function preload() {
    bground = loadImage("src/bg1.png");
    bbFont = loadImage("src/bbfont.png");
    scores = loadStrings('src/highScores.txt');
    //bbFont1 = loadFont('dpComic.ttf');
}

function setup() {
    let canvas = createCanvas(600, 700);
    canvas.position(10, 120);
    rectMode(CENTER);
    imageMode(CENTER);
    ellipseMode(CENTER);

    plyrName = createElement('p', 'Enter player name:');
    plyrName.position(10, 820);
    pinput = createInput();
    pinput.position(150, 835);
    nameEnter = createButton('Enter');
    nameEnter.position(pinput.x + pinput.width, pinput.y);
    nameEnter.mousePressed(takeInput);

    for (let i = 0; i < bricks.length; i++) {
        if (bricks[i] === 1) {
            bricks[i] = new Brick();
        }
    }
}

function draw() {
    background(0);

    // Gameplay loop
    gameLoop();
}

class Brick {
    constructor(x, y, w, h, collided) {
        this.x = x;
        this.y = y;
        this.w = 97;
        this.h = 36;
        this.r = random(98, 207);
        this.collided = false;
    }

    show() {
        if (this.collided === true) {
            noFill();
            noStroke();
            this.x = 900;
        } else {
            stroke(71, 0, 0);
            strokeWeight(1);
            fill(this.r, 0, 0);
            rect(this.x, this.y, this.w, this.h);
        }
    }
}

class Ball {
    constructor(x, y, d, xspd, yspd) {
        this.x = 300;
        this.y = 530;
        this.d = 20;
        this.xspd = 7;
        this.yspd = 3;
    }

    show() {
        strokeWeight(1);
        stroke(200);
        fill(16, 59, 232);
        circle(this.x, this.y, this.d);
        noStroke();
        fill(222, 222, 222);
        circle(this.x - 3, this.y - 3, 6);
    }

    move() {
        // General movement and edge collision
        this.y -= this.yspd;
        this.x += this.xspd;
        if (this.x + this.d / 2 >= 599) {
            this.xspd = this.xspd * -1;
        }
        if (this.y - this.d / 2 <= 0) {
            this.yspd = this.yspd * -1;
        }
        if (this.x - this.d / 2 <= 0) {
            this.xspd = this.xspd * -1;
        }
        if (this.y + this.d / 2 >= 600) {
            this.x = 300;
            this.y = 529;
            game.score -= 5;
            game.lives -= 1;
            ballActive = false;
            paddle.xpos = 300;
            paddle.ypos = 550;
        }
        // Paddle collision
        if (
            this.y + 10 > paddle.ypos - 9 &&
            this.y < paddle.ypos - 10 &&
            this.x - 10 >= paddle.xpos - 47 &&
            this.x + 10 <= paddle.xpos + 47
        ) {
            this.y -= 5;
            this.xspd = this.xspd * random(0.95, 1.05);
            this.yspd = this.yspd * random(-0.85, -1.15);
        }
    }
}

function takeInput() {
    plyrInput = pinput.value();
    pinput.value('');
}

let ball = new Ball();

function gameStart() {
    // Screen for the start of the game
    image(bground, 300, 350);
    image(bbFont, 300, 165, 338);

    // Instructions
    textAlign(CENTER);
    textStyle(NORMAL);
    textSize(20);
    fill(235);
    textFont("courier");
    text(
        "Welcome! Use the left and right arrow keys to move the paddle. Press the space bar to release the ball. You have five lives. Break the bricks with the ball to get points and if you don't hit the ball, you lose points and a life. Click the button below or press 'g' to start. Good luck!",
        300,
        412,
        340,
        375
    );
    //text("User: " + input.playerName, 300, 545);
    rect(300, 550, 120, 50);
    fill(61, 55, 138);
    textStyle(BOLD);
    text("START", 300, 555);

    // Moving to gameplay
    if (mouseX > 240 && mouseX < 360 && mouseY > 525 && mouseY < 575) {
        if (mouseIsPressed === true) {
            gameBegin = false;
            gameActive = true;
            gameFinish = false;
        }
    }
    if (keyIsPressed === true) {
        if (key === "g") {
            gameBegin = false;
            gameActive = true;
            gameFinish = false;
        }
    }
}

function gamePlay() {
    // Screen for when the game is active
    // Show the game stats: level, points and lives
    fill(125, 125, 125);
    rect(300, 650, 600, 100);
    stroke(71, 71, 71);
    strokeWeight(4);
    line(0, 600, 600, 600);
    noStroke();
    textAlign(CENTER);
    textStyle(BOLD);
    textSize(20);
    fill(250);
    text("Level: " + game.level, 150, 650);
    text("Points: " + game.score, 300, 650);
    text("Lives: " + game.lives, 450, 650);

    // Draw the paddle, bricks and the ball
    rect(paddle.xpos, paddle.ypos, paddle.width, paddle.height, 5, 5, 10, 10);
    for (let i = 0; i < bricks.length; i++) {
        // Not the most efficient way but it will suffice for now
        if (i <= 5) {
            bricks[i].x = 50 + 100 * i;
            bricks[i].y = 20;
        }
        if (i <= 11 && i >= 6) {
            bricks[i].x = 50 + 100 * (i - 6);
            bricks[i].y = 59;
        }
        if (i <= 17 && i >= 12) {
            bricks[i].x = 50 + 100 * (i - 12);
            bricks[i].y = 98;
        }
        if (i <= 23 && i >= 18) {
            bricks[i].x = 50 + 100 * (i - 18);
            bricks[i].y = 137;
        }
        bricks[i].show();
    }
    for (let i = 0; i < bricks.length; i++) {
        if (
            ball.x > bricks[i].x - bricks[i].w / 2 &&
            ball.x < bricks[i].x + bricks[i].w / 2 &&
            ball.y > bricks[i].y - bricks[i].h / 2 &&
            ball.y < bricks[i].y + bricks[i].h / 2
        ) {
            //ball.xspd = ball.xspd * -1;
            ball.yspd = ball.yspd * random(-0.85, -1.15);
            bricks[i].collided = true;
            game.score += 2;
        }
    }
    ball.show();
    if (keyIsPressed === true) {
        if (key === " ") {
            ballActive = true;
        }
    }
    if (ballActive === true) {
        ball.show();
        ball.move();
    }

    // Paddle moving
    if (keyIsPressed === true) {
        if (keyCode === LEFT_ARROW) {
            paddle.xpos -= paddle.speed;
        }
        if (keyCode === RIGHT_ARROW) {
            paddle.xpos += paddle.speed;
        }
    }
    if (paddle.xpos - 45 <= 0) {
        paddle.xpos = 45;
    }
    if (paddle.xpos + 45 >= 599) {
        paddle.xpos = 555;
    }

    if (game.lives <= 0) {
        gameBegin = false;
        gameActive = false;
        gameFinish = true;
    }
}

function gameEnd() {
    // Screen for when the game has finished
    fill(20, 20, 20);
    rect(300, 350, 600, 700);
    fill(134, 207, 19);
    textSize(30);
    textAlign(CENTER);
    text("GAME OVER", 300, 170);
    textAlign(LEFT);
    textSize(20);
    text("Highscores:", 100, 250);
    textSize(17);
    let score1Pos = 0;
    let score2Pos = 0;
    for (let i = 0; i < scores.length; i++) {
        
        if (i % 2 == 0) {
            textAlign(LEFT);
            text(scores[i], 100, 310 + score2Pos * 30);
            score2Pos++;
        } else {
            textAlign(RIGHT);
            text(scores[i], 500, 310 + score1Pos * 30);
            score1Pos++;
        }
    }
    textAlign(RIGHT);
    text(game.score, 500, 310 + score1Pos * 30);
    textAlign(LEFT);
    text(plyrInput, 100, 310 + score2Pos * 30);
    textAlign(CENTER);
    textSize(17);
    text("Press 'r' to restart", 300, 580);
    
    // To restart the game
    if (keyIsPressed === true) {
        if (key === "r") {
            // Resetting all the variables
            game.score = 0;
            game.lives = 5;
            ball.xspd = ball.xspd * -1;
            ball.yspd = 3;
            for (let i = 0; i < 18; i++) {
                bricks[i].collided = false;
                if (i <= 5) {
                    bricks[i].x = 50 + 100 * i;
                    bricks[i].y = 100;
                }
                if (i <= 11 && i >= 6) {
                    bricks[i].x = 50 + 100 * (i - 6);
                    bricks[i].y = 139;
                }
                if (i <= 17 && i >= 12) {
                    bricks[i].x = 50 + 100 * (i - 12);
                    bricks[i].y = 178;
                }
            }
            gameBegin = true;
            gameActive = false;
            gameFinish = false;
        }
    }
}

function gameLoop() {
    if (gameBegin === true) {
        gameStart();
    }
    if (gameActive === true) {
        gamePlay();
    }
    if (gameFinish === true) {
        gameEnd();
    }
}
