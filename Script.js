document.addEventListener("DOMContentLoaded", () => {// set up an event listener to wait for the HTML file to be loaded.
    const board = document.querySelector('.chess-board');// select the HTML element  with the class chess-board and stores it in the varaible board
    const pieces = { // the chess pieces 
        king: '♔',
        queen: '♕',
        bishop: '♗',
        knight: '♘',
        rook: '♖',
        pawn: '♙'
    };

    const initialBoard = [ // this array reppresent the initiall layout of the chess board
        ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'],
        ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
        [], [], [], [], // row  without pieces
        ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
        ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook']
    ];

    // this function create a square for the chess board, give it color and adds piece
    const addPiece = (row, col, piece) => {
        const square = document.createElement('div'); // square is a new div element representing a single square
        const colorClass = (row + col) % 2 === 0 ? 'black' : 'white';
        square.className = colorClass; // determine the square color
       
        if (piece) {// if there is a piece to place 
            const pieceElement = document.createElement('span');// a span element is created 
            pieceElement.innerHTML = pieces[piece];// means that the inner HTML content of the pieceElement (which is a span element) is set to the corresponding Unicode character from the pieces object.
            pieceElement.className = 'piece';// the symbole for the piece is place inside of the span using the pieces object 
           
           
            if (row === 0 || row === 1) {
                pieceElement.classList.add('black-piece');
            } else {
                pieceElement.classList.add('white-piece');
            }
           
           
            square.appendChild(pieceElement);// the span is add to the square
        }
        board.appendChild(square);// the square with or without is a piece is add to the board
    };
//  this nesed loop go through row and column of the chessboard adding the piece function at the position from the initialBoard array 
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            addPiece(row, col, initialBoard[row][col]);
        }
    }

    let draggerPiece = null

    document.addEventListener('dragstart', (event) => {
        if (event.target.classList.contains('piece')) {
            draggedPiece = event.target;
            event.target.classList.add('dragging');
        }
    });

    document.addEventListener('dragstar', (event) => {
        if (event.target,classList.contains('piece')){
            event.target,classList.remove('dragging');
        }
    });

    
