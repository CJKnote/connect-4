/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let WIDTH = 7;
let HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])
let gameOver = false;

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  //dynamically create board based on HEIGHT and WIDTH constants
  for (let i = 0; i<HEIGHT; i++){
    var row =[];
    for (let j=0; j<WIDTH; j++){
      row.push(null);
    }
    board.push(row);
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  //get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.querySelector("#board");
  // TODO: add comment for this code

  //creates the top row of the board which handles the clicks
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  //adding cells for the top row
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // creating the html cells for the rest of the board
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      //setting a coordinate id to each cell
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  for (let y = HEIGHT-1; y >= 0; y--){
    if(board[y][x] === null){
      return y;
    }
  }

  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  //make the piece and add the classes for whose turn
  const piece = document.createElement("div");
  piece.classList.add("piece");
  if(currPlayer === 1){
    piece.classList.add("p1");
  }
  else{
    piece.classList.add("p2");
  }

  //finding the board spot and adding the piece to it
  const spot = document.getElementById(`${y}-${x}`);
  spot.appendChild(piece);
}

/** endGame: announce game end */

function endGame(msg) {
  alert(`${msg} To play again, refresh!`);

  //adding so that game cannot continue after game over.
  gameOver = true;

}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  //prevents game from continuing after the game is over. 
  if(gameOver){
    return endGame('Game is done.');
  }

  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(y, x);
  board[y][x] = currPlayer;

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame 
  if(board.every(row => row.every(cell => cell !== null))){
    return endGame("Tie!");
  }
    

  // switch players
  currPlayer = currPlayer === 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  //loops through square
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      //for every cell, it checks if there is a win from that cell
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      //if the cells are all true for current player in one of the ways, it will return true
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
