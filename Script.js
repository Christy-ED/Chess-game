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

    let kingposition = {
        'white': { row: 7, col: 4 },
        'black': { row: 0, col: 4 }
    };

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

            if (row === 0 || row === 1) {
                pieceElement.classList.add('black-piece');
            } else {
                pieceElement.classList.add('white-piece');
            }

            square.appendChild(pieceElement);

            if (piece === 'king') {
                kingposition[(row === 7 ? 'white' : 'black')] = { row, col };
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
                if ((Math.abs(fromRow - toRow) === 2 && Math.abs(fromCol - toCol) === 1) || (Math.abs(fromRow - toRow) === 1 && Math.abs(fromCol - toCol) === 2)) {
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
        const kingPosition = kingposition[color];
        const opponentPieces = document.querySelectorAll(`.${color === 'white' ? 'black-piece' : 'white-piece'}`);

        for (let piece of opponentPieces) {
            const fromRow = parseInt(piece.parentElement.dataset.row);
            const fromCol = parseInt(piece.parentElement.dataset.col);
            if (isValidMove(piece.innerHTML.trim(), fromRow, fromCol, kingPosition.row, kingPosition.col)) {
                return true;
            }
        }
        return false;
    };

    const getAllmoves = (color) => {
        const allmoves = [];
        const pieces = document.querySelectorAll(`.${color === 'white' ? 'white-piece' : 'black-piece'}`);

        for (let piece of pieces) {
            const fromRow = parseInt(piece.parentElement.dataset.row);
            const fromCol = parseInt(piece.parentElement.dataset.col);

            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    if (isValidMove(piece.innerHTML.trim(), fromRow, fromCol, row, col)) {
                        allmoves.push({ fromRow, fromCol, toRow: row, toCol: col });
                    }
                }
            }
        }
        return allmoves;
    };

    const isCheckmate = (color) => {
        if (!isKingInCheck(color)) return false;
        const allmoves = getAllmoves(color);

        for (let move of allmoves) {
            const pieceElement = document.querySelector(`[data-row="${move.fromRow}"][data-col="${move.fromCol}"] .piece`);
            const targetSquare = document.querySelector(`[data-row="${move.toRow}"][data-col="${move.toCol}"]`);
            const targetPiece = targetSquare.querySelector('.piece');

            targetSquare.appendChild(pieceElement); // simulate the move
            if (!isKingInCheck(color)) {
                targetSquare.innerHTML = ''; // undo the move
                if (targetPiece) targetSquare.appendChild(targetPiece); // restore the captured piece
                return false;
            }
            targetSquare.innerHTML = ''; // undo the move
            if (targetPiece) targetSquare.appendChild(targetPiece); // restore the captured piece
        }
        return true;
    };

    const isStalemate = (color) => {
        if (isKingInCheck(color)) return false;
        const allmoves = getAllmoves(color);
        return allmoves.length === 0;
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
                event.target.innerHTML = '';
                event.target.appendChild(draggedPiece);

                if (draggedPiece.innerHTML.trim() === pieces['king']) {
                    kingposition[draggedPiece.classList.contains('white-piece') ? 'white' : 'black'] = { row: toRow, col: toCol };
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
            } else {
                alert('Invalid move');
            }
        }
    });
});


