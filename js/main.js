grid = document.querySelector(".grid");
const scoreDisplay = document.querySelector("#score");

const blockWidth = 100;
const blockHeight = 20;

const userStart = [230, 10];
let currentPosition = userStart;

const boardWidth = 560;
const boardHeight = 300;

const ballStart = [270, 40]
let ballCurrent = ballStart;
const ballDiameter = 20;
let ball_xDirection = -2;
let ball_yDirection = 2;

let score = 0;

class Block {
  constructor(xAxis, yAxis) {
    // set the corners of the block
    this.bottomLeft = [xAxis, yAxis];
    this.bottomRight = [xAxis + blockWidth, yAxis];
    this.topLeft = [xAxis, yAxis + blockHeight];
    this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
  }
}

const blocks = [
  new Block(10, 270),
  new Block(120, 270),
  new Block(230, 270),
  new Block(340, 270),
  new Block(450, 270),

  new Block(10, 240),
  new Block(120, 240),
  new Block(230, 240),
  new Block(340, 240),
  new Block(450, 240),

  new Block(10, 210),
  new Block(120, 210),
  new Block(230, 210),
  new Block(340, 210),
  new Block(450, 210),

]

function addBlocks() {
  for (const index in blocks) {
    const block = document.createElement("div");
    block.classList.add("block");
    block.style.left = blocks[index].bottomLeft[0] + "px";
    block.style.bottom = blocks[index].bottomLeft[1] + "px";
    grid.appendChild(block);
  }
}

addBlocks()

//add user
const user = document.createElement("div");
user.classList.add("user");
drawUser();
user.style.bottom = currentPosition[1] + "px";
grid.appendChild(user)

// draw user
function drawUser() {
  user.style.left = currentPosition[0] + "px";
}

// move user
function moveUser(e) {
  switch (e.key) {
    case "ArrowLeft":
      if (currentPosition[0] > 0) {
        currentPosition[0] -= 10;
        drawUser();
      }
      break;

    case "ArrowRight":
      if (currentPosition[0] < boardWidth - blockWidth) {
        currentPosition[0] += 10;
        drawUser();
      }
      break;
  }
}

document.addEventListener('keydown', moveUser);

// add ball
const ball = document.createElement("div");
ball.classList.add("ball");
drawBall();
grid.appendChild(ball);

function drawBall() {
  ball.style.left = ballCurrent[0] + "px";
  ball.style.bottom = ballCurrent[1] + "px";
}

function moveBall() {
  ballCurrent[0] += ball_xDirection;
  ballCurrent[1] += ball_yDirection;
  drawBall();
  checkForCollisions();
}

timerId = setInterval(moveBall, 20);

function checkForCollisions() {
  // check for block collisions
  for (const index in blocks) {
    if ((ballCurrent[0] > blocks[index].bottomLeft[0] && ballCurrent[0] < blocks[index].bottomRight[0]) &&
      ((ballCurrent[1] + ballDiameter) > blocks[index].bottomLeft[1] && ballCurrent[1] < blocks[index].topLeft[1])
    ) {
      const allBlocks = Array.from(document.querySelectorAll(".block"));
      allBlocks[index].classList.remove("block");
      blocks.splice(index, 1);
      changeDirection();
      score++;
      scoreDisplay.innerHTML = score;

      // check for win
      if(blocks.length === 0){
        scoreDisplay.innerHTML = "You Won!";
        clearInterval(timerId);
        document.removeEventListener("keydown", moveUser);
      }
    }
  }

  // check for wall collision
  if (ballCurrent[0] >= (boardWidth - ballDiameter) ||
    ballCurrent[1] >= (boardHeight - ballDiameter) ||
    ballCurrent[0] <= 0) {
    changeDirection()
  }

  //check for user collision
  if (
    (ballCurrent[0] > currentPosition[0] && ballCurrent[0] < currentPosition[0] + blockWidth) &&
    (ballCurrent[1] > currentPosition[1] && ballCurrent[1] < currentPosition[1] + blockHeight)
    ) {
    changeDirection();
  }

  // check for game over
  if (ballCurrent[1] <= 0) {
    clearInterval(timerId);
    scoreDisplay.innerHTML = "You Lost!";
    document.removeEventListener('keydown', moveUser);
  }
}

function changeDirection() {
  // going up right
  if (ball_xDirection === 2 && ball_yDirection === 2) {
    ball_yDirection = -2;
    return;
  }
  // going down right
  if (ball_xDirection === 2 && ball_yDirection === -2) {
    ball_xDirection = -2;
    return;
  }
  // going down left
  if (ball_xDirection === -2 && ball_yDirection === -2) {
    ball_yDirection = 2;
    return;
  }
  // going up left
  if (ball_xDirection === -2 && ball_yDirection === 2) {
    ball_xDirection = 2;
  }
}
