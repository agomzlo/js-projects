const players = {
  X: '<img src="/icons/x.svg" alt="player X">',
  O: '<img src="/icons/o.svg" alt="player O">',
};

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = players.X;
let winner = null;
let readyToPlay = false;

const delayTime = 2500;
const $board = document.getElementById("board");
const $cells = [cell0, cell1, cell2, cell3, cell4, cell5, cell6, cell7, cell8];
const $playerTurn = document.getElementById("playerTurn");
const $restart = document.getElementById("restart");

window.addEventListener("load", delayTimeout);

$restart.addEventListener("click", restart);

function init() {
  $cells.forEach(($cell, index) => {
    $cell.addEventListener("click", () => {
      if ($restart.ariaDisabled) {
        $restart.ariaDisabled = false;
      }

      if (board[index] === "" && !winner && readyToPlay) {
        board[index] = currentPlayer;
        $cell.innerHTML = currentPlayer;
        $cell.ariaDisabled = true;
        currentPlayer = currentPlayer === players.X ? players.O : players.X;
        $playerTurn.innerHTML = currentPlayer;
        checkWinner();
      }
    });
  });
}

function checkWinner() {
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // columns
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ];

  winningCombos.forEach((combo) => {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      winner = board[a];
      $cells[a].classList.add("winner-cell");
      $cells[b].classList.add("winner-cell");
      $cells[c].classList.add("winner-cell");
    }
  });

  if (winner) {
    $cells.forEach(($cell) => {
      $cell.ariaDisabled = true;
    });
  }
}

function restart() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = players.X;
  winner = null;
  $board.innerHTML = '<div class="bg-board"></div>';
  $cells.forEach(($cell) => {
    $cell.innerHTML = "";
    $cell.ariaDisabled = false;
    $cell.dataset.readyToPlay = false;
    $cell.classList.remove("winner-cell");
    $board.appendChild($cell);
  });
  $playerTurn.innerHTML = currentPlayer;
  $restart.ariaDisabled = true;
  readyToPlay = false;
  delayTimeout();
}

function delayTimeout() {
  setTimeout(() => {
    readyToPlay = true;
    $cells.forEach(($cell) => {
      $cell.dataset.readyToPlay = true;
    });
    init();
  }, delayTime);
}
