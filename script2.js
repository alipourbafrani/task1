$(document).ready(function () {
  let fallSpeed = 5;
  let remainingChances = 3;
  let score = 0;
  let colors = ["red", "blue", "yellow", "purple", "black"];
  let shapes = ["square", "circle", "triangle", "trapezoid", "star"];
  let gameInterval;
  let speedUpInterval;
  let currentLevel = 1;

  $("#startBtn").click(function () {
    $(this).hide();
    startGame();
  });

  $("#restartBtn").click(function () {
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

    $("#levelUpMessage").html(`Level ${currentLevel} ! `).fadeIn(300);
    setTimeout(function () {
      $("#levelUpMessage").fadeOut(500);
    }, 2000);
  }

  function createShape() {
    if (remainingChances <= 0) {
      clearInterval(gameInterval);
      return;
    }

    const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];

    const shape = $('<div class="shape"></div>');
    shape.addClass(shapeType);
    shape.css("color", color);

    if (shapeType === "square" || shapeType === "circle") {
      shape.css("background-color", color);
    } else if (shapeType === "triangle" || shapeType === "trapezoid") {
      shape.css("border-bottom-color", color);
    }

    const size = 120;
    shape.css({
      left: Math.random() * (window.innerWidth - size) + "px",
      top: "-150px",
    });

    $("body").append(shape);

    let position = -150;
    let wasClicked = false;

    shape.click(function () {
      wasClicked = true;
      score++;
      $("#score").text(score);
      $(this).fadeOut(300);
    });

    const fallInterval = setInterval(function () {
      if (remainingChances <= 0) {
        clearInterval(fallInterval);
        return;
      }

      position += fallSpeed;
      shape.css("top", position + "px");

      if (position > window.innerHeight) {
        clearInterval(fallInterval);

        if (!wasClicked) {
          remainingChances--;
          $("#hearts .heart").eq(remainingChances).remove();

          if (remainingChances <= 0) {
            clearInterval(gameInterval);
            clearInterval(speedUpInterval);
            $("#gameOverText").fadeIn(500);
            $("#restartBtn").fadeIn(500);
          }
        }
      }
    }, 20);
  }
});
