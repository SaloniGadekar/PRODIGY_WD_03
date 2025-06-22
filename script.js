const board = document.getElementById("board");
const statusText = document.getElementById("status");
const modeSelect = document.getElementById("mode");

let currentPlayer = "X";
let cells = Array(9).fill("");
let gameActive = true;
let gameMode = modeSelect.value;

const winningCombos = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

modeSelect.addEventListener("change", () => {
  gameMode = modeSelect.value;
  resetGame();
});

function checkWinner() {
  for (const combo of winningCombos) {
    const [a, b, c] = combo;
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      gameActive = false;
      statusText.textContent = `Player ${cells[a]} wins!`;
      return;
    }
  }

  if (!cells.includes("")) {
    gameActive = false;
    statusText.textContent = "It's a draw!";
  }
}

function handleClick(index) {
  if (!gameActive || cells[index]) return;

  cells[index] = currentPlayer;
  renderBoard();
  checkWinner();

  if (gameActive) {
    if (gameMode === "pvp") {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      statusText.textContent = `Player ${currentPlayer}'s turn`;
    } else if (gameMode === "ai" && currentPlayer === "X") {
      currentPlayer = "O";
      statusText.textContent = "Computer's turn";
      setTimeout(aiMove, 400);
    }
  }
}

function aiMove() {
  if (!gameActive) return;

  // Try to win
  let move = findBestMove("O");
  if (move === null) {
    // Try to block player from winning
    move = findBestMove("X");
  }

  // Otherwise pick random
  if (move === null) {
    const empty = cells
      .map((val, i) => (val === "" ? i : null))
      .filter(i => i !== null);
    move = empty[Math.floor(Math.random() * empty.length)];
  }

  if (move !== null) {
    cells[move] = "O";
    renderBoard();
    checkWinner();

    if (gameActive) {
      currentPlayer = "X";
      statusText.textContent = "Player X's turn";
    }
  }
}

function findBestMove(player) {
  for (const combo of winningCombos) {
    const [a, b, c] = combo;
    const line = [cells[a], cells[b], cells[c]];

    const countPlayer = line.filter(x => x === player).length;
    const countEmpty = line.filter(x => x === "").length;

    if (countPlayer === 2 && countEmpty === 1) {
      if (cells[a] === "") return a;
      if (cells[b] === "") return b;
      if (cells[c] === "") return c;
    }
  }
  return null;
}


function renderBoard() {
  board.innerHTML = "";
  cells.forEach((cell, index) => {
    const div = document.createElement("div");
    div.className = "cell";
    div.textContent = cell;
    div.addEventListener("click", () => handleClick(index));
    board.appendChild(div);
  });
}

function resetGame() {
  currentPlayer = "X";
  cells = Array(9).fill("");
  gameActive = true;
  statusText.textContent = "Player X's turn";
  renderBoard();
}

renderBoard();

