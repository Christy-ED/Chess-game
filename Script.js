document.addEventListener("DOMContentLoaded", () => {
    const board = document.querySelector('.chess-board');

    const pieces = {
        'king': '♔',
        'queen': '♕',
        'rook': '♖',
        'bishop': '♗',
        'knight': '♘',
        'pawn': '♙'
    };

    const pieceMap = {
        '♔': 'king',
        '♕': 'queen',
        '♖': 'rook',
        '♗': 'bishop',
        '♘': 'knight',
        '♙': 'pawn'
    };

    let kingPosition = {
        'white': { row: 7, col: 4 },
        'black': { row: 0, col: 4 }
    };

    let currentPlayer = 'white';
    const aiPlayer = 'black';

    const initialBoard = [
        ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'],
        ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
        [], [], [], [],
        ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
        ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook']
    ];

    const addPiece = (row, col, piece) => {
        const square = document.createElement('div');
        const colorClass = (row + col) % 2 === 0 ? 'black' : 'white';
        square.className = colorClass;
        square.dataset.row = row;
        square.dataset.col = col;

        if (piece) {
            const pieceElement = document.createElement('span');
            pieceElement.innerHTML = pieces[piece];
            pieceElement.className = 'piece';
            pieceElement.draggable = true;

            const isBlack = row === 0 || row === 1;
            pieceElement.classList.add(isBlack ? 'black-piece' : 'white-piece');

            square.appendChild(pieceElement);

            if (piece === 'king') {
                kingPosition[isBlack ? 'black' : 'white'] = { row, col };
            }
        }
        board.appendChild(square);
    };

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            addPiece(row, col, initialBoard[row][col]);
        }
    }

    const isValidMove = (pieceUnicode, fromRow, fromCol, toRow, toCol) => {
        const piece = pieceMap[pieceUnicode];

        switch (piece) {
            case 'pawn':
                const direction = (fromRow < 4) ? 1 : -1;
                if (fromCol === toCol && (toRow === fromRow + direction || (fromRow === 1 || fromRow === 6) && toRow === fromRow + 2 * direction)) {
                    return true;
                }
                break;
            case 'knight':
                if ((Math.abs(fromRow - toRow) === 2 && Math.abs(fromCol - toCol) === 1) || 
                    (Math.abs(fromRow - toRow) === 1 && Math.abs(fromCol - toCol) === 2)) {
                    return true;
                }
                break;
            case 'bishop':
                if (Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol)) {
                    return true;
                }
                break;
            case 'rook':
                if (fromRow === toRow || fromCol === toCol) {
                    return true;
                }
                break;
            case 'queen':
                if (fromRow === toRow || fromCol === toCol || Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol)) {
                    return true;
                }
                break;
            case 'king':
                if (Math.abs(fromRow - toRow) <= 1 && Math.abs(fromCol - toCol) <= 1) {
                    return true;
                }
                break;
            default:
                return false;
        }
        return false;
    };

    const isKingInCheck = (color) => {
        const kingPos = kingPosition[color];
        const opponentPieces = document.querySelectorAll(`.${color === 'white' ? 'black-piece' : 'white-piece'}`);

        for (let piece of opponentPieces) {
            const fromRow = parseInt(piece.parentElement.dataset.row);
            const fromCol = parseInt(piece.parentElement.dataset.col);
            if (isValidMove(piece.innerHTML.trim(), fromRow, fromCol, kingPos.row, kingPos.col)) {
                return true;
            }
        }
        return false;
    };

    const getAllMoves = (color) => {
        const moves = [];
        const pieces = document.querySelectorAll(`.${color === 'white' ? 'white-piece' : 'black-piece'}`);

        for (let piece of pieces) {
            const fromRow = parseInt(piece.parentElement.dataset.row);
            const fromCol = parseInt(piece.parentElement.dataset.col);

            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    if (isValidMove(piece.innerHTML.trim(), fromRow, fromCol, row, col)) {
                        moves.push({ fromRow, fromCol, toRow: row, toCol: col });
                    }
                }
            }
        }
        return moves;
    };

    const isCheckmate = (color) => {
        if (!isKingInCheck(color)) return false;
        const moves = getAllMoves(color);

        for (let move of moves) {
            const pieceElement = document.querySelector(`[data-row="${move.fromRow}"][data-col="${move.fromCol}"] .piece`);
            const targetSquare = document.querySelector(`[data-row="${move.toRow}"][data-col="${move.toCol}"]`);
            const targetPiece = targetSquare.querySelector('.piece');

            targetSquare.appendChild(pieceElement);
            if (!isKingInCheck(color)) {
                targetSquare.innerHTML = '';
                if (targetPiece) targetSquare.appendChild(targetPiece);
                return false;
            }
            targetSquare.innerHTML = '';
            if (targetPiece) targetSquare.appendChild(targetPiece);
        }
        return true;
    };

    const isStalemate = (color) => {
        if (isKingInCheck(color)) return false;
        const moves = getAllMoves(color);
        return moves.length === 0;
    };

    let draggedPiece = null;
    let fromRow, fromCol;

    document.addEventListener('dragstart', (event) => {
        if (event.target.classList.contains('piece')) {
            draggedPiece = event.target;
            fromRow = parseInt(draggedPiece.parentElement.dataset.row);
            fromCol = parseInt(draggedPiece.parentElement.dataset.col);
            event.target.classList.add('dragging');
        }
    });

    document.addEventListener('dragend', (event) => {
        if (event.target.classList.contains('piece')) {
            event.target.classList.remove('dragging');
        }
    });

    document.addEventListener('dragover', (event) => {
        event.preventDefault();
    });

    document.addEventListener('drop', (event) => {
        event.preventDefault();

        if (event.target.classList.contains('black') || event.target.classList.contains('white')) {
            const toRow = parseInt(event.target.dataset.row);
            const toCol = parseInt(event.target.dataset.col);

            if (draggedPiece && isValidMove(draggedPiece.innerHTML.trim(), fromRow, fromCol, toRow, toCol)) {
                const targetSquare = document.querySelector(`[data-row="${toRow}"][data-col="${toCol}"]`);
                const targetPiece = targetSquare.querySelector('.piece');

                if (targetPiece &&
                    ((draggedPiece.classList.contains('white-piece') && targetPiece.classList.contains('black-piece')) ||
                        (draggedPiece.classList.contains('black-piece') && targetPiece.classList.contains('white-piece')))) {
                    targetSquare.removeChild(targetPiece);
                }

                targetSquare.appendChild(draggedPiece);

                if (draggedPiece.innerHTML.trim() === pieces['king']) {
                    kingPosition[draggedPiece.classList.contains('white-piece') ? 'white' : 'black'] = { row: toRow, col: toCol };
                }

                if (isKingInCheck(draggedPiece.classList.contains('white-piece') ? 'black' : 'white')) {
                    if (isCheckmate(draggedPiece.classList.contains('white-piece') ? 'black' : 'white')) {
                        alert('Checkmate!');
                    } else {
                        alert('Check!');
                    }
                } else if (isStalemate(draggedPiece.classList.contains('white-piece') ? 'black' : 'white')) {
                    alert('Stalemate!');
                }

                draggedPiece = null;

                if (currentPlayer === 'white') {
                    currentPlayer = 'black';
                    setTimeout(makeAIMove, 500);
                    currentPlayer = 'white';
                }
            } else {
                alert('Invalid move');
            }
        }
    });


    
    const makeAIMove = () => {
        const allMoves = getAllMoves('black'); // Get all possible moves for AI
        if (allMoves.length === 0) {
            if (isCheckmate('black')) {
                alert('Checkmate! White wins');
            } else if (isStalemate('black')) {
                alert('Stalemate! It\'s a draw');
            }
            return;
        }
    
        const randomMove = allMoves[Math.floor(Math.random() * allMoves.length)]; // Choose a random move
        const pieceElement = document.querySelector(`[data-row="${randomMove.fromRow}"][data-col="${randomMove.fromCol}"] .piece`);
        const targetSquare = document.querySelector(`[data-row="${randomMove.toRow}"][data-col="${randomMove.toCol}"]`);
        const targetPiece = targetSquare.querySelector('.piece');
    
        // Capture the opponent's piece if present
        if (targetPiece && targetPiece.classList.contains('white-piece')) {
            targetSquare.removeChild(targetPiece);
        }
    
        // Move the AI's piece
        targetSquare.appendChild(pieceElement);
    
        // Update king position if king is moved
        if (pieceElement.innerHTML.trim() === pieces['king']) {
            kingPosition['black'] = { row: randomMove.toRow, col: randomMove.toCol };
        }
    
        // Check if the AI move puts white in check or checkmate
        if (isKingInCheck('white')) {
            if (isCheckmate('white')) {
                alert('Checkmate! Black wins!');
            } else {
                alert('Check!');
            }
        } else if (isStalemate('white')) {
            alert('Stalemate! It\'s a draw!');
        }
    
        currentPlayer = 'white'; // Switch back to the player after the AI move
    };
    
    // This event is triggered when a piece is dropped onto a square on the chessboard
    document.addEventListener('drop', (event) => {
        event.preventDefault(); // Stop the browser from executing its default behavior
    
        // Ensure the piece is dropping on a valid square
        if (event.target.classList.contains('black') || event.target.classList.contains('white')) {
            const toRow = parseInt(event.target.dataset.row);
            const toCol = parseInt(event.target.dataset.col);
    
            // Check if the dragged piece's move is valid according to chess rules
            if (draggedPiece && isValidMove(draggedPiece.innerHTML.trim(), fromRow, fromCol, toRow, toCol)) {
                const targetSquare = document.querySelector(`[data-row="${toRow}"][data-col="${toCol}"]`);
                const targetPiece = targetSquare.querySelector('.piece');
    
                // Capture the opponent's piece if present
                if (targetPiece &&
                    ((draggedPiece.classList.contains('white-piece') && targetPiece.classList.contains('black-piece')) ||
                     (draggedPiece.classList.contains('black-piece') && targetPiece.classList.contains('white-piece')))) {
                    targetSquare.removeChild(targetPiece);
                }
    
                // Move the dragged piece to the target square
                targetSquare.appendChild(draggedPiece);
    
                // Update king position if king is moved
                if (draggedPiece.innerHTML.trim() === pieces['king']) {
                    kingPosition[draggedPiece.classList.contains('white-piece') ? 'white' : 'black'] = { row: toRow, col: toCol };
                }
    
                // Check if the move puts the opponent's King in check or checkmate
                if (isKingInCheck(draggedPiece.classList.contains('white-piece') ? 'black' : 'white')) {
                    if (isCheckmate(draggedPiece.classList.contains('white-piece') ? 'black' : 'white')) {
                        alert('Checkmate!');
                    } else {
                        alert('Check!');
                    }
                } else if (isStalemate(draggedPiece.classList.contains('white-piece') ? 'black' : 'white')) {
                    alert('Stalemate!');
                }
    
                // Reset the dragged piece to null
                draggedPiece = null;
    
                // Trigger AI move after player move
                if (currentPlayer === 'white') {
                    currentPlayer === 'black'; // AI's turn
                    setTimeout(makeAIMove, 500); // AI makes a move after a short delay
                    currentPlayer = 'white'; // Switch back to player
                }
            } else {
                alert('Invalid move');
            }
        }
    });
    

});