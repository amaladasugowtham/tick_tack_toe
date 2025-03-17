const cells = document.querySelectorAll('.cell');
const statusText = document.querySelector('.status');
const resetButton = document.querySelector('.reset-btn');

let boardState = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let currentPlayer = 'X';

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// Handle Player Move
cells.forEach(cell => {
    cell.addEventListener('click', () => {
        if (!gameActive || boardState[cell.dataset.index] !== '') return;

        boardState[cell.dataset.index] = 'X';
        cell.textContent = 'X';
        checkWinner();

        if (gameActive) {
            setTimeout(computerMove, 500);
        }
    });
});

// AI (Computer) Move
function computerMove() {
    let bestMove = minimax(boardState, 'O').index;
    boardState[bestMove] = 'O';
    cells[bestMove].textContent = 'O';
    checkWinner();
}

// Check Winner
function checkWinner() {
    for (let condition of winningCombinations) {
        let [a, b, c] = condition;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            statusText.textContent = `Player ${boardState[a]} wins!`;
            gameActive = false;
            return;
        }
    }

    if (!boardState.includes('')) {
        statusText.textContent = "It's a draw!";
        gameActive = false;
    }
}

// Minimax Algorithm for AI (Unbeatable)
function minimax(newBoard, player) {
    let availableSpots = newBoard.map((val, i) => val === '' ? i : null).filter(v => v !== null);

    if (checkWin(newBoard, 'X')) return { score: -10 };
    if (checkWin(newBoard, 'O')) return { score: 10 };
    if (availableSpots.length === 0) return { score: 0 };

    let moves = [];
    for (let i of availableSpots) {
        let move = {};
        move.index = i;
        newBoard[i] = player;

        if (player === 'O') {
            move.score = minimax(newBoard, 'X').score;
        } else {
            move.score = minimax(newBoard, 'O').score;
        }

        newBoard[i] = '';
        moves.push(move);
    }

    return moves.reduce((best, move) => {
        if ((player === 'O' && move.score > best.score) || (player === 'X' && move.score < best.score)) {
            return move;
        }
        return best;
    }, { score: player === 'O' ? -Infinity : Infinity });
}

// Check if a player has won
function checkWin(board, player) {
    return winningCombinations.some(combination => 
        combination.every(index => board[index] === player)
    );
}

// Reset Game
resetButton.addEventListener('click', () => {
    boardState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    statusText.textContent = "Player X's turn";
    cells.forEach(cell => cell.textContent = '');
});
