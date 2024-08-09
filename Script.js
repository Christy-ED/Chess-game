document.addEventListener("DOMContentLoaded", () => {// set up an event listener to wait for the HTML file to be loaded.
    const board = document.querySelector('.chess-board');// select the HTML element  with the class chess-board and stores it in the varaible board.
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

    const initialBoard = [ // this array reppresent the initiall layout of the chess board

        ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'],
        ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
        [], [], [], [],
        ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
        ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook']
    ];
    // this function create a square for the chess board, give it color and adds piece.
    const addPiece = (row, col, piece) => {
        const square = document.createElement('div');// square is a new div element representing a single square.
        const colorClass = (row + col) % 2 === 0 ? 'black' : 'white';
        square.className = colorClass; // determine the square color
        square.dataset.row = row;
        square.dataset.col = col;
          
        // if there is a piece to place 
        if (piece) {
            const pieceElement = document.createElement('span');;// a span element is created 
        // means that the inner HTML content of the pieceElement (which is a span element) is set to the corresponding Unicode character from the pieces object.    
            pieceElement.innerHTML = pieces[piece];
        // the symbole for the piece is place inside of the span using the pieces object 
            pieceElement.className = 'piece';
            pieceElement.draggable = true;

            if (row === 0 || row === 1) {
                pieceElement.classList.add('black-piece');
            } else {
                pieceElement.classList.add('white-piece');
            }


            square.appendChild(pieceElement);// the span is add to the square
        }
        board.appendChild(square);;// the square with or without is a piece is add to the board
    };
//  this nesed loop go through row and column of the chessboard adding the piece function at the position from the initialBoard array.
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            addPiece(row, col, initialBoard[row][col]);
        }
    }
         // Move vlaidation function
    const isValidMove = (pieceUnicode, fromRow, fromCol, toRow, toCol) => {
        // Map the Unicode character to the piece name
        const piece = pieceMap[pieceUnicode];
        switch (piece) {
            case 'pawn': // Determine which way the pawn should move
                const direction = (fromRow < 4) ? 1 : -1;
                if (fromCol === toCol && (toRow === fromRow + direction || (fromRow === 1 || fromRow === 6) && toRow === fromRow + 2 * direction)) {
                    return true;
                }
                break;
            case 'knight':
                if (Math.abs(fromRow - toRow) === 2 && Math.abs(fromCol - toCol) === 1 || Math.abs(fromRow - toRow) === 1 && Math.abs(fromCol - toCol) === 2) {
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
 
    // drag and drop functionalities.  
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
                draggedPiece = null;
            } else {
                alert('Invalid move');
            }
        }
    });
});
