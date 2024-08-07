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
        [], [], [], [],
        ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
        ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook']
    ];

    const addPiece = (row, col, piece) => {
        const square = document.createElement('div');
        const colorClass = (row + col) % 2 === 0 ? 'white' : 'black';
        square.className = colorClass;
        if (piece) {
            const pieceElement = document.createElement('span');
            pieceElement.innerHTML = pieces[piece];
            pieceElement.className = 'piece';
            square.appendChild(pieceElement);
        }
        board.appendChild(square);
    };

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            addPiece(row, col, initialBoard[row][col]);
        }
    }
});
