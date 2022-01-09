function stopBallIfOutOfBounds() {
    const $ball = $('#ball');
    const $field = $('#field');
    const fieldHeight = $field.height();
    const fieldWidth = $field.width();
    const { left: fieldLeft, top: fieldTop } = $field.offset();
    const { left, top } = $ball.position();
  
    const ballSize = 40;
    if (top < fieldTop) {
      $ball.css('top', 0);
    }
    if (left < fieldLeft) {
      $ball.css('left', 0);
    }
    if (left > fieldWidth + fieldLeft - ballSize) {
      $ball.css('left', fieldWidth - ballSize);
    }
    if (top > fieldHeight + fieldTop - ballSize) {
      $ball.css('top', fieldHeight - ballSize);
    }
  }
  
  function moveBall(x, y) {
    const $ball = $('#ball');
    $ball.css('left', `+=${x}`);
    $ball.css('top', `+=${y}`);
    stopBallIfOutOfBounds();
  }
  
  $(() => {
    $('body').keydown(function (e) {
      switch (e.keyCode) {
        case 37: moveBall(-10, 0); break;
        case 38: moveBall(0, -10); break;
        case 39: moveBall(10, 0); break;
        case 40: moveBall(0, 10); break;
      }
    });
  });