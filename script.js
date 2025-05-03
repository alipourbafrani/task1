document.addEventListener("DOMContentLoaded", function () {
  const startBtn = document.getElementById("startBtn");
  const restartBtn = document.getElementById("restartBtn");
  const levelUpMessage = document.getElementById("levelUpMessage");
  const scoreDisplay = document.getElementById("score");
  const hearts = document.getElementById("hearts");
  const gameOverText = document.getElementById("gameOverText");

  let fallSpeed = 5;
  let remainingChances = 3;
  let score = 0;
  let colors = ["red", "blue", "yellow", "purple", "green"];
  let shapes = ["square", "circle", "triangle", "trapezoid", "star"];
  let gameInterval;
  let speedUpInterval;
  let currentLevel = 1;
  startBtn.addEventListener("click", function () {
    startBtn.style.display = "none";
    startGame();
  });

  restartBtn.addEventListener("click", function () {
    location.reload();
  });

  function startGame() {
    gameInterval = setInterval(createShape, 1000);
    speedUpInterval = setInterval(levelUp, 8000);
  }

  function levelUp() {
    if (remainingChances <= 0) {
      clearInterval(speedUpInterval);
      return;
    }
    fallSpeed += 1;
    currentLevel++;

    levelUpMessage.textContent = `Level ${currentLevel} `;
    fadeIn(levelUpMessage, 300);
    setTimeout(function () {
      fadeOut(levelUpMessage, 500);
    }, 2000);
  }

  function createShape() {
    if (remainingChances <= 0) {
      clearInterval(gameInterval);
      return;
    }

    const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];

    const shape = document.createElement("div");
    shape.classList.add("shape", shapeType);
    shape.style.color = color;

    if (shapeType === "square" || shapeType === "circle") {
      shape.style.backgroundColor = color;
    } else if (shapeType === "triangle" || shapeType === "trapezoid") {
      shape.style.borderBottomColor = color;
    }

    const size = 120;
    shape.style.left = `${Math.random() * (window.innerWidth - size)}px`;
    shape.style.top = "-150px";

    document.body.appendChild(shape);

    let position = -150;
    let wasClicked = false;

    shape.addEventListener("click", function () {
      wasClicked = true;
      score++;
      scoreDisplay.textContent = score;
      fadeOut(shape, 300);
    });

    const fallInterval = setInterval(function () {
      if (remainingChances <= 0) {
        clearInterval(fallInterval);
        return;
      }

      position += fallSpeed;
      shape.style.top = `${position}px`;

      if (position > window.innerHeight) {
        clearInterval(fallInterval);

        if (!wasClicked) {
          remainingChances--;
          hearts.querySelectorAll(".heart")[remainingChances].remove();

          if (remainingChances <= 0) {
            clearInterval(gameInterval);
            clearInterval(speedUpInterval);
            fadeIn(gameOverText, 500);
            fadeIn(restartBtn, 500);
          }
        }
      }
    }, 20);
  }

  function fadeIn(element, duration) {
    element.style.opacity = 0;
    element.style.display = "block";
    let start = performance.now();

    function fade() {
      let elapsed = performance.now() - start;
      element.style.opacity = Math.min(elapsed / duration, 1);
      if (elapsed < duration) {
        requestAnimationFrame(fade);
      }
    }

    fade();
  }

  function fadeOut(element, duration) {
    element.style.opacity = 1;
    let start = performance.now();

    function fade() {
      let elapsed = performance.now() - start;
      element.style.opacity = Math.max(1 - elapsed / duration, 0);
      if (elapsed < duration) {
        requestAnimationFrame(fade);
      } else {
        element.style.display = "none";
      }
    }

    fade();
  }
});
