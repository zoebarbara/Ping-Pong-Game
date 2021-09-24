var BAR_LENGTH = 7;
var BOARD_SIZE_W = 50;
var BOARD_SIZE_H = 40;
var REFRESH_RATE = 50;
var gameStatus = {
  status: 'paused',
  scorePlayerA: 0,
  scorePlayerB: 0
}
var ball = {
  position: {
    row: 0,
    column: 0
  },
  direction: 'br'
}
var leftBar = {
  column: 0,
  filaIni: BOARD_SIZE_H - BAR_LENGTH - 1,
  filaEnd: BOARD_SIZE_H - 1
}

var rightBar = {
  column: BOARD_SIZE_W - 1,
  filaIni: BOARD_SIZE_H - BAR_LENGTH - 1,
  filaEnd: BOARD_SIZE_H - 1
}

///////////////////////////////////////////////////////////////////////////
////////////////////////////// BARS ///////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

function drawBar(bar) {
  for (var boardCell of document.getElementsByClassName('board__row__cell')) {
    var boardCellRow = Number(boardCell.dataset.row);
    var boardCellColumn = Number(boardCell.dataset.column);

    if (bar.filaIni <= boardCellRow && boardCellRow <= bar.filaEnd &&
      boardCellColumn === bar.column) {
      boardCell.style.backgroundColor = '#1EFFAE';
    }
  }
}

function deleteBar(bar) {
  for (var boardCell of document.getElementsByClassName('board__row__cell')) {
    var boardCellRow = Number(boardCell.dataset.row);
    var boardCellColumn = Number(boardCell.dataset.column);

    if (bar.filaIni <= boardCellRow && boardCellRow <= bar.filaEnd &&
      boardCellColumn === bar.column) {
      boardCell.style.backgroundColor = '';
    }
  }
}

function moveBarUp(bar) {
  if (bar.filaIni > 0) {
    deleteBar(bar);
    bar.filaIni -= 1;
    bar.filaEnd -= 1;
    drawBar(bar);
  }
}

function moveBarDown(bar) {
  if (bar.filaEnd < BOARD_SIZE_H) {
    deleteBar(bar);
    bar.filaIni += 1;
    bar.filaEnd += 1;
    drawBar(bar);
  }
}


///////////////////////////////////////////////////////////////////////////
////////////////////////////// BOARD ///////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

function drawBoard() {
  var board = document.getElementById('board');
  for (var i = 0; i < BOARD_SIZE_H; i += 1) {
    var row = document.createElement('div');
    row.setAttribute('class', 'board__row');
    row.dataset.row = i;

    for (var j = 0; j < BOARD_SIZE_W; j += 1) {
      var cell = document.createElement('div');
      cell.setAttribute('class', 'board__row__cell');
      cell.dataset.row = i;
      cell.dataset.column = j;
      row.append(cell);
    }
    board.append(row);
  }
}

///////////////////////////////////////////////////////////////////////////
////////////////////////////// BALL ///////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

function deleteBall(ball) {
  var row = ball.position.row;
  var column = ball.position.column;
  //obtener la celda
  for (var ballCell of document.getElementsByClassName('board__row__cell')) {
    if (ballCell.dataset.row == row && ballCell.dataset.column == column) {
      ballCell.style.backgroundColor = '';
      ballCell.style.borderRadius = '';
    }
  }
}

function drawBall(ball) {
  var row = ball.position.row;
  var column = ball.position.column;
  //obtener la celda
  for (var ballCell of document.getElementsByClassName('board__row__cell')) {
    if (ballCell.dataset.row == row && ballCell.dataset.column == column) {
      ballCell.style.backgroundColor = 'white';
      ballCell.style.borderRadius = '50%';
    }
  }
}

function getBallNextRow(ball) {
  if (ball.direction === 'br' || ball.direction === 'bl') {
    return ball.position.row + 1;
  }
  // asumimos tr || tl
  return ball.position.row - 1;
}

function getBallNextColumn(ball) {
  if (ball.direction === 'br' || ball.direction === 'tr') {
    return ball.position.column + 1;
  }
  // asumimos bl || tl
  return ball.position.column - 1;
}

