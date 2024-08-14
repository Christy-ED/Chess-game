document.addEventListener("DOMContentLoaded", () => { // set up an event listener to wait for the HTML file to be loaded.

    const board = document.querySelector('.chess-board');  // select the HTML element  with the class chess-board and stores it in the varaible board
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
        'white': { row: 7, col: 4 }, //Intital position of the king
        'black': { row: 0, col: 4 },// Initianl position of the black king

    };

    let currentPlayer = 'white'; //start with the white player
    const aiPlayer = 'black'; //set AI black


    // this array reppresent the initiall layout of the chess board
     const initialBoard = [
        ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'],
        ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
        [], [], [], [],
        ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
        ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook']
    ];
    
     // this function create a square for the chess board, give it color and adds piece.
    const addPiece = (row, col, piece) => {
        const square = document.createElement('div'); // square is a new div element representing a single square.
        const colorClass = (row + col) % 2 === 0 ? 'black' : 'white';
        square.className = colorClass; //determine the square color
        square.dataset.row = row;
        square.dataset.col = col;

         // if there is a piece to place 
        if (piece) {
            const pieceElement = document.createElement('span');// a span element is created 
        // means that the inner HTML content of the pieceElement (which is a span element) is set to the corresponding Unicode character from the pieces object.   
            pieceElement.innerHTML = pieces[piece];
        // the symbole for the piece is place inside of the span using the pieces object. 
            pieceElement.className = 'piece';
            pieceElement.draggable = true;
             
             // determine the piece(span) color.
             if (row === 0 || row === 1) {
                pieceElement.classList.add('black-piece');
            } else {
                pieceElement.classList.add('white-piece');
            }

            square.appendChild(pieceElement);// the span is add to the square

            if (piece === 'king') {
                kingPosition[(row === 7 ? 'white' : 'black')] = { row, col };
            }
        }
        board.appendChild(square);// the square with or without is a piece is add to the board
    };

     //  this nesed loop go through row and column of the chessboard adding the piece function at the position from the initialBoard array.
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            addPiece(row, col, initialBoard[row][col]);
        }
    }
    
     // Move validation function
    const isValidMove = (pieceUnicode, fromRow, fromCol, toRow, toCol) => {
        const piece = pieceMap[pieceUnicode]; // the pieceUnicode is the king symbole which is look up in the piecemap to find the coorect value nd assign it to peiace variabe.
        switch (piece) {
            case 'pawn': // Determine which way the pawn should go.
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

            targetSquare.appendChild(pieceElement);// simulate the move
            if (!isKingInCheck(color)) {
                targetSquare.innerHTML = ''; // undo the move
                if (targetPiece) targetSquare.appendChild(targetPiece);// restore the captured piece

                return false;
            }
            targetSquare.innerHTML = '';// undo the move
            if (targetPiece) targetSquare.appendChild(targetPiece); // restore the captured piece

        }
        return true;
    };


    const isStalemate = (color) => {
        if (isKingInCheck(color)) return false;
        const moves = getAllMoves(color);
        return moves.length === 0;
    };

     // drag and drop functionalities
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
            const toRow = parseInt(event.target.dataset.row);//the torow and tocol var store the row and col id at the target square retrieve from the target square'data attributes.
            const toCol = parseInt(event.target.dataset.col);
    
            // Check if the dragged piece's move is valid according to chess rules
            if (draggedPiece && isValidMove(draggedPiece.innerHTML.trim(), fromRow, fromCol, toRow, toCol)) {// retrieve the HTML content of the dragged piece, which the unicode chart representing the piece. the trim() removes any whitespace around the piece's chart to ensure an exact match.
                const targetSquare = document.querySelector(`[data-row="${toRow}"][data-col="${toCol}"]`);// Check if the target square contains an opponent's piece using the row and column coordinates.
                const targetPiece = targetSquare.querySelector('.piece');// chck if there is already a piece on the target square by looking for the element with the class piece in the target square.
    
                // Capture the opponent's piece if present
                // chck if the the piece being drag is a white piece and if the piece currently on the target square is a black piece.
                if (targetPiece &&
                    ((draggedPiece.classList.contains('white-piece') && targetPiece.classList.contains('black-piece')) ||
                     (draggedPiece.classList.contains('black-piece') && targetPiece.classList.contains('white-piece')))) {// vice versa.
                    targetSquare.removeChild(targetPiece); // if the condition are meet capture the opponent's piece
                }
    
                //Move the dragged piece to the target square 
                targetSquare.appendChild(draggedPiece);
    
                //chck if the peice being move is the king
                if (draggedPiece.innerHTML.trim() === pieces['king']) {
                // chek which white or blck king is being move and updates the king's position with new coardinate after the move.    
                    kingPosition[draggedPiece.classList.contains('white-piece') ? 'white' : 'black'] = { row: toRow, col: toCol };
                }
    
                // Check if the move puts the opponent's King in check or checkmate
                if (isKingInCheck(draggedPiece.classList.contains('white-piece') ? 'black' : 'white')) { // chck wether the piece that was move belong to the white, select black if the dragged piece is white.
                    if (isCheckmate(draggedPiece.classList.contains('white-piece') ? 'black' : 'white')) { // //check if the opponent is checkmate after determine the king is check.
                        alert('Checkmate!');;//the game trigger an alert indicating that checkmates has occured

                    } else {
                        alert('Check!');// the opponent's king is in check but not in checkmate, 

                    }
                 //checks if the opponent has no legal moves left and their king is not in check, leading to a stalemate.   
                } else if (isStalemate(draggedPiece.classList.contains('white-piece') ? 'black' : 'white')) {
                    alert('Stalemate!');//Notifies the player that the game has ended in a stalemate.

                }
    
                // Reset the dragged piece to null
                draggedPiece = null;
    
                // Trigger AI move after player move
                if (currentPlayer === 'white') {
                    currentPlayer = 'black'; // AI's turn
                    setTimeout(makeAIMove, 500); // AI makes a move after a short delay
                    currentPlayer = 'white'; // Switch back to player
                }
            } else {
                alert('Invalid move');
            }
        }
    });
    

})