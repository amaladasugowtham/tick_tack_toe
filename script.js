document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll(".cell");
    const statusText = document.querySelector(".status");
    const resetButton = document.querySelector(".reset-btn");

    let boardState = ["", "", "", "", "", "", "", "", ""];
    let gameActive = true;
    let humanPlayer = "X";
    let aiPlayer = "O";

    // Winning patterns
    const winningPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    function handleCellClick(event) {
        if (!gameActive) return;

        const cell = event.target;
        const index = Array.from(cells).indexOf(cell);

        if (boardState[index] !== "") return;

        // Human Move
        boardState[index] = humanPlayer;
        cell.textContent = humanPlayer;
        cell.style.pointerEvents = "none"; // Disable further clicks on this cell

        if (checkWinner(humanPlayer)) {
            statusText.textContent = `Player ${humanPlayer} wins!`;
            gameActive = false;
            return;
        }

        if (boardState.includes("")) {
            setTimeout(aiMove, 300); // AI makes a move after delay
        } else {
            statusText.textContent = "It's a draw!";
            gameActive = false;
        }
    }

    function aiMove() {
        if (!gameActive) return;

        let bestMove = minimax(boardState, aiPlayer).index;
        boardState[bestMove] = aiPlayer;
        cells[bestMove].textContent = aiPlayer;
        cells[bestMove].style.pointerEvents = "none";

        if (checkWinner(aiPlayer)) {
            statusText.textContent = `AI (${aiPlayer}) wins!`;
            gameActive = false;
        } else if (!boardState.includes("")) {
            statusText.textContent = "It's a draw!";
            gameActive = false;
        }
    }

    function checkWinner(player) {
        return winningPatterns.some(pattern => {
            return pattern.every(index => boardState[index] === player);
        });
    }

    function minimax(board, player) {
        let availableSpots = board.map((val, idx) => val === "" ? idx : null).filter(v => v !== null);

        if (checkWinner(humanPlayer)) return { score: -10 };
        if (checkWinner(aiPlayer)) return { score: 10 };
        if (availableSpots.length === 0) return { score: 0 };

        let moves = [];
        for (let i of availableSpots) {
            let move = {};
            move.index = i;
            board[i] = player;

            if (player === aiPlayer) {
                move.score = minimax(board, humanPlayer).score;
            } else {
                move.score = minimax(board, aiPlayer).score;
            }

            board[i] = ""; // Undo move
            moves.push(move);
        }

        return moves.reduce((bestMove, move) => {
            if (
                (player === aiPlayer && move.score > bestMove.score) ||
                (player === humanPlayer && move.score < bestMove.score)
            ) {
                return move;
            }
            return bestMove;
        }, { score: player === aiPlayer ? -Infinity : Infinity });
    }

    function resetGame() {
        boardState.fill("");
        gameActive = true;
        statusText.textContent = "Your turn (X)";

        cells.forEach(cell => {
            cell.textContent = "";
            cell.style.pointerEvents = "auto";
        });
    }

    // Event Listeners
    cells.forEach(cell => cell.addEventListener("click", handleCellClick));
    resetButton.addEventListener("click", resetGame);

    statusText.textContent = "Your turn (X)";
});