function getBallNextDirection(ball) {
  // TODO 3: verificar que la bola colisiona con las barras 
  // Si es así, devolvemos nueva dirección

  //Si choca con la barra derecha
  if (ball.position.column === BOARD_SIZE_W - 2 && ball.position.row > rightBar.filaIni && ball.position.row < rightBar.filaEnd && ball.direction === 'tr') return 'tl';
  if (ball.position.column === BOARD_SIZE_W - 2 && ball.position.row > rightBar.filaIni && ball.position.row < rightBar.filaEnd && ball.direction === 'br') return 'bl';
  if (ball.position.column === 1 && ball.position.row >= leftBar.filaIni && ball.position.row <= leftBar.filaEnd && ball.direction === 'tl') return 'tr';
  if (ball.position.column === 1 && ball.position.row >= leftBar.filaIni && ball.position.row <= leftBar.filaEnd && ball.direction === 'bl') return 'br';

  // TODO 4: verificar si la bola se escapa por un lateral
  // Si es así: aumentar el gameStatus.scorePlayerA += 1 (o el scorePlayerB)
  // reflejar el contador en el dom (player_a_score o player_b_score)
  // devolver 'gol'

  if (ball.position.row >= BOARD_SIZE_H && ball.direction === 'br') return 'tr'; //fondo
  if (ball.position.row < 0 && ball.direction === 'tr') return 'br';
  if (ball.position.row < 0 && ball.direction === 'tl') return 'bl';
  if (ball.position.row >= BOARD_SIZE_H && ball.direction === 'bl') return 'tl';


  if (ball.position.column >= BOARD_SIZE_W - 1 && (ball.direction === 'tr' || ball.direction === 'br')) {
    gameStatus.scorePlayerA += 1;
    document.getElementById('player_a_score').innerHTML = gameStatus.scorePlayerA;
    ball.direction = 'gol';
  }

  if (ball.position.column < 0 && (ball.direction === 'tl' || ball.direction === 'bl')) {
    gameStatus.scorePlayerB += 1;
    setTimeout(showGol, 1000);
    document.getElementById('player_b_score').innerHTML = gameStatus.scorePlayerB;
    ball.direction = 'gol';
  }

  //if (ball.position.column < 0 && ball.direction === 'bl') return 'br';
  //if (ball.position.column >= BOARD_SIZE_W && ball.direction === 'br') return 'bl';
  //if (ball.position.column < 0 && ball.direction === 'tl') return 'tr';

  return ball.direction;
}

function showGol(){
  let gol = document.getElementsByClassName('gol');
  gol[0].style.display = 'flex';
}

function hideGol(){
  let gol = document.getElementsByClassName('gol');
  gol[0].style.display = '';
}

function moveBall(ball) {
  deleteBall(ball);
  ball.position = {
    row: getBallNextRow(ball),
    column: getBallNextColumn(ball)
  };

  var nextDirection = getBallNextDirection(ball)

  // Todo 6: si nexDirection es 'gol' paramos (pause o volvemos a lanzar la bola desde el estado inicial)
  if (nextDirection === 'gol'){
    gameStatus.status ='paused';
    showGol();
    setTimeout(hideGol, 1000);
    document.getElementById('play_pause_button').innerText = gameStatus.status === 'paused'? 'Play' : 'Paused';
    restartGame();
    return;
  }

    if (nextDirection !== ball.direction) {
      ball.direction = nextDirection;
      moveBall(ball)
      return;
    }
  drawBall(ball);
}

///////////////////////////////////////////////////////////////////////////
////////////////////////////// GAME ///////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

function initGame() {
  drawBoard();
  drawBar(leftBar);
  drawBar(rightBar);
  drawBall(ball);
  updateGame(ball);
  initButtonHandlers();
  initKeyHandlers();
}

// TODO 1: crear función newGame
// reset contadores init game -> OJO con eliminar todo lo que había y volver a crearlo bien
// igual es solo reiniciar los estados

function newGame(){

}


function restartGame(){

  deleteBall(ball);
  ball = {
      position: { row: 0, column: 0 },
      direction: 'br'
    }
  drawBall(ball);

  deleteBar(leftBar);
  deleteBar(rightBar);
  leftBar = {
      column: 0,
      filaIni: BOARD_SIZE_H - BAR_LENGTH - 1,
      filaEnd: BOARD_SIZE_H - 1
    }
  rightBar = {
      column: BOARD_SIZE_W - 1,
      filaIni: BOARD_SIZE_H - BAR_LENGTH - 1,
      filaEnd: BOARD_SIZE_H - 1
    }
    drawBar(leftBar);
    drawBar(rightBar);
}

function updateGame(ball) {
  if (gameStatus.status === 'paused') return;
  moveBall(ball);

  setTimeout(function () {
    updateGame(ball);
  }, REFRESH_RATE);
}

function initButtonHandlers() {
  document.getElementById('play_pause_button').addEventListener('click', function () {
    var currentGameStatus = gameStatus.status;
    var nextGameStatus = currentGameStatus === 'playing' ? 'paused' : 'playing';
    gameStatus.status = nextGameStatus;
    this.innerText = nextGameStatus === 'playing' ? 'Pause' : 'Play';
    updateGame(ball);
  })

  // TODO 2: una vez creado el botón, llamar a newGame cuando se presione
  document.getElementById('new_game_button').addEventListener('click', function () {
    newGame();
  })
}

function initKeyHandlers() {
  document.addEventListener('keydown', function (event) {
    var key = event.code; // event.code => ArrowUp | ArrowDown | KeyW | KeyS

    if (key === 'KeyW') {
      moveBarUp(leftBar)
    }
    if (key === 'KeyS') {
      moveBarDown(leftBar)
    }
    if (key === 'ArrowUp') {
      moveBarUp(rightBar)
    }
    if (key === 'ArrowDown') {
      moveBarDown(rightBar)
    }
  })
}
initGame();